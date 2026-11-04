export interface User {
  id: number;
  login: string;
  prenom: string;
  nom: string;
  email: string;
}

export interface NewUser extends Omit<User, 'id'> {
  password: string;
}

export interface UserUpdate extends Omit<User, 'id'> {
  password?: string;
}
