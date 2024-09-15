import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular/standalone';
import { catchError, Observable, of, tap } from 'rxjs';
import { CharacterDto } from 'src/app/auth/models/CharacterDto';
import { environment } from 'src/environments/environment';

const apiUrl: string = environment.API_URL;

@Injectable({
  providedIn: 'root',
})
export class HomeServiceService {
  private _http: HttpClient = inject(HttpClient);
  private _toastController: ToastController = inject(ToastController);

  getCharacters(): Observable<CharacterDto[]> {
    return this._http.get<CharacterDto[]>(`${apiUrl}character`).pipe(
      tap((response) => console.log(response)),
      catchError(this.handleError<CharacterDto[]>('Error al obtener datos', []))
    );
  }

  getCharacter(id:number){
    return this._http.get<CharacterDto>(`${apiUrl}character/${id}`).pipe(
      catchError(
        this.handleError<CharacterDto>('Error al obtener el post', {} as CharacterDto)
      )
    )
  }


  private handleError<T>(message: string, result?: T) {
    return (): Observable<T> => {
      this.showAlert(`${message}, vuelva a intentarlo`, true);
      return of(result as T);
    };
  }

  async showAlert(
    message: string,
    isError: boolean = false
  ): Promise<void> {
    const toast = await this._toastController.create({
      message: message,
      duration: 1000,
      position: 'bottom',
      color: isError ? 'danger' : 'success',
    });
    toast.present();
  }
}
