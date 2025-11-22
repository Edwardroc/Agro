import { Request, Response, NextFunction } from "express";
import { firebaseAdmin } from "../config/firebase";

/**
 * Middleware para restringir rutas según el rol del usuario.
 * Ejemplo: checkRole(["admin", "vendedor"])
 */
export const checkRole = (allowedRoles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader?.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Token no proporcionado" });
      }

      const token = authHeader.split(" ")[1];
      const decodedToken = await firebaseAdmin.auth().verifyIdToken(token);

      const userRole = decodedToken.role;

      if (!userRole) {
        return res.status(403).json({ message: "El usuario no tiene un rol asignado" });
      }

      if (!allowedRoles.includes(userRole)) {
        return res.status(403).json({ message: "Acceso denegado: rol no autorizado" });
      }

      // Guardamos los datos del usuario en la request
      req.user = {
        uid: decodedToken.uid,
        role: userRole,
      };

      next();
    } catch (error) {
      console.error("Error en checkRole:", error);
      res.status(401).json({ message: "Token inválido o expirado" });
    }
  };
};

