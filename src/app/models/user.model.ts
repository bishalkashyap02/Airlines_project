export interface User {
  id: number;
  name: string;
  address: string;
  username: string;
  password: string;
  role: 'user' | 'admin';
}
