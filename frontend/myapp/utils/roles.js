export const ROLES = {
  ADMIN: "admin",
  TEACHER: "teacher",
  HR: "hr",
  STUDENT: "student"
};

export const permissions = {
  admin: ["dashboard", "users", "batches", "reports"],
  teacher: ["dashboard", "batches"],
  hr: ["dashboard", "users"],
  student: ["dashboard"]
};