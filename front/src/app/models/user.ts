export interface SignupRequest {
  login: string;
  prenom: string;
  nom: string;
  email: string;
  password: string;
}

export interface SignupResponse {
  id: number;
  message: string;
}