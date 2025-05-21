// src/services/authService.ts
import { User, LoginCredentials, RegisterData, ForgotPasswordData } from '../types/auth';
import api from './api';

// Función para simular demora en desarrollo
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Datos de usuario simulados para desarrollo
const MOCK_USER: User = {
  id: '1',
  email: 'user@example.com',
  name: 'Test User',
  role: 'admin',
};

// Determinar si estamos usando datos simulados
const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';

const authService = {
  // Verificar estado de autenticación al cargar la aplicación
  async checkAuthStatus(): Promise<User | null> {
    if (USE_MOCK) {
      await delay(500);
      const userJSON = localStorage.getItem('user');
      return userJSON ? JSON.parse(userJSON) : null;
    }
    
    try {
      const response = await api.get('/auth/me');
      return response.data.user;
    } catch (error) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      return null;
    }
  },

  // Iniciar sesión
  async login(credentials: LoginCredentials): Promise<User> {
    if (USE_MOCK) {
      await delay(800);
      
      // Simulación simple de verificación de credenciales
      if (credentials.email === 'admin@admin.com' && credentials.password === 'admin123') {
        localStorage.setItem('token', 'mock-jwt-token');
        localStorage.setItem('user', JSON.stringify(MOCK_USER));
        return MOCK_USER;
      } else {
        throw new Error('Invalid email or password');
      }
    }
    
    const response = await api.post('/auth/login', credentials);
    const { user, token } = response.data;
    
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    
    return user;
  },

  // Registrar nuevo usuario
  async register(data: RegisterData): Promise<User> {
    if (USE_MOCK) {
      await delay(800);
      
      // Verificar que las contraseñas coincidan
      if (data.password !== data.confirmPassword) {
        throw new Error('Passwords do not match');
      }
      
      // Simular registro exitoso
      const newUser = {
        ...MOCK_USER,
        email: data.email,
        name: data.name,
      };
      
      localStorage.setItem('token', 'mock-jwt-token');
      localStorage.setItem('user', JSON.stringify(newUser));
      
      return newUser;
    }
    
    const response = await api.post('/auth/register', data);
    const { user, token } = response.data;
    
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    
    return user;
  },

  // Actualizar perfil de usuario
  async updateProfile(profileData: Partial<User>): Promise<User> {
    if (USE_MOCK) {
      await delay(800);

      // Actualizar el usuario en localStorage
      const userJSON = localStorage.getItem('user');
      if (userJSON) {
        const currentUser = JSON.parse(userJSON);
        const updatedUser = { ...currentUser, ...profileData };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        return updatedUser;
      }
      throw new Error('User not found');
    }

    const response = await api.put('/auth/profile', profileData);
    const updatedUser = response.data.user;

    // Actualizar en localStorage
    localStorage.setItem('user', JSON.stringify(updatedUser));

    return updatedUser;
  },

  // Actualizar contraseña
  async updatePassword(data: { currentPassword: string, newPassword: string }): Promise<void> {
    if (USE_MOCK) {
      await delay(800);
      // Simulación de verificación de contraseña actual
      if (data.currentPassword !== 'password') {
        throw new Error('Current password is incorrect');
      }
      return;
    }

    await api.put('/auth/password', data);
  },

  // Actualizar preferencias
  async updatePreferences(preferences: any): Promise<User> {
    if (USE_MOCK) {
      await delay(600);

      const userJSON = localStorage.getItem('user');
      if (userJSON) {
        const currentUser = JSON.parse(userJSON);
        const updatedUser = {
          ...currentUser,
          preferences: {
            ...currentUser.preferences,
            ...preferences
          }
        };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        return updatedUser;
      }
      throw new Error('User not found');
    }

    const response = await api.put('/auth/preferences', { preferences });
    const updatedUser = response.data.user;
    localStorage.setItem('user', JSON.stringify(updatedUser));
    return updatedUser;
  },

  // Actualizar configuración de notificaciones
  async updateNotifications(notifications: any): Promise<User> {
    if (USE_MOCK) {
      await delay(600);

      const userJSON = localStorage.getItem('user');
      if (userJSON) {
        const currentUser = JSON.parse(userJSON);
        const updatedUser = {
          ...currentUser,
          notifications: {
            ...currentUser.notifications,
            ...notifications
          }
        };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        return updatedUser;
      }
      throw new Error('User not found');
    }

    const response = await api.put('/auth/notifications', { notifications });
    const updatedUser = response.data.user;
    localStorage.setItem('user', JSON.stringify(updatedUser));
    return updatedUser;
  },

  // Solicitar restablecimiento de contraseña
  async forgotPassword(data: ForgotPasswordData): Promise<void> {
    if (USE_MOCK) {
      await delay(500);
      // Solo simulamos que fue exitoso
      return;
    }
    
    await api.post('/auth/forgot-password', data);
  },

  // Cerrar sesión
  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
};

export default authService;