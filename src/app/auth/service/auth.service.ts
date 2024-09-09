import { inject, Injectable } from '@angular/core';
import { Login } from '../models/Login';
import { Userregister } from '../models/Userregister';

import {
  Auth,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  User,
  UserCredential,
} from '@angular/fire/auth';
import {
  collection,
  CollectionReference,
  doc,
  DocumentReference,
  Firestore,
  setDoc,
} from '@angular/fire/firestore';

import { getDoc, getDocs, query, where } from 'firebase/firestore';
import { PasswordReset } from '../models/PasswordReset';

const PATH: string = 'users';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private _auth: Auth = inject(Auth);
  private _firestore: Firestore = inject(Firestore);
  private _collection: CollectionReference = collection(this._firestore, PATH);

  async isUserLoggued(): Promise<boolean> {
    return new Promise<boolean>((resolve) => {
      this._auth.onAuthStateChanged((user: User | null) => {
        console.log('user ->', user);
        if (user) {
          resolve(true);
        } else {
          resolve(false);
        }
      });
    });
  }

  async getCurrentUser(): Promise<User | null> {
    return new Promise<User | null>((resolve) => {
      this._auth.onAuthStateChanged((user: User | null) => {
        console.log('user ->', user);
        if (user) {
          resolve(user);
        } else {
          resolve(null);
        }
      });
    });
  }

  async login(model: Login): Promise<UserCredential> {
    const isUserLoggued: boolean = await this.isUserLoggued();
    if (isUserLoggued) return Promise.reject('User is loggued');

    return await signInWithEmailAndPassword(
      this._auth,
      model.email,
      model.password
    );
  }

  async signUp(model: Login): Promise<UserCredential> {
    const isUserLoggued: boolean = await this.isUserLoggued();
    if (isUserLoggued) return Promise.reject('User is loggued');

    return await createUserWithEmailAndPassword(
      this._auth,
      model.email,
      model.password
    );
  }

  async signOut(): Promise<void> {
    const isUserLoggued: boolean = await this.isUserLoggued();
    if (isUserLoggued) {
      return await this._auth.signOut();
    }

    return Promise.reject('User not found');
  }


  //metodo para reseteo de contraseña
  async resetPassword(model: PasswordReset): Promise<void> {
    return await sendPasswordResetEmail(this._auth, model.correo);
  }

  // Método para crear un usuario en Firestore con un UID específico
  async createUserInFirestore(user: Userregister): Promise<void> {
    const docRef: DocumentReference = doc(this._collection, user.uid);
    await setDoc(docRef, {
      name: user.name,
      phone: user.phone,
      email: user.email,
      uid: docRef.id,
    });
  }

  // Método para crear un usuario en Firestore con un UID generado por Firestore
  async createUser(user: Userregister): Promise<void> {
    const docRef: DocumentReference = doc(this._collection);
    await setDoc(docRef, {
      name: user.name,
      phone: user.phone,
      email: user.email,
      uid: docRef.id,
    });
  }

  async getUserById(): Promise<Userregister> {
    try {
      const user = await this.getCurrentUser();
      const docRef = doc(this._firestore, PATH, user?.uid ?? '');
      const userSnapshot = await getDoc(docRef);
      if (userSnapshot.exists()) {
        return userSnapshot.data() as Userregister;
      }
      return {} as Userregister;
    } catch (error) {
      return {} as Userregister;
    }
  }

  async getUserByQuery(): Promise<Userregister | null> {
    const user = await this.getCurrentUser();
    const userQuery = query(
      this._collection,
      where('uid', '==', user?.uid),
      where('email', '==', user?.email)
    );
    const userSnapshot = await getDocs(userQuery);
    if (!userSnapshot.empty) {
      return userSnapshot.docs[0].data() as Userregister;
    }
    return null;
  }
}