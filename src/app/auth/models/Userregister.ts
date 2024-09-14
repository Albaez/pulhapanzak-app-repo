import { Timestamp } from "firebase/firestore";

export interface Userregister {
    name: string;
    lastname: string;
    birthday:Timestamp;
    email: string;
    password: string;
    dni: string;
    phone: string;
    imageProfile: string;
    uid: string;
  }