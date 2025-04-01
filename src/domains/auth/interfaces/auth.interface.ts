export interface DecodedUser {
  userId: string;
  role: string;
  email?: string;
}

export interface AuthResponse {
  status: number;
  body: any;
  cookie?: {
    token: string;
    refreshToken?: string;
    options: any;
    refresh?: {
      token: string;
      options: any;
    };
  };
}
