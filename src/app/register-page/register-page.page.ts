import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
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
} from '@ionic/angular/standalone';
import { User } from '../models/User';

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
        --padding-start: 10px;
        --padding-end: 10px;
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
    `,
  ],
})

export class RegisterPagePage {
  private formBuilder: FormBuilder = inject(FormBuilder);

  User: User = {} as User;

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

  get isFormInvalid(): boolean {
    return this.registerForm.invalid;
  }

  get isNameNull(): boolean {
    const control: AbstractControl | null = this.registerForm.get('name');
    return control ? control.hasError('required') && control.touched : false;
  }

  get isApellidoNull(): boolean {
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
    if (control && control.touched) {
      return control.hasError('minlength') || control.value.length < 6;
    }
    return false;
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
      const value = control.value || ''; // Asegúrate de que el valor sea una cadena
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
  

  save(): void {
    this.User = this.registerForm.value as User;
    console.log('login ->', this.User);
    this.spinner = true;
    setTimeout(() => {
      this.registerForm.reset();
      this.spinner = false;
    }, 10000);
  }
}
