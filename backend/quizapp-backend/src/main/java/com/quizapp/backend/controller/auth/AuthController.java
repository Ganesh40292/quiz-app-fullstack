package com.quizapp.backend.controller.auth;

import java.util.HashMap;
import java.util.Map;

import org.springframework.web.bind.annotation.*;

import org.springframework.beans.factory.annotation.Autowired;
import com.quizapp.backend.config.JwtUtil;
import com.quizapp.backend.config.AdminUserInitializer;

import java.util.Optional;
import org.springframework.security.crypto.password.PasswordEncoder;
import com.quizapp.backend.model.User;
import com.quizapp.backend.repository.UserRepository;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin("*")
public class AuthController {

    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @org.springframework.beans.factory.annotation.Value("${google.client.id:}")
    private String googleClientId;

    private final org.springframework.web.client.RestTemplate restTemplate = new org.springframework.web.client.RestTemplate();

    // 🔒 Admin Security Question Configuration
    public static final String CREATOR_SECURITY_QUESTION = "What is the nickname of the creator of project?";
    private static final String CREATOR_SECURITY_ANSWER = "gampu";
    private static final String CREATOR_ALERT_EMAIL = "ganeshprasad40292.dev@gmail.com";
    private static final String WEB3FORMS_ACCESS_KEY = "1dd4eaeb-c34a-43de-9ea2-4a5b8fcf933b";

    // Track failed admin login attempts
    private final Map<String, Integer> adminFailedAttempts = new java.util.concurrent.ConcurrentHashMap<>();

    private boolean isAdminUsername(String username) {
        if (username == null) return false;
        return AdminUserInitializer.AUTHORIZED_ADMINS.keySet().stream()
                .anyMatch(u -> u.equalsIgnoreCase(username.trim()));
    }

    @PostMapping("/login")
    public Map<String, Object> login(@RequestBody Map<String, String> req, jakarta.servlet.http.HttpServletRequest httpRequest) {
        String username = req.get("username") != null ? req.get("username").trim() : "";
        String password = req.get("password");

        Map<String, Object> res = new HashMap<>();

        if (username.isEmpty() || password == null) {
            res.put("status", "fail");
            res.put("message", "Username and password are required");
            return res;
        }

        String trackerKey = username.toLowerCase();
        int failedCount = adminFailedAttempts.getOrDefault(trackerKey, 0);

        // 1. If admin user has failed 3+ times, require security question challenge
        if (isAdminUsername(username) && failedCount >= 3) {
            res.put("status", "challenge");
            res.put("message", "Security Verification Required");
            res.put("question", CREATOR_SECURITY_QUESTION);
            res.put("attempts", failedCount);
            return res;
        }

        // 2. Find user by username
        Optional<User> optionalUser = userRepository.findByUsername(username);

        if (optionalUser.isPresent()) {
            User user = optionalUser.get();

            // 3. Check password
            if (passwordEncoder.matches(password, user.getPassword())) {
                // Clear strikes on success
                adminFailedAttempts.remove(trackerKey);

                res.put("status", "success");
                res.put("role", user.getRole());
                res.put("token", jwtUtil.generateToken(username, user.getRole()));
                res.put("username", user.getUsername());
                return res;
            }
        }

        // ❌ INVALID CREDENTIALS
        if (isAdminUsername(username)) {
            int newCount = adminFailedAttempts.merge(trackerKey, 1, Integer::sum);
            logger.warn("Admin failed attempt {} for user: {}", newCount, username);

            if (newCount >= 3) {
                res.put("status", "challenge");
                res.put("message", "Security Verification Required");
                res.put("question", CREATOR_SECURITY_QUESTION);
                res.put("attempts", newCount);
                return res;
            }
        }

        res.put("status", "fail");
        res.put("message", "Invalid credentials");
        return res;
    }

