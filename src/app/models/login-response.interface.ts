import { Paciente } from "./patient.interface.js";

export interface LoginResponse {
  message: string;
  data: Paciente;
  token: string;
}
