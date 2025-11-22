// backend/src/scripts/setUserRole.ts
import { firebaseAdmin } from '../config/firebase';

async function setUserRole(uid: string, role: 'admin' | 'vendedor' | 'comprador') {
  try {
    await firebaseAdmin.auth().setCustomUserClaims(uid, { role });
    console.log(`✅ Rol ${role} asignado a usuario ${uid}`);
  } catch (error) {
    console.error('❌ Error asignando rol:', error);
  }
}

// Ejemplo de uso:
// setUserRole('firebase_uid_aqui', 'admin');