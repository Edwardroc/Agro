import React, { createContext, useState, useEffect, useContext } from 'react';
import { User as FirebaseUser, onAuthStateChanged } from 'firebase/auth';
import { auth } from '../config/firebase';
import { authService } from '../services/authService';
import { User, LoginData, RegisterData } from '../interfaces/user.interface';

interface AuthContextType {
  firebaseUser: FirebaseUser | null;
  mongoUser: User | null;
  loading: boolean;
  login: (data: LoginData) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [mongoUser, setMongoUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setFirebaseUser(user);
      
      if (user) {
        try {
          const token = await user.getIdToken();
          localStorage.setItem('firebaseToken', token);
          
          const userData = await authService.getCurrentUser(user.uid);
          setMongoUser(userData);
        } catch (error) {
          console.error('Error obteniendo datos del usuario:', error);
          setMongoUser(null);
        }
      } else {
        setMongoUser(null);
        localStorage.removeItem('firebaseToken');
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (data: LoginData) => {
    try {
      const { firebaseUser: fbUser, mongoUser: mUser } = await authService.login(data);
      setFirebaseUser(fbUser);
      setMongoUser(mUser);
    } catch (error) {
      throw error;
    }
  };

  const register = async (data: RegisterData) => {
    try {
      const { firebaseUser: fbUser, mongoUser: mUser } = await authService.register(data);
      setFirebaseUser(fbUser);
      setMongoUser(mUser);
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    await authService.logout();
    setFirebaseUser(null);
    setMongoUser(null);
  };

  const refreshUser = async () => {
    if (firebaseUser) {
      const userData = await authService.getCurrentUser(firebaseUser.uid);
      setMongoUser(userData);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      firebaseUser, 
      mongoUser, 
      loading, 
      login, 
      register, 
      logout,
      refreshUser
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de AuthProvider');
  }
  return context;
};