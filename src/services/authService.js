
import api from "./api";

// Patient registration
export const registerPatient = (patientData) => {
  return api.post("/patients/register", patientData);
};

// Doctor registration
export const registerDoctor = (doctorData) => {
  return api.post("/doctors/register", doctorData);
};

// User login
export const loginUser = (loginData) => {
  return api.post("/auth/login", loginData);
};
