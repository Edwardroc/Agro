export const validators = {
  email: (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  password: (password: string): { valid: boolean; message?: string } => {
    if (password.length < 6) {
      return { valid: false, message: "La contraseña debe tener al menos 6 caracteres" };
    }
    return { valid: true };
  },

  phone: (phone: string): boolean => {
    const phoneRegex = /^[0-9]{10}$/;
    return phoneRegex.test(phone.replace(/\s/g, ""));
  },

  required: (value: any): boolean => {
    if (typeof value === "string") {
      return value.trim().length > 0;
    }
    return value !== null && value !== undefined;
  },

  minLength: (value: string, min: number): boolean => {
    return value.length >= min;
  },

  maxLength: (value: string, max: number): boolean => {
    return value.length <= max;
  },

  numeric: (value: string): boolean => {
    return !isNaN(Number(value));
  },

  positiveNumber: (value: number): boolean => {
    return value > 0;
  },

  url: (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  },
};

export const validateForm = (
  data: Record<string, any>,
  rules: Record<string, (value: any) => boolean | { valid: boolean; message?: string }>
): { valid: boolean; errors: Record<string, string> } => {
  const errors: Record<string, string> = {};

  for (const [field, rule] of Object.entries(rules)) {
    const result = rule(data[field]);
    
    if (typeof result === "boolean") {
      if (!result) {
        errors[field] = `El campo ${field} no es válido`;
      }
    } else {
      if (!result.valid) {
        errors[field] = result.message || `El campo ${field} no es válido`;
      }
    }
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
};