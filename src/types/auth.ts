// src/types/auth.ts
export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  phone?: string;
  jobTitle?: string;
  preferences?: {
    language: string;
    timezone: string;
    dateFormat: string;
  };
  notifications?: {
    email: boolean;
    push: boolean;
    alerts: boolean;
    weeklyReports: boolean;
    systemUpdates: boolean;
  };
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
  