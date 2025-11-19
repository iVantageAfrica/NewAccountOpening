import CryptoJS from 'crypto-js';
import { useAppStore } from '../store/appStore';


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
    useAppStore.getState().clear();
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
    useAppStore.getState().set("bvnData", dataClean)
} 

