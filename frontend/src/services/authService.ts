import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut,
  User as FirebaseUser
} from 'firebase/auth';
import { auth } from '../config/firebase';
import { api } from '../config/api';
// Nota: RegisterData y User deben estar actualizadas en este archivo:
// RegisterData: debe incluir primerNombre, segundoNombre, primerApellido, segundoApellido
// User: debe incluir primerNombre, segundoNombre, primerApellido, segundoApellido
import { RegisterData, LoginData, User } from '../interfaces/user.interface';

export const authService = {
  // Registrar usuario en Firebase y MongoDB
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
      
      // 2. Registrar en MongoDB
      const mongoUser = await api.post<User>('/user', {
        uid: firebaseUser.uid,
        
        // 👇 CAMPOS DE NOMBRE/APELLIDO RECIBIDOS Y ENVIADOS POR SEPARADO 👇
        primerNombre: data.primerNombre,
        segundoNombre: data.segundoNombre,
        primerApellido: data.primerApellido,
        segundoApellido: data.segundoApellido,
        // -----------------------------------------------------------------
        
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
    } 
      catch (error: any) {
        // 👇 CÓDIGO DE DEPURACIÓN MEJORADO 👇
        console.error("Error detallado en el registro:", error); 
        
        // Mapea los errores comunes de Firebase para dar un mensaje claro
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

  // Login
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

  // Logout
  logout: async (): Promise<void> => {
    await signOut(auth);
    localStorage.removeItem('firebaseToken');
  },

  // Obtener usuario actual de MongoDB
  getCurrentUser: async (uid: string): Promise<User> => {
    const response = await api.get<User>(`/user/${uid}`);
    return response.data;
  },

  // Actualizar perfil
  updateProfile: async (id: string, data: Partial<User>): Promise<User> => {
    const response = await api.put<User>(`/user/${id}`, data);
    return response.data;
  }
};