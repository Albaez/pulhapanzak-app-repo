import { inject, Injectable } from '@angular/core';
import {
  deleteObject,
  getDownloadURL,
  ref,
  Storage,
  uploadBytes,
} from '@angular/fire/storage';

const folder: string = 'users';




@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  private _storage: Storage = inject(Storage);

  async uploadImage(image: string, userId: string): Promise<string> {
    try {
      const url = `${folder}/${userId}.png`;
      const storageReference = ref(this._storage, url);

      const imageExist = await getDownloadURL(storageReference).catch(
        () => null
      );
      if (imageExist) {
        await deleteObject(ref(this._storage, imageExist)).catch(() => null);
      }

      const file = await fetch(image);
      const imageBlob = await file.blob();
      const result = await uploadBytes(storageReference, imageBlob);
      const imageUrl = await getDownloadURL(result.ref);
      return imageUrl;
    } catch (error) {
      throw new Error('Error al subir la imagen');
    }
  }
}