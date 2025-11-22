import { Request, Response } from "express";
import { UserModel } from "../models/user.model";
import { NotificationModel } from "../models/notification.model";
import { firebaseAdmin } from "../config/firebase";

// 🟢 Crear un nuevo usuario
export const createUser = async (req: Request, res: Response) => {
  try {
    const {
      uid,
      primer_nombre,
      segundo_nombre,
      primer_apellido,
      segundo_apellido,
      email,
      rol,
      telefono,
      direccion,
    } = req.body;

    // 1️⃣ Verificar duplicados por UID o correo
    const existingUser = await UserModel.findOne({ $or: [{ uid }, { email }] });
    if (existingUser) {
      return res.status(400).json({ message: "El usuario ya existe" });
    }

    // 2️⃣ Crear usuario en la base de datos
    const newUser = await UserModel.create({
      uid,
      primer_nombre,
      segundo_nombre,
      primer_apellido,
      segundo_apellido,
      email,
      rol,
      telefono,
      direccion: {
        departamento: direccion?.departamento || "",
        ciudad: direccion?.ciudad || "",
        detalle: direccion?.detalle || "",
      },
      estado: rol === "vendedor" ? "pendiente" : "activo",
      fecha_registro: new Date(),
    });

    // 3️⃣ Notificar al administrador si es un vendedor pendiente
    if (rol === "vendedor") {
      const nombreCompleto = `${primer_nombre} ${segundo_nombre || ""} ${primer_apellido} ${segundo_apellido || ""}`.trim();

      await NotificationModel.create({
        usuario_uid: "admin-system", // puedes usar el UID de un admin real
        mensaje: `Nuevo vendedor pendiente de aprobación: ${nombreCompleto} (${email})`,
        tipo: "sistema",
      });
    }

    res.status(201).json({
      message: "Usuario creado correctamente",
      user: newUser,
    });
  } catch (error) {
    console.error("❌ Error creando usuario:", error);
    res.status(500).json({ message: "Error al crear usuario" });
  }
};

// 🔵 Obtener todos los usuarios (solo admin)
export const getAllUsers = async (_req: Request, res: Response) => {
  try {
    const users = await UserModel.find();
    res.json(users);
  } catch (error) {
    console.error("Error obteniendo usuarios:", error);
    res.status(500).json({ message: "Error al obtener usuarios" });
  }
};

// 🔵 Obtener usuario por UID de Firebase
export const getUserByFirebaseUID = async (req: Request, res: Response) => {
  try {
    const { uid } = req.params;
    const user = await UserModel.findOne({ uid });

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    res.json(user);
  } catch (error) {
    console.error("Error obteniendo usuario:", error);
    res.status(500).json({ message: "Error al obtener usuario" });
  }
};

// ✏️ Actualizar usuario
export const updateUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updated = await UserModel.findByIdAndUpdate(id, req.body, { new: true });

    if (!updated) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    res.json(updated);
  } catch (error) {
    console.error("Error actualizando usuario:", error);
    res.status(500).json({ message: "Error al actualizar usuario" });
  }
};

// ❌ Eliminar usuario (de MongoDB y Firebase)
export const deleteUser = async (req: Request, res: Response) => {
  try {   
    const { id } = req.params;

    const user = await UserModel.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // Eliminar también en Firebase Auth
    await firebaseAdmin.auth().deleteUser(user.uid);

    res.json({ message: "Usuario eliminado correctamente" });
  } catch (error) {
    console.error("Error eliminando usuario:", error);
    res.status(500).json({ message: "Error al eliminar usuario" });
  }
};

// 🟡 Aprobar o rechazar usuario (solo admin)
export const approveOrRejectUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { estado } = req.body; // "aprobado" o "rechazado"

    if (!["aprobado", "rechazado"].includes(estado)) {
      return res.status(400).json({ message: "Estado inválido" });
    }

    const updated = await UserModel.findByIdAndUpdate(id, { estado }, { new: true });
    if (!updated) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // 🔔 Notificar al usuario
    const nombreCompleto = `${updated.primer_nombre} ${updated.primer_apellido}`.trim();
    await NotificationModel.create({
      usuario_uid: updated.uid,
      mensaje:
        estado === "aprobado"
          ? `Hola ${nombreCompleto}, tu solicitud de vendedor ha sido aprobada ✅`
          : `Hola ${nombreCompleto}, tu solicitud de vendedor fue rechazada ❌. Contacta al administrador.`,
      tipo: "sistema",
    });

    res.json({ message: `Usuario ${estado} correctamente`, user: updated });
  } catch (error) {
    console.error("Error aprobando usuario:", error);
    res.status(500).json({ message: "Error al actualizar estado del usuario" });
  }
};
