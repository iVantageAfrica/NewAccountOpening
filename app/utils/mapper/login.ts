export const LoginMapper = (payload: any) => ({
  email: payload.email,
  password: payload.password,
});