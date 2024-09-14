import { Injectable, inject } from '@angular/core';
import {
  CollectionReference,
  Firestore,
  collection,
  collectionData,
  orderBy,
  query,
  where,
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/auth/service/auth.service';
import { GalleryData } from '../../auth/models/GalleryData';
const PATH: string = 'galleries'

  @Injectable({
    providedIn: 'root',
  })
  export class GalleryService {
    private _firestore: Firestore = inject(Firestore);
    private _authService: AuthService = inject(AuthService);
    private _collection: CollectionReference = collection(this._firestore, PATH);
  
    getActiveGalleries(): Observable<GalleryData[]> {
      const galleriesRef = this._collection;
      const q = query(galleriesRef, 
      where('active', '==', true), 
      orderBy('createdAt','desc'));
  
      return collectionData(q, { idField: 'uid' }) as Observable<GalleryData[]>
    }
  
  
  
  
  }

