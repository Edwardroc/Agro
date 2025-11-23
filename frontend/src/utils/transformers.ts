// Utiles para transformar snake_case <-> camelCase (recursivo, arrays, objetos)
export const isPlainObject = (v: any) =>
  v !== null && typeof v === 'object' && !Array.isArray(v);

const toCamel = (s: string) =>
  s.replace(/_([a-z])/g, (_, c) => (c ? c.toUpperCase() : ''));

export const snakeToCamel = (obj: any): any => {
  if (Array.isArray(obj)) return obj.map(snakeToCamel);
  if (!isPlainObject(obj)) return obj;
  const res: any = {};
  Object.keys(obj).forEach((k) => {
    const nk = toCamel(k);
    const v = (obj as any)[k];
    res[nk] = isPlainObject(v) || Array.isArray(v) ? snakeToCamel(v) : v;
  });
  return res;
};

export const camelToSnake = (obj: any): any => {
  if (Array.isArray(obj)) return obj.map(camelToSnake);
  if (!isPlainObject(obj)) return obj;
  const res: any = {};
  Object.keys(obj).forEach((k) => {
    const nk = k.replace(/([A-Z])/g, '_$1').toLowerCase();
    const v = (obj as any)[k];
    res[nk] = isPlainObject(v) || Array.isArray(v) ? camelToSnake(v) : v;
  });
  return res;
};

export default snakeToCamel;