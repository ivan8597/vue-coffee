export interface User {
  id: number;
  name: string;
  surname: string;
  status?: string;
  date_created?: string;
  credentials: UserCredentials;
  active: boolean;
  created: string;
  _comment?: string;
}

export interface UserCredentials {
  username: string;
  passphrase: string;
}