import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authService, type UserData } from '@/lib/firebase';
import type { User as FirebaseUser } from 'firebase/auth';

interface AuthContextType {
  user: UserData | null;
  firebaseUser: FirebaseUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  register: (email: string, password: string, firstName: string, lastName: string, role?: UserData['role']) => Promise<{ success: boolean; message?: string }>;
  googleSignIn: (role?: UserData['role']) => Promise<{ success: boolean; message?: string }>;
  logout: () => Promise<void>;
  updateUser: (updates: Partial<UserData>) => Promise<void>;
  updateUserStatus: (userId: string, status: UserData['status']) => Promise<void>;
  getAllUsers: () => Promise<UserData[]>;
  hasRole: (roles: UserData['role'][]) => boolean;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserData | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Listen to auth state changes
  useEffect(() => {
    const unsubscribe = authService.onAuthStateChanged(async (firebaseUser) => {
      setFirebaseUser(firebaseUser);
      
      if (firebaseUser) {
        try {
          const userData = await authService.getCurrentUserData(firebaseUser.uid);
          if (userData && userData.status === 'active') {
            setUser(userData);
            setIsAuthenticated(true);
          } else {
            // User is blocked or data doesn't exist
            await authService.logout();
            setUser(null);
            setIsAuthenticated(false);
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
          setUser(null);
          setIsAuthenticated(false);
        }
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
      
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<{ success: boolean; message?: string }> => {
    try {
      const { userData } = await authService.login(email, password);
      setUser(userData);
      setIsAuthenticated(true);
      return { success: true };
    } catch (error: any) {
      return { success: false, message: error.message || 'Login failed' };
    }
  }, []);

  const register = useCallback(async (
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    role: UserData['role'] = 'buyer'
  ): Promise<{ success: boolean; message?: string }> => {
    try {
      const { userData } = await authService.register(email, password, firstName, lastName, role);
      setUser(userData);
      setIsAuthenticated(true);
      return { success: true };
    } catch (error: any) {
      return { success: false, message: error.message || 'Registration failed' };
    }
  }, []);

  const googleSignIn = useCallback(async (role: UserData['role'] = 'buyer'): Promise<{ success: boolean; message?: string }> => {
    try {
      const { userData } = await authService.signInWithGoogle(role);
      setUser(userData);
      setIsAuthenticated(true);
      return { success: true };
    } catch (error: any) {
      return { success: false, message: error.message || 'Google sign in failed' };
    }
  }, []);

  const logout = useCallback(async () => {
    await authService.logout();
    setUser(null);
    setFirebaseUser(null);
    setIsAuthenticated(false);
  }, []);

  const updateUser = useCallback(async (updates: Partial<UserData>) => {
    if (!user) return;
    await authService.updateUserProfile(user.uid, updates);
    setUser({ ...user, ...updates });
  }, [user]);

  const updateUserStatus = useCallback(async (userId: string, status: UserData['status']) => {
    await authService.updateUserStatus(userId, status);
  }, []);

  const getAllUsers = useCallback(async (): Promise<UserData[]> => {
    return await authService.getAllUsers();
  }, []);

  const hasRole = useCallback((roles: UserData['role'][]): boolean => {
    return user ? roles.includes(user.role) : false;
  }, [user]);

  const refreshUser = useCallback(async () => {
    if (firebaseUser) {
      const userData = await authService.getCurrentUserData(firebaseUser.uid);
      if (userData) {
        setUser(userData);
      }
    }
  }, [firebaseUser]);

  return (
    <AuthContext.Provider
      value={{
        user,
        firebaseUser,
        isAuthenticated,
        isLoading,
        login,
        register,
        googleSignIn,
        logout,
        updateUser,
        updateUserStatus,
        getAllUsers,
        hasRole,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
