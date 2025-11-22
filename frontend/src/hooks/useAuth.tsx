import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  User as FirebaseUser,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';
import { auth } from '../config/firebase';
import {api} from '../config/api';

interface User {
  _id?: string;
  uid: string;
  nombre: string;
  email: string;
  rol: 'admin' | 'vendedor' | 'comprador';
  telefono?: string;
  direccion?: {
    departamento: string;
    ciudad: string;
    detalle: string;
  };
  foto_perfil?: string;
  estado?: 'aceptado' | 'pendiente' | 'rechazado'; // Tipado mejorado
}

interface AuthContextType {
  user: User | null;
  firebaseUser: FirebaseUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, userData: Partial<User>) => Promise<void>; // Firma corregida
  logout: () => Promise<void>;
  updateUserProfile: (data: Partial<User>) => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setFirebaseUser(firebaseUser);
      
      if (firebaseUser) {
        await loadUserProfile(firebaseUser.uid);
      } else {
        setUser(null);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const loadUserProfile = async (uid: string) => {
    try {
      const token = await auth.currentUser?.getIdToken();
      if (token) {
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      }

      const response = await api.get(`/user/${uid}`);
      setUser(response.data);
    } catch (error) {
      console.error('Error cargando perfil de usuario:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const token = await userCredential.user.getIdToken();
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      await loadUserProfile(userCredential.user.uid);
    } catch (error: any) {
      console.error('Error en login:', error);
      throw new Error(getFirebaseErrorMessage(error.code));
    }
  };

  const register = async (email: string, password: string, userData: Partial<User>) => { // Firma corregida
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const token = await userCredential.user.getIdToken();
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      // Aseguramos el rol, por defecto 'comprador'
      const rol = userData.rol || 'comprador';

      // ** MODIFICACIÓN CLAVE: LÓGICA DE APROBACIÓN AUTOMÁTICA **
      // Compradores y Admin se aceptan automáticamente. Vendedores quedan 'pendiente'.
      const estadoInicial = (rol === 'comprador' || rol === 'admin') 
          ? 'aceptado' 
          : 'pendiente';
      
      const newUser = {
        uid: userCredential.user.uid,
        email,
        nombre: userData.nombre || '',
        rol: rol,
        telefono: userData.telefono,
        direccion: userData.direccion,
        estado: estadoInicial // <--- Enviando el estado corregido
      };

      await api.post('/user', newUser);
      await loadUserProfile(userCredential.user.uid);
    } catch (error: any) {
      console.error('Error en registro:', error);
      throw new Error(getFirebaseErrorMessage(error.code));
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setFirebaseUser(null);
      delete api.defaults.headers.common['Authorization'];
    } catch (error) {
      console.error('Error en logout:', error);
      throw error;
    }
  };

  const updateUserProfile = async (data: Partial<User>) => {
    if (!user?._id) throw new Error('Usuario no encontrado');

    try {
      const response = await api.put(`/user/${user._id}`, data);
      setUser(response.data);
    } catch (error) {
      console.error('Error actualizando perfil:', error);
      throw error;
    }
  };

  const refreshUser = async () => {
    if (firebaseUser) {
      await loadUserProfile(firebaseUser.uid);
    }
  };

  const value: AuthContextType = {
    user,
    firebaseUser,
    loading,
    login,
    register,
    logout,
    updateUserProfile,
    refreshUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};

const getFirebaseErrorMessage = (errorCode: string): string => {
  const errorMessages: Record<string, string> = {
    'auth/email-already-in-use': 'El correo electrónico ya está en uso',
    'auth/invalid-email': 'Correo electrónico inválido',
    'auth/operation-not-allowed': 'Operación no permitida',
    'auth/weak-password': 'La contraseña es muy débil',
    'auth/user-disabled': 'Usuario deshabilitado',
    'auth/user-not-found': 'Usuario no encontrado',
    'auth/wrong-password': 'Contraseña incorrecta',
    'auth/too-many-requests': 'Demasiados intentos. Intenta más tarde',
    'auth/network-request-failed': 'Error de conexión'
  };

return errorMessages[errorCode] || 'Error en la autenticación';
};