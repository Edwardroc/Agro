import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut,
  User as FirebaseUser
} from 'firebase/auth';
import { auth } from '../config/firebase';
import { api } from '../config/api';
import { RegisterData, LoginData, User } from '../interfaces/user.interface';

export const authService = {
  register: async (data: RegisterData): Promise<{ firebaseUser: FirebaseUser; mongoUser: User }> => {
    try {
      // 1. Crear usuario en Firebase
      const userCredential = await createUserWithEmailAndPassword(
        auth, 
        data.email, 
        data.password
      );
      
      const firebaseUser = userCredential.user;
      const token = await firebaseUser.getIdToken();
      
      // Guardar token
      localStorage.setItem('firebaseToken', token);

      const initialStatus = data.rol?.toLowerCase() === 'comprador' ? 'activo' : 'pendiente';
      
      // 2. Registrar en MongoDB con snake_case
      const mongoUser = await api.post<User>('/user', {
        uid: firebaseUser.uid,
        primer_nombre: data.primer_nombre,
        segundo_nombre: data.segundo_nombre,
        primer_apellido: data.primer_apellido,
        segundo_apellido: data.segundo_apellido,
        email: data.email,
        telefono: data.telefono,
        rol: data.rol,
        direccion: data.direccion,
        estado: initialStatus 
      });

      return { 
        firebaseUser, 
        mongoUser: mongoUser.data 
      };
    } catch (error: any) {
      console.error("Error detallado en el registro:", error); 
      
      if (error.code) {
        switch (error.code) {
          case 'auth/weak-password':
            throw new Error('La contraseña debe tener al menos 6 caracteres.');
          case 'auth/invalid-email':
            throw new Error('El formato del correo electrónico es inválido.');
          case 'auth/email-already-in-use':
            throw new Error('Este correo electrónico ya está registrado.');
          default:
            throw new Error(error.message || 'Error desconocido de Firebase.');
        }
      }
      throw new Error(error.response?.data?.message || error.message);
    }
  },

  login: async (data: LoginData): Promise<{ firebaseUser: FirebaseUser; mongoUser: User }> => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth, 
        data.email, 
        data.password
      );
      
      const firebaseUser = userCredential.user;
      const token = await firebaseUser.getIdToken();
      
      localStorage.setItem('firebaseToken', token);

      // Obtener datos del usuario de MongoDB
      const response = await api.get<User>(`/user/${firebaseUser.uid}`);
      
      return { 
        firebaseUser, 
        mongoUser: response.data 
      };
    } catch (error: any) {
      throw new Error(error.response?.data?.message || error.message);
    }
  },

  logout: async (): Promise<void> => {
    await signOut(auth);
    localStorage.removeItem('firebaseToken');
  },

  getCurrentUser: async (uid: string): Promise<User> => {
    const response = await api.get<User>(`/user/${uid}`);
    return response.data;
  },

  updateProfile: async (id: string, data: Partial<User>): Promise<User> => {
    const response = await api.put<User>(`/user/${id}`, data);
    return response.data;
  }
};