    @PostMapping("/verify-security-question")
    public Map<String, Object> verifySecurityQuestion(@RequestBody Map<String, String> req, jakarta.servlet.http.HttpServletRequest httpRequest) {
        String username = req.get("username") != null ? req.get("username").trim() : "";
        String password = req.get("password");
        String securityAnswer = req.get("securityAnswer") != null ? req.get("securityAnswer").trim() : "";

        Map<String, Object> res = new HashMap<>();
        String trackerKey = username.toLowerCase();
        String clientIp = httpRequest.getHeader("X-Forwarded-For");
        if (clientIp == null || clientIp.isEmpty()) {
            clientIp = httpRequest.getRemoteAddr();
        }

        // Verify security question answer
        if (!CREATOR_SECURITY_ANSWER.equalsIgnoreCase(securityAnswer)) {
            logger.error("🚨 SECURITY CHALLENGE FAILED by user: {}, Answer: {}", username, securityAnswer);

            // Send security alert email directly to creator
            sendSecurityAlertEmail(username, clientIp, securityAnswer);

            res.put("status", "blocked");
            res.put("message", "You are not able to access admin");
            return res;
        }

        // Answer is correct! Now verify credentials
        Optional<User> optionalUser = userRepository.findByUsername(username);
        if (optionalUser.isPresent() && passwordEncoder.matches(password, optionalUser.get().getPassword())) {
            User user = optionalUser.get();
            adminFailedAttempts.remove(trackerKey);

            logger.info("Admin successfully authenticated via Security Question: {}", username);
            res.put("status", "success");
            res.put("role", user.getRole());
            res.put("token", jwtUtil.generateToken(username, user.getRole()));
            res.put("username", user.getUsername());
            return res;
        }

        res.put("status", "fail");
        res.put("message", "Security answer verified, but password was incorrect.");
        return res;
    }

    private void sendSecurityAlertEmail(String attemptedUsername, String clientIp, String wrongAnswer) {
        new Thread(() -> {
            try {
                String web3FormsUrl = "https://api.web3forms.com/submit";
                Map<String, String> payload = new HashMap<>();
                payload.put("access_key", WEB3FORMS_ACCESS_KEY);
                payload.put("name", "Quizora Security Sentinel");
                payload.put("email", "security-alert@quizora.dev");
                payload.put("subject", "[SECURITY ALERT] Unauthorized Admin Access Attempt on Quizora!");
                payload.put("message", String.format(
                        "🚨 CRITICAL SECURITY ALERT: Unauthorized Admin Access Attempt\n\n" +
                        "A user attempted to gain administrative access (3+ failed attempts) and provided an INCORRECT answer to the creator's security question.\n\n" +
                        "• Targeted Admin Account: %s\n" +
                        "• Client IP Address: %s\n" +
                        "• Incorrect Answer Entered: \"%s\"\n" +
                        "• Timestamp: %s\n\n" +
                        "Result: The user was locked out with the message 'You are not able to access admin'.",
                        attemptedUsername, clientIp, wrongAnswer, java.time.LocalDateTime.now()
                ));

                restTemplate.postForObject(web3FormsUrl, payload, Map.class);
                logger.info("Security alert dispatched to {} for user {}", CREATOR_ALERT_EMAIL, attemptedUsername);
            } catch (Exception e) {
                logger.error("Failed to dispatch security alert to {}: {}", CREATOR_ALERT_EMAIL, e.getMessage());
            }
        }).start();
    }

    @PostMapping("/register")
    public Map<String, Object> register(@RequestBody User user) {
        Map<String, Object> res = new HashMap<>();

        if (user.getUsername() == null || user.getUsername().trim().isEmpty() ||
            user.getPassword() == null || user.getPassword().trim().isEmpty()) {
            res.put("status", "fail");
            res.put("message", "Username and password are required");
            return res;
        }

        String username = user.getUsername().trim();

        // 🔒 CANNOT REGISTER RESERVED ADMIN USERNAMES
        if (isAdminUsername(username)) {
            res.put("status", "fail");
            res.put("message", "This username is reserved and cannot be registered.");
            return res;
        }

        if (userRepository.findByUsername(username).isPresent()) {
            res.put("status", "fail");
            res.put("message", "Username already exists");
            return res;
        }

        String email = (user.getEmail() != null && !user.getEmail().trim().isEmpty())
                ? user.getEmail().trim().toLowerCase()
                : username.toLowerCase().replaceAll("\\s+", "") + "@gmail.com";

        if (userRepository.findByEmail(email).isPresent()) {
            res.put("status", "fail");
            res.put("message", "Email is already registered");
            return res;
        }

        user.setUsername(username);
        user.setEmail(email);
        // Hash password before saving
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        
        // 🔒 SECURITY HARDENING: All public registrations are strictly assigned USER role
        // Admin accounts must only be granted through protected administrative configuration
        user.setRole("USER");

        userRepository.save(user);

        logger.info("New user registered successfully: {}", username);
        res.put("status", "success");
        res.put("message", "User registered successfully");
        return res;
    }

