const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8080/api";

/* =========================
   COMMON HEADERS (IMPORTANT)
========================= */
const getAuthHeaders = () => ({
  "Content-Type": "application/json",
  "role": localStorage.getItem("role"),
  "Authorization": `Bearer ${localStorage.getItem("token")}`
});

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
  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8080/api";
  const res = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return await res.json();
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
  await fetch(`${BASE_URL}/admin/add`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
};

export const updateQuestion = async (id, data) => {
  await fetch(`${BASE_URL}/admin/update/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
};

export const deleteQuestion = async (id) => {
  await fetch(`${BASE_URL}/admin/delete/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
};

export const getAdminQuestionsPaginated = async (page, size) => {
  try {
    const res = await fetch(`${BASE_URL}/admin/questions?page=${page}&size=${size}`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error("Failed to fetch paginated questions");
    return await res.json();
  } catch (error) {
    console.error(error);
    return { content: [], totalPages: 0 };
  }
};