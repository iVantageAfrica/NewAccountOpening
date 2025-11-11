export const maskPhone = (phone: string) =>
  phone ? `***${phone.slice(-3)}` : "";

export const maskEmail = (email: string) => {
  if (!email.includes("@")) return "";
  const [name, domain] = email.split("@");
  return `***${name.slice(-3)}@${domain}`;
};

// lib/utils.ts
export function cn(...classes: (string | boolean | undefined | null)[]) {
  return classes.filter(Boolean).join(" ");
}