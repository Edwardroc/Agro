import { Request, Response, NextFunction } from "express";

export const checkRole = (allowedRoles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "No autenticado" });
      }

      const userRole = req.user.role;

      if (!userRole) {
        return res.status(403).json({ message: "El usuario no tiene un rol asignado" });
      }

      if (!allowedRoles.includes(userRole)) {
        return res.status(403).json({ message: "Acceso denegado: rol no autorizado" });
      }

      next();
    } catch (error) {
      console.error("Error en checkRole:", error);
      res.status(401).json({ message: "Error de autorización" });
    }
  };
};