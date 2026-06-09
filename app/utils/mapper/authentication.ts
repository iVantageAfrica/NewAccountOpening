export const LoginMapper = (payload: any) => ({
  email: payload.email,
  password: payload.password,
});



export const VerificationCodeMapper = (payload: any) => ({ 
  email: payload.email,
});

export const PasswordResetMapper = (payload: any) => ({ 
  password: payload.password,
  password_confirmation: payload.confirmPassword,
});