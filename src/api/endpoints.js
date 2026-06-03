import { apiFetch } from "./client";

// AUTH
export const loginApi = (payload) => apiFetch("/api/auth/login", { method: "POST", body: payload, auth: false });
export const registerApi = (payload) => apiFetch("/api/auth/registrace", { method: "POST", body: payload, auth: false });

// LEKCE
export const getLessonsApi = () => apiFetch("/api/lekce");
export const createLessonApi = (payload) => apiFetch("/api/lekce/vytvor", { method: "POST", body: payload });
export const approveLessonApi = (lessonId) => apiFetch(`/api/lekce/schval/${lessonId}`, { method: "POST" });

// OTÁZKY + ODPOVĚDI
export const getQuestionsApi = (lessonId) => apiFetch(`/api/otazky/${lessonId}`);
export const sendAnswerApi = (payload) => apiFetch("/api/odpoved", { method: "POST", body: payload });

// STATISTIKY (učitel)
export const teacherOverviewApi = () => apiFetch("/api/statistiky/ucitel/prehled");
export const teacherLessonStatsApi = (lessonId) => apiFetch(`/api/statistiky/ucitel/lekce/${lessonId}`);
export const teacherStudentStatsApi = (studentId) => apiFetch(`/api/statistiky/ucitel/student/${studentId}`);

// STATISTIKY (student – pokud je máš)
export const studentStatsApi = () => apiFetch("/api/statistiky/student");
export const getLessonDetailApi = (lessonId) => apiFetch(`/api/lekce/${lessonId}/detail`);

export const updateLessonApi = (lessonId, payload) => apiFetch(`/api/lekce/${lessonId}`, { method: "PUT", body: payload });

export const updateQuestionApi = (questionId, payload) => apiFetch(`/api/otazky/${questionId}`, { method: "PUT", body: payload });
export const deleteQuestionApi = (questionId) => apiFetch(`/api/otazky/${questionId}`, { method: "DELETE" });

export const startAttemptApi = (lessonId) =>
  apiFetch(`/api/test/${lessonId}/start`, { method: "POST", body: {} });

export const nextQuestionApi = (lessonId) =>
  apiFetch(`/api/test/${lessonId}/next`);

export const finishAttemptApi = (lessonId) =>
  apiFetch(`/api/test/${lessonId}/finish`, { method: "POST", body: {} });


export const teacherStudentsApi = (query = "") =>
  apiFetch(`/api/ucitel/studenti?query=${encodeURIComponent(query)}`);

export const getLessonAssignApi = (lessonId) =>
  apiFetch(`/api/lekce/${lessonId}/prirazeni`);

export const saveLessonAssignApi = (lessonId, studentIds) =>
  apiFetch(`/api/lekce/${lessonId}/prirazeni`, {
    method: "POST",
    body: { studentIds },
  });

export const deleteLessonApi = (lessonId) =>
  apiFetch(`/api/lekce/${lessonId}`, { method: "DELETE" });

export const lessonStudentsOverviewApi = (lessonId) =>
  apiFetch(`/api/lekce/${lessonId}/prehled-zaku`);

export const allowRepeatBatchApi = (lessonId, studentIds) =>
  apiFetch(`/api/test-admin/povolit-opakovani-hromadne`, {
    method: "POST",
    body: { lessonId, studentIds },
  });

export const addStudentsToLessonApi = (lessonId, studentIds) =>
  apiFetch(`/api/lekce/${lessonId}/pridat-zaky`, {
    method: "POST",
    body: { studentIds },
  });