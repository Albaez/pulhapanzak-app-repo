import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import { Router } from '@angular/router';
import { Camera, CameraResultType } from '@capacitor/camera';
import {
  IonButton,
  IonContent,
  IonHeader,
  IonIcon,
  IonImg,
  IonInput,
  IonItem,
  IonLabel,
  IonNote,
  IonSpinner,
  IonTitle,
  IonToolbar,
  ToastController
} from '@ionic/angular/standalone';
import { Userregister } from '../auth/models/Userregister';
import { AuthService } from '../auth/service/auth.service';
import { ProfileService } from './service-profile/profile.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonButton,
    IonContent,
    IonHeader,
    IonInput,
    IonImg,
    IonItem,
    IonLabel,
    IonNote,
    IonSpinner,
    IonIcon,
    IonTitle,
    IonToolbar,
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
export class ProfilePage implements OnInit {
  private _authService: AuthService = inject(AuthService);
  private _profileService: ProfileService = inject(ProfileService);
  private formBuilder: FormBuilder = inject(FormBuilder);
  private _toastController: ToastController = inject(ToastController);
  private _router: Router = inject(Router);

  disabled: boolean = false;
  spinner: boolean = false;
  user: Userregister = {} as Userregister;

  profileForm: FormGroup = this.formBuilder.group({
    imageProfile: ['', [Validators.required]],
    name: ['', [Validators.required]],
    lastname: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    dni: [
      '',
      [
        Validators.required,
        Validators.minLength(13),
        Validators.maxLength(13),
        Validators.pattern(/^[0-9]+$/),
      ],
    ],
    birthday: ['', [Validators.required]],
    phone: ['', [Validators.required, Validators.minLength(8)]],
   
    uid: ['', [Validators.required]],
  });
  
  get isFormInvalid(): boolean {
    return this.profileForm.invalid;
  }

  get isImageProfileInvalid(): boolean {
    const control: AbstractControl | null =
      this.profileForm.get('imageProfile');
    return control ? control.invalid : false;
  }

  get isNameRequired(): boolean {
    const control: AbstractControl | null = this.profileForm.get('name');
    return control ? control.hasError('required') && control.touched : false;
  }

  get isLastnameRequired(): boolean {
    const control: AbstractControl | null = this.profileForm.get('lastname');
    return control ? control.hasError('required') && control.touched : false;
  }

  get isEmailInvalid(): boolean {
    const control: AbstractControl | null = this.profileForm.get('email');
    return control ? control.hasError('email') && control.touched : false;
  }

  get isEmailRequired(): boolean {
    const control: AbstractControl | null = this.profileForm.get('email');
    return control ? control.hasError('required') && control.touched : false;
  }

  get dniValidationErrors(): {
    minLengthInvalid: boolean;
    maxLengthInvalid: boolean;
    hasLettersOrSpaces: boolean;
  } {
    const control = this.profileForm.get('dni');
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


  get isBirthdayInvalid(): boolean {
    const control: AbstractControl | null = this.profileForm.get('birthday');
    return control ? control.invalid && control.touched : false;
  }

  get isBirthdayUse(): boolean {
    const control: AbstractControl | null = this.profileForm.get('birthday');

    if (control && control.value) {
      const selectedDate = new Date(control.value).getTime();
      const today = new Date().setHours(23, 59, 59, 999); // Para comparar fecha con ultimo segundo del dia
      return selectedDate > today; // Retorna true si la fecha es mayor a la actual
    }

    return false;
  }
  
  get isPhoneInvalid(): boolean {
    const control: AbstractControl | null = this.profileForm.get('phone');
    if (control && control.touched) {
      const value = control.value || ''; 
      return control.hasError('required') || control.hasError('minlength') || value.length < 8;
    }
    return false;
  }


  clearSpinner(): void {
    this.disabled = true;
    this.spinner = true;
  }

  setSpinner(): void {
    this.disabled = true;
    this.spinner = true;
  }

  ngOnInit() {
    this._authService
      .getUserById()
      .then((user) => {
        this.user = user!;
        this.profileForm.patchValue({
          name: this.user.name,
          lastname: this.user.lastname,
          email: this.user.email,
          password: this.user.password,
          dni: this.user.dni,
          birthday: this.user.birthday,
          phone: this.user.phone,
          imageProfile: this.user.imageProfile,
          uid: this.user.uid,
        });
      })
      .catch(async () => {
        await this.showAlert('Ha ocurrido un error', true);
      });
  }

  async showAlert(message: string, isError: boolean = false): Promise<void> {
    const toast = await this._toastController.create({
      message: message,
      duration: 1000,
      color: isError ? 'danger' : 'success',
    });
    toast.present();
  }

  onSubmit(): void {
    if (!this.isFormInvalid) {
      this.setSpinner();
      let user: Userregister = this.profileForm.value as Userregister;
      user.email = this.user.email;

      this._profileService
        .uploadImage(user.imageProfile, user.uid)
        .then(async (url: string) => {
          user.imageProfile = url;
          this._authService
            .updateUser(user)
            .then(async () => {
              this.clearSpinner();
              await this.showAlert('Perfil actualizado correctamente');
            })
            .catch(async () => {
              this.clearSpinner();
              await this.showAlert('Ha ocurrido un error', true);
            });
        })
        .catch(async () => {
          this.clearSpinner();
          await this.showAlert('Ha ocurrido un error', true);
        });
    }
  }

  async logOut(): Promise<void> {
    await this._authService
      .signOut()
      .then(async () => {
        this._router.navigate(['/login']);
        await this.showAlert(
          'Cierre de sesión exitosa'
        );
      })
      .catch(async () => {
        await this.showAlert('Ha ocurrido un error', true);
      });
  }


  async onPickImage(): Promise<void> {
    const image = await Camera.getPhoto({
      quality: 100,
      allowEditing: false,
      resultType: CameraResultType.Uri,
      saveToGallery: true,
      promptLabelHeader: 'Selecciona una foto',
      promptLabelPhoto: 'Seleccione de Galería',
      promptLabelPicture: 'Capturar Foto',
      promptLabelCancel: 'Cancelar',
    });

    if (!image) return;

    this.user.imageProfile = image.webPath ?? image.path ?? '';
    this.profileForm.patchValue({ imageProfile: this.user.imageProfile });
  }

  


  
}
