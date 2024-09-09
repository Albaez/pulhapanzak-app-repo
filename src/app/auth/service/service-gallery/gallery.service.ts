import { Injectable, inject } from '@angular/core';
import {
  Auth,
  User
} from '@angular/fire/auth';
import {
  CollectionReference,
  Firestore,
  collection,
  getDocs,
  orderBy,
  query,
  where,
} from '@angular/fire/firestore';
import { GalleryData } from '../../models/GalleryData';

const folder: string = 'Galleries';
const PATH: string = 'Users';

  @Injectable({
    providedIn: 'root',
  })
  export class GalleryService {
    private _auth: Auth = inject(Auth);
    private _firestore: Firestore = inject(Firestore);
    private _collectionGalleries: CollectionReference = collection(this._firestore,folder);
    private _collectionUsers: CollectionReference = collection(this._firestore, PATH);

    constructor() { }

    //metodo GET
    private async getCurrentUser(): Promise<User | null> {
      return new Promise<User | null>((resolve) => {
        this._auth.onAuthStateChanged((user: User | null) => {
          if (user) {
            resolve(user);
          } else {
            resolve(null);
          }
        });
      });
    }

    async getGalleryByQuery(): Promise<GalleryData[] | null> {
      const user = await this.getCurrentUser();
      const galleryQuery = query(
        this._collectionGalleries,
        where('uid', '==', user?.uid),
        where('active', '==', true),
        orderBy('createdAt', 'desc') 
      );
      const gallerySnapshot = await getDocs(galleryQuery);      if (gallerySnapshot.empty) {
        return null; 
      }
      return gallerySnapshot.docs.map((doc) => doc.data() as GalleryData);
      
    }
  };

