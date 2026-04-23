const BASE_URL = "http://localhost:8080/api";

/* =========================
   COMMON HEADERS (IMPORTANT)
========================= */
const getAuthHeaders = () => ({
  "Content-Type": "application/json",
  "role": localStorage.getItem("role"),
});

/* =========================
   GET ALL QUESTIONS
========================= */
export const getQuestions = async () => {
  try {
    const res = await fetch(`${BASE_URL}/quiz/questions`);

    if (!res.ok) throw new Error("Failed to fetch questions");

    return await res.json();
  } catch (error) {
    console.error("Error fetching questions:", error);
    return [];
  }
};

/* =========================
   SUBMIT QUIZ
========================= */
export const submitQuiz = async (answers) => {
  try {
    const res = await fetch(`${BASE_URL}/quiz/submit`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
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