    @PostMapping("/google")
    public Map<String, Object> googleAuth(@RequestBody Map<String, String> req) {
        Map<String, Object> res = new HashMap<>();

        String credential = req.get("credential");
        if (credential == null || credential.trim().isEmpty()) {
            credential = req.get("idToken");
        }

        String email = req.get("email");
        String name = req.get("name");

        // 🔒 SERVER-SIDE GOOGLE ID TOKEN VERIFICATION
        if (credential != null && !credential.trim().isEmpty()) {
            try {
                String tokenInfoUrl = "https://oauth2.googleapis.com/tokeninfo?id_token=" + credential;
                @SuppressWarnings("unchecked")
                Map<String, Object> tokenPayload = restTemplate.getForObject(tokenInfoUrl, Map.class);

                if (tokenPayload != null && tokenPayload.containsKey("email")) {
                    email = (String) tokenPayload.get("email");
                    if (tokenPayload.containsKey("name")) {
                        name = (String) tokenPayload.get("name");
                    }
                    String aud = (String) tokenPayload.get("aud");
                    if (googleClientId != null && !googleClientId.trim().isEmpty() && aud != null) {
                        if (!googleClientId.trim().equals(aud.trim())) {
                            logger.warn("Google token audience mismatch: expected {}, received {}", googleClientId, aud);
                            res.put("status", "fail");
                            res.put("message", "Invalid Google token client audience");
                            return res;
                        }
                    }
                } else {
                    res.put("status", "fail");
                    res.put("message", "Failed to verify Google ID token");
                    return res;
                }
            } catch (Exception ex) {
                logger.error("Error verifying Google ID token with Google servers: {}", ex.getMessage());
                res.put("status", "fail");
                res.put("message", "Invalid or expired Google authentication token");
                return res;
            }
        }

        if (email == null || email.trim().isEmpty()) {
            res.put("status", "fail");
            res.put("message", "Valid verified email is required for Google Authentication");
            return res;
        }

        String cleanEmail = email.trim().toLowerCase();

        // 1. Efficient O(1) indexed database query
        Optional<User> existingUser = userRepository.findByEmail(cleanEmail);

        User user;

        if (existingUser.isPresent()) {
            user = existingUser.get();
        } else {
            // 2. Derive sanitized base username from name or email
            String baseUsername = (name != null && !name.trim().isEmpty())
                    ? name.trim().replaceAll("[^a-zA-Z0-9]", "")
                    : cleanEmail.split("@")[0].replaceAll("[^a-zA-Z0-9]", "");

            if (baseUsername.isEmpty()) {
                baseUsername = "googleuser";
            }

            // 3. Ensure unique username in database
            String finalUsername = baseUsername;
            int counter = 1;
            while (userRepository.findByUsername(finalUsername).isPresent()) {
                finalUsername = baseUsername + counter++;
            }

            // Auto-create new Google User with USER role
            user = new User();
            user.setUsername(finalUsername);
            user.setEmail(cleanEmail);
            user.setPassword(passwordEncoder.encode("GOOGLE_OAUTH_" + System.currentTimeMillis()));
            user.setRole("USER");
            userRepository.save(user);
            logger.info("New Google user created: {}", finalUsername);
        }

        res.put("status", "success");
        res.put("role", user.getRole());
        res.put("token", jwtUtil.generateToken(user.getUsername(), user.getRole()));
        res.put("username", user.getUsername());
        res.put("email", user.getEmail());
        return res;
    }
}