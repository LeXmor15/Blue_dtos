// src/types/auth.ts
export interface User {
    id: string;
    email: string;
    name: string;
    role: string;
  }
  
  export interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
  }
  
  export interface LoginCredentials {
    email: string;
    password: string;
  }
  
  export interface RegisterData {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
  }
  
  export interface ForgotPasswordData {
    email: string;
  }
  