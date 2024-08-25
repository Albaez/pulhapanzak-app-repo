import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import {
  IonBackButton,
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
import { Userregister } from '../models/Userregister';
import { AuthService } from '../service/auth.service';

@Component({
  selector: 'app-register-page',
  templateUrl: './register-page.page.html',
  styleUrls: ['./register-page.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonItem,
    IonButton,
    IonLabel,
    IonNote,
    IonSpinner,
    IonIcon,
    IonInput,
    IonBackButton,
    CommonModule,
    ReactiveFormsModule,
  ],
  styles: [
    `
    .ionInputStyle {
      color: black;
      border: 1px solid gray;
      border-radius: 20px;
      width: 100%;
      --padding-start: 1px;
      --padding-end: 1px;
      margin-top: 10px;
    }

    .ionInputStyle-invalid {
      color: black;
      border: 1px solid red;
      border-radius: 10px;
      width: 100%;
      --padding-start: 1px;
      --padding-end: 1px;
      margin-top: 10px;
    }
    .min-length-invalid {
      color: red;
    }
    .max-length-invalid {
      color: red;
    }
    .has-letters-or-spaces {
      color: red;
    }
    `
  ],
})

export class RegisterPagePage {
  private _authService: AuthService = inject(AuthService);
  private formBuilder: FormBuilder = inject(FormBuilder);
  private _router: Router = inject(Router);
  private _toastController: ToastController = inject(ToastController);
  disabled: boolean = false;

  registerForm: FormGroup = this.formBuilder.group({
    name: ['', [Validators.required]],
    apellido: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    dni: [
      '',
      [
        Validators.required,
        Validators.minLength(13),
        Validators.maxLength(13),
        Validators.pattern(/^[0-9]+$/),
      ],
    ],
    phone: ['', [Validators.required, Validators.minLength(8)]],
  });

  spinner: boolean = false;


  get isNameRequired(): boolean {
    const control: AbstractControl | null = this.registerForm.get('name');
    console.log(control?.touched, control?.errors);
    return control ? control.hasError('required') && control.touched : false;
  }

  get isApellidoRequired(): boolean {
    const control: AbstractControl | null = this.registerForm.get('apellido');
    return control ? control.hasError('required') && control.touched : false;
  }

  get isEmailInvalid(): boolean {
    const control: AbstractControl | null = this.registerForm.get('email');
    return control ? control.hasError('email') && control.touched : false;
  }

  get isEmailRequired(): boolean {
    const control: AbstractControl | null = this.registerForm.get('email');
    return control ? control.hasError('required') && control.touched : false;
  }

  get isPasswordInvalid(): boolean {
    const control: AbstractControl | null = this.registerForm.get('password');
    return control ? control.invalid && control.touched : false;
  }

  get dniValidationErrors(): {
    minLengthInvalid: boolean;
    maxLengthInvalid: boolean;
    hasLettersOrSpaces: boolean;
  } {
    const control = this.registerForm.get('dni');
    const errors = {
      minLengthInvalid: false,
      maxLengthInvalid: false,
      hasLettersOrSpaces: false,
    };

    if (control && control.touched) {
      const value = control.value || ''; 
      errors.minLengthInvalid =
        control.hasError('minlength') || value.length < 13;
      errors.maxLengthInvalid =
        control.hasError('maxlength') || value.length > 13;
      errors.hasLettersOrSpaces = /[a-zA-Z\s]/.test(value); // Verifica si hay letras o espacios en el valor
    }

    return errors;
  }

  get isPhoneInvalid(): boolean {
    const control: AbstractControl | null = this.registerForm.get('phone');
    if (control && control.touched) {
      const value = control.value || ''; 
      return control.hasError('required') || control.hasError('minlength') || value.length < 8;
    }
    return false;
  }
  
  get isFormInvalid(): boolean {
    return this.registerForm.invalid;
  }


  onSubmit(): void {
    if (!this.isFormInvalid) {
      this.disabled = true;
      this.spinner = true;
      let newUser: Userregister = this.registerForm.value as Userregister;

      this._authService
        .signUp(newUser)
        .then(async (result) => {
          newUser.uid = result.user.uid;

          await this._authService
            .createUserInFirestore(newUser)
            .then(async () => {
              this.spinner = false;
              this.disabled = false;
              await this.showAlert('User created successfully');
              this._router.navigate(['/home']);
              this.resetForm();
            });
        })
        .catch(async (error) => {
          console.error(error);
          this.spinner = false;
          this.disabled = false;
          await this.showAlert(
            'Ha ocurrido un error, vuelva a intentarlo',
            true
          );
        });
    }
  }

  resetForm(): void {
    this.registerForm.reset();
  }

  async showAlert(message: string, isError: boolean = false): Promise<void> {
    const toast = await this._toastController.create({
      message: message,
      duration: 2000,
      color: isError ? 'danger' : 'success',
    });
    toast.present();
  }
}
