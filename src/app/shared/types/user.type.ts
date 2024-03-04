export type CUser = {
  name: string;
  email: string;
  photo: string;
  username: string;
  position: string;
  colors: string[];
  uid: string;
  bio: string;
  phone: string;
  address: string;
  accounts: {}[];
};

export type LoginCredential = {
  email: string;
  password: string;
};

export type RegisterCredential = {
  username: string;
  email: string;
  password: string;
};

export type UpdateUser = CUser;
