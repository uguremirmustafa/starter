// ApiResponse is kept as a plain generic interface — Zod generics are awkward for wrappers.
// All other shared types are derived via z.infer from their respective schemas.
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
