import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
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
import { Login } from '../models/Login';
import { AuthService } from '../service/auth.service';


@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.page.html',
  styleUrls: ['./login-page.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    IonButton,
    IonInput,
    IonItem,
    IonNote,
    IonSpinner,
    IonLabel,
    ReactiveFormsModule,
    IonIcon,
  ],
})
export class LoginPagePage {
  private _authService: AuthService = inject(AuthService);
  private formBuilder: FormBuilder = inject(FormBuilder);
  private _router: Router = inject(Router);
  private _toastController: ToastController = inject(ToastController);
  disabled: boolean = false;
  registerForm: FormGroup = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });
  spinner: boolean = false;

  get isEmailInvalid(): boolean {
    const control: AbstractControl | null = this.registerForm.get('email');
    return control ? control.hasError('email') && control.touched : false;
  }

  get isEmailRequired(): boolean {
    const control: AbstractControl | null = this.registerForm.get('email');
    return control ? control.hasError('required') && control.touched : false;
  }

  get isPasswordRequired(): boolean {
    const control: AbstractControl | null = this.registerForm.get('password');
    return control ? control.invalid && control.touched : false;
  }

  get isFormInvalid(): boolean {
    return this.registerForm.invalid;
  }

  onSubmit(): void {
    if (!this.isFormInvalid) {
      this.disabled = true;
      this.spinner = true;
      const login: Login = this.registerForm.value as Login;

      this._authService
        .login(login)
        .then(async () => {
          this.spinner = false;
          this.disabled = false;
          await this.showAlert('Login successful');
          this._router.navigate(['/home']);
          this.resetForm();
        })
        .catch(async (error) => {
          console.error(error);
          this.spinner = false;
          this.disabled = false;
          await this.showAlert('Invalid email or password', true);
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