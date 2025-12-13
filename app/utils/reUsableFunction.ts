import CryptoJS from 'crypto-js';


export const maskPhone = (phone: string) =>
  phone ? `***${phone.slice(-3)}` : "";

export const maskEmail = (email: string) => {
  if (!email.includes("@")) return "";
  const [name, domain] = email.split("@");
  return `***${name.slice(-4)}@${domain}`;
};

export function cn(...classes: (string | boolean | undefined | null)[]) {
  return classes.filter(Boolean).join(" ");
}

export const formatTime = (seconds: number): string => {
  const min = Math.floor(seconds / 60).toString().padStart(2, "0");
  const sec = (seconds % 60).toString().padStart(2, "0");
  return `${min}:${sec}`;
};

const SECRET_KEY = process.env.NEXT_PUBLIC_SECRET_KEY!;
export const encrypt = (data: unknown): string => {
  const stringifiedData = JSON.stringify(data);
  return CryptoJS.AES.encrypt(stringifiedData, SECRET_KEY).toString();
};

export const decrypt = (cipher: string): string => {
   try {
    const bytes = CryptoJS.AES.decrypt(cipher, SECRET_KEY);
    const decryptedStr = bytes.toString(CryptoJS.enc.Utf8);
    return JSON.parse(decryptedStr);
  } catch (e) {
    console.error("Failed to decrypt:", e);
    return "";
  }
};

export const clearAppState = () =>{
    localStorage.clear();
    sessionStorage.clear();
}

export function bvnDataClean(bvnData: Record<string, any>) {
    const { phone_number, bvn, email, lastname, middle_name,firstname,gender, nin, date_of_birth,address } = bvnData;
    const dataClean = { 
      phoneNumber:phone_number, 
      bvn:bvn, 
      emailAddress:email, 
      lastName:lastname, 
      middleName:middle_name, 
      firstName:firstname, 
      gender, 
      nin:nin,
      dateOfBirth:date_of_birth,
      address:address };
      saveToLocalStorage("bvnData", dataClean)
} 


const hour = new Date().getHours();

export const timeOfDay =
  hour >= 5 && hour < 12
    ? "Good Morning"
    : hour >= 12 && hour < 17
    ? "Good Afternoon"
    : "Good Evening";


export const saveToLocalStorage = <T>(key: string, data: T): void => {
    if (typeof window === "undefined") return;
    localStorage.setItem(key, encrypt(data));
};

export const getFromLocalStorage = <T>(key: string): T | null => {
    if (typeof window === "undefined") return null;
    const value = localStorage.getItem(key);
    return value ? decrypt(value) as T : null;
};

export const removeFromLocalStorage = (key: string): void => {
  if (typeof window === "undefined") return;
  localStorage.removeItem(key);
};



const key = CryptoJS.enc.Base64.parse(
  process.env.NEXT_PUBLIC_DECRYPT_KEY?.replace(/^base64:/, "") || ""
);

export const cryptoHelper = {
  encrypt: (text) => {
    try {
      const iv = CryptoJS.lib.WordArray.random(16);
      const encrypted = CryptoJS.AES.encrypt(text, key, { iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 });
      return CryptoJS.enc.Base64.stringify(iv.concat(encrypted.ciphertext));
    } catch {
      return null;
    }
  },
  decrypt: (base64) => {
    try {
      const raw = CryptoJS.enc.Base64.parse(base64);
      const iv = CryptoJS.lib.WordArray.create(raw.words.slice(0, 4), 16);
      const cipher = CryptoJS.lib.WordArray.create(raw.words.slice(4));
      const decrypted = CryptoJS.AES.decrypt({ ciphertext: cipher }, key, { iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 });
      return decrypted.toString(CryptoJS.enc.Utf8);
    } catch {
      return null;
    }
  }
};