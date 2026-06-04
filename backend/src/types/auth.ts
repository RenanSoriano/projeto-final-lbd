export enum UserType {
  Admin = "Admin",
  Escuderia = "Escuderia",
  Piloto = "Piloto"
}

export type AuthUser = {
  userId: string;
  login: string;
  tipo: UserType;
  idOriginal: string | null;
  name: string;
};

export type TokenPayload = {
  userId: string;
  tipo: UserType;
};
