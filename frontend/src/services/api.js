const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8080/api";

/* =========================
   AUTH HELPER & HEADERS
========================= */
const checkAuthStatus = (res) => {
  if (res && (res.status === 401 || res.status === 403)) {
    console.warn("[API] Auth token expired or invalid (HTTP " + res.status + "). Clearing session.");
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("username");
    localStorage.removeItem("email");
    if (window.location.pathname !== "/login" && window.location.pathname !== "/register") {
      window.location.href = "/login";
    }
  }
};

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  const headers = { "Content-Type": "application/json" };
  if (role) headers["role"] = role;
  if (token && token !== "undefined" && token !== "null") {
    headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
};

/* =========================
   GET ALL / FILTERED QUESTIONS
========================= */
export const getQuestions = async (category = "", difficulty = "") => {
  try {
    let url = `${BASE_URL}/quiz/questions`;
    const params = [];
    if (category) params.push(`category=${encodeURIComponent(category)}`);
    if (difficulty) params.push(`difficulty=${encodeURIComponent(difficulty)}`);
    if (params.length) {
      url += `?${params.join("&")}`;
    }
    
    const res = await fetch(url);

    if (!res.ok) throw new Error("Failed to fetch questions");

    return await res.json();
  } catch (error) {
    console.error("Error fetching questions:", error);
    return [];
  }
};

/* =========================
   REGISTER USER
========================= */
export const registerUser = async (data) => {
  try {
    const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8080/api";
    const res = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const text = await res.text();
    try {
      return JSON.parse(text);
    } catch {
      return { status: "fail", message: res.ok ? "Registration succeeded" : `Server error (${res.status})` };
    }
  } catch (error) {
    console.error("Error registering user:", error);
    return { status: "fail", message: "Network error or backend not reachable" };
  }
};

/* =========================
   GOOGLE OAUTH LOGIN
========================= */
export const googleLogin = async (data) => {
  try {
    const res = await fetch(`${BASE_URL}/auth/google`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return await res.json();
  } catch (error) {
    console.error("Error with Google login:", error);
    return { status: "fail", message: "Network error with Google authentication" };
  }
};

/* =========================
   SUBMIT QUIZ
========================= */
export const submitQuiz = async (answers) => {
  try {
    const res = await fetch(`${BASE_URL}/quiz/submit`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(answers),
    });

    checkAuthStatus(res);
    if (!res.ok) throw new Error("Failed to submit quiz");

    return await res.json();
  } catch (error) {
    console.error("Error submitting quiz:", error);
    return { score: 0, total: 0 };
  }
};

/* =========================
   GAMIFICATION APIs
========================= */
export const getLeaderboard = async () => {
  try {
    const res = await fetch(`${BASE_URL}/quiz/leaderboard`, {
      headers: getAuthHeaders(),
    });
    checkAuthStatus(res);
    return await res.json();
  } catch (err) {
    console.error(err);
    return [];
  }
};

export const getUserHistory = async () => {
  try {
    const res = await fetch(`${BASE_URL}/quiz/history`, {
      headers: getAuthHeaders(),
    });
    checkAuthStatus(res);
    return await res.json();
  } catch (err) {
    console.error(err);
    return [];
  }
};

/* =========================
   ADMIN APIs (SECURED)
========================= */

export const getStats = async () => {
  try {
    const res = await fetch(`${BASE_URL}/quiz/stats`);
    return await res.json();
  } catch {
    return {};
  }
};

export const addQuestion = async (data) => {
  const res = await fetch(`${BASE_URL}/admin/add`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  checkAuthStatus(res);
};

export const updateQuestion = async (id, data) => {
  const res = await fetch(`${BASE_URL}/admin/update/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  checkAuthStatus(res);
};

export const deleteQuestion = async (id) => {
  const res = await fetch(`${BASE_URL}/admin/delete/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  checkAuthStatus(res);
};

export const getAdminQuestionsPaginated = async (page, size) => {
  try {
    const res = await fetch(`${BASE_URL}/admin/questions?page=${page}&size=${size}`, {
      headers: getAuthHeaders(),
    });
    checkAuthStatus(res);
    if (!res.ok) throw new Error("Failed to fetch paginated questions");
    return await res.json();
  } catch (error) {
    console.error(error);
    return { content: [], totalPages: 0 };
  }
};