
export interface PostLoginDto {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  id: string;
}

export interface PostCheckTokenDto {
  token: string;
}
