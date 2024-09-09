import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';

import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import {
  IonButton,
  IonContent,
  IonHeader,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonNote,
  IonSpinner,
  IonTitle,
  IonToolbar,
  ToastController,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { atCircleOutline } from 'ionicons/icons';
import { PasswordReset } from '../../models/PasswordReset';
import { AuthService } from '../../service/auth.service';

@Component({
  selector: 'app-password.reset',
  templateUrl: './password.reset.page.html',
  styleUrls: ['./password.reset.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    FormsModule,
    IonIcon,
    IonItem,
    IonInput,
    IonLabel,
    IonButton,
    IonSpinner,
    ReactiveFormsModule, 
    IonNote,
    IonIcon,
  ],
  styles: [
    `
      //ngClass para input cuando sea valido
      .ionInputStyle {
        color: black;
        border: 2px solid black;
        border-radius: 10px;
        width: 100%;
        --padding-start: 10px;
        --padding-end: 10px;
        margin-top: 10px;
      }

      //ngClass para input cuando sea invalido o nulo
      .ionInputStyle-invalid {
        color: black;
        border: 2px solid red;
        border-radius: 10px;
        width: 100%;
        --padding-start: 10px;
        --padding-end: 10px;
        margin-top: 10px;
      }
    `,
  ],
})
export class PasswordResetPage {
  
  private _authService: AuthService = inject(AuthService);
  private _router: Router = inject(Router);
  private formBuilder: FormBuilder = inject(FormBuilder);
  private _toastController: ToastController = inject(ToastController);

  spinner: boolean = false;

  disabled: boolean = false;

  PasswordResetForm: FormGroup = this.formBuilder.group({
    correo: ['', [Validators.required, Validators.email]],
  });


 get isFormInvalid(): boolean {
   return this.PasswordResetForm.invalid;
 }


 get isEmailRequired(): boolean {
   const control: AbstractControl | null = this.PasswordResetForm.get('correo');
   return control ? control.hasError('required') && control.touched : false;
 }


 get isEmailInvalid(): boolean {
   const control: AbstractControl | null = this.PasswordResetForm.get('correo');
   return control ? control.hasError('email') && control.touched : false;
 }

 onSubmit(): void {
   if (!this.isFormInvalid) {

     this.disabled = true;

     this.spinner = true;

     const reset: PasswordReset = this.PasswordResetForm.value as PasswordReset;

   
     this._authService
      
       .resetPassword(reset)
       .then(async (r) => {
         this.spinner = false;
         this.disabled = false;
         console.log(r);
        
         await this.showAlert('Por favor revise la bandeja de entrada de su correo.');
         this._router.navigate(['/login']);
         this.resetForm();
       })
       .catch(async () => {
         this.spinner = false;
         this.disabled = false;
      
         await this.showAlert(
           'No se encontro el correo, por favor revise e intente de nuevo.',
           true
         );
       });
   }
 }

 goToLogin(){
   this.resetForm();
   this._router.navigate(['/login']);
 }

 resetForm(): void {
   this.PasswordResetForm.reset();
 }

 async showAlert(message: string, isError: boolean = false): Promise<void> {
   const toast = await this._toastController.create({
     message: message,
     duration: 7000,
     color: isError ? 'danger' : 'success',
   });
   toast.present();
 }


  constructor() {
    addIcons({
      'at-circle-outline': atCircleOutline,
    });
  }

 
}

