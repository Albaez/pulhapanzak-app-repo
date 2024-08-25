import { inject, Injectable } from '@angular/core';
import { Login } from '../models/Login';
import { Userregister } from '../models/Userregister';

import {
  Auth,
  createUserWithEmailAndPassword,
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
        console.log("user ->", user);
        if (user) {
          resolve(true);
        } else {
          resolve(false);
        }
      });
    });
  }

  async createUserInFirestore(user: Userregister): Promise<void> {
    const docRef: DocumentReference = doc(this._collection, user.uid);
    await setDoc(docRef, {
      name: user.name,
      apellido: user.apellido,
      email: user.email,
      password: user.password,
      dni: user.dni,
      phone: user.phone,
      uid: user.uid,
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

  async signUp(model: Login ): Promise<UserCredential> {
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
}