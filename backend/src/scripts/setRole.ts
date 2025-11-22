import { firebaseAdmin } from "../config/firebase";
import { connectDB } from "../config/database"; // asegúrate de importar tu conexión a Mongo
import { UserModel } from "../models/user.model";

async function setUserRole() {
  const uid = "YO04Wjzb8WgjbGVz1KAhbp8JyG83"; // 👈 UID del usuario en Firebase
  const role = "vendedor"; // o "vendedor", "comprador"

  try {
    // 1️⃣ Conectarse a MongoDB
    await connectDB();

    // 2️⃣ Asignar el rol en Firebase Auth
    await firebaseAdmin.auth().setCustomUserClaims(uid, { role });
    console.log(`✅ Rol '${role}' asignado correctamente en Firebase al usuario ${uid}`);

    // 3️⃣ Buscar y actualizar el usuario en MongoDB
    const updatedUser = await UserModel.findOneAndUpdate(
      { uid },
      { rol: role, estado: "activo" },
      { new: true }
    );

    if (!updatedUser) {
      console.warn(`⚠️ Usuario con UID ${uid} no encontrado en MongoDB.`);
    } else {
      console.log(`✅ Usuario actualizado en MongoDB:`, updatedUser);
    }

    process.exit(0);
  } catch (err) {
    console.error("❌ Error asignando rol:", err);
    process.exit(1);
  }
}

setUserRole();
