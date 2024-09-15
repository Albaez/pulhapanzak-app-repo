import { inject, Injectable } from '@angular/core';
import {
  Auth,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  User,
  UserCredential
} from '@angular/fire/auth';
import {
  addDoc,
  collection,
  CollectionReference,
  deleteDoc,
  doc,
  DocumentReference,
  Firestore,
  getDoc,
  getDocs,
  orderBy,
  query,
  setDoc,
  updateDoc,
  where,
} from '@angular/fire/firestore';
import { DeviceDto } from '../models/DeviceDto';
import { Login } from '../models/Login';
import { PasswordReset } from '../models/PasswordReset';
import { Userregister } from '../models/Userregister';

const PATH: string = 'users';
const devicePath: string = 'devices';

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

  async getCurrentUserId(): Promise<string | null> {
    const user = await this.getCurrentUser();
    return user?.uid ?? null;
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
      lastname: user.lastname,
      dni: user.dni,
      birthday: user.birthday,
      phone: user.phone,
      email: user.email,
      password: user.password,
      isActive: true,
      uid: docRef.id,
      imageProfile: '',
    });
  }

  // Método para crear un usuario en Firestore con un UID generado por Firestore
  async createUser(user: Userregister): Promise<void> {
    const docRef: DocumentReference = doc(this._collection);
    await setDoc(docRef, {
      name: user.name,
      lastname: user.lastname,
      dni: user.dni,
      birthday: user.birthday,
      phone: user.phone,
      email: user.email,
      password: user.password,
      imageProfile: user.imageProfile,
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

    // Método para obtener un usuario por medio de un query
    async getUserByQuery(): Promise<Userregister | null> {
      const user = await this.getCurrentUser();
      const userQuery = query(
        this._collection,
        where('uid', '==', user?.uid),
        where('isActive', '==', true),
        //orderBy('name', 'asc') // Para ordenar de forma ascendente
        orderBy('name', 'desc') // Para ordenar de forma descendente
      );
      const userSnapshot = await getDocs(userQuery);
      if (userSnapshot.empty) {
        return null;
      }
      return userSnapshot.docs[0].data() as Userregister;
    }
  
    // Método para actualizar un usuario en Firestore.
    async updateUser(user: Userregister): Promise<void> {
      if (!user.uid) throw new Error('User UID is required');
  
      const docRef = doc(this._collection, user.uid);
      await updateDoc(docRef, {
        ...{
          name: user.name,
          dni: user.dni,
          birthday: user.birthday,
          phone: user.phone,
          email: user.email,
          imageProfile: user.imageProfile,
        },
      });
    }
  
    async deleteUser(id: string): Promise<void> {
      if (!id) throw new Error('User UID is required');
  
      const docRef = doc(this._collection, id);
      await deleteDoc(docRef);
    }

    async createDevice(device: DeviceDto): Promise<void> {
      const deviceCollection: CollectionReference = collection(
        this._firestore,
        devicePath
      );
      await addDoc(deviceCollection, device);
    }
  }