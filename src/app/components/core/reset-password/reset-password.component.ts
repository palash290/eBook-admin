import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, Validators, ValidatorFn, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { SharedService } from '../../services/shared.service';
import { LoaderComponent } from "../../shared/loader/loader.component";

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, LoaderComponent],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.css'
})
export class ResetPasswordComponent {
  isShowNew: boolean = false;
  isShowConfirm: boolean = false;
  loading: boolean = false;
  Form!: FormGroup;
  email!: string

  constructor(private router: Router, private srevice: SharedService, private toster: NzMessageService) { }

  ngOnInit() {
    const email = sessionStorage.getItem('email');
    if (email) {
      this.email = email
    }
    this.initForm()
  }

  initForm() {
    this.Form = new FormGroup({
      newPassword: new FormControl('', [Validators.required, strongPasswordValidator]),
      confPassword: new FormControl('', [Validators.required]),
    }, {
      validators: passwordMatchValidator()
    })
  }

  onSubmit() {
    this.Form.markAllAsTouched();
    if (this.Form.valid) {
      this.loading = true;
      const formURlData = new URLSearchParams();
      formURlData.set('email', this.email);
      formURlData.set('password', this.Form.value.confPassword);
      this.srevice.postAPI1('resetPassword', formURlData.toString()).subscribe({
        next: (res: any) => {
          if (res.success == true) {
            // this.toster.success(res.message);
            this.router.navigateByUrl('/reset-success');
            this.loading = false;
          } else {
            this.loading = false;
            this.toster.warning(res.message)
          }
        },
        error: (error) => {
          this.loading = false;
          this.toster.error(error);
        }
      });
    }
  }
}

export function strongPasswordValidator(
  control: AbstractControl
): ValidationErrors | null {
  const value = control.value || ''

  const hasUpperCase = /[A-Z]/.test(value)
  const hasLowerCase = /[a-z]/.test(value)
  const hasNumeric = /[0-9]/.test(value)
  const hasSpecialCharacter = /[!@#$%^&*(),.?":{}|<>]/.test(value)
  const isValidLength = value.length >= 8

  const passwordValid =
    hasUpperCase &&
    hasLowerCase &&
    hasNumeric &&
    hasSpecialCharacter &&
    isValidLength

  // Return errors object or null
  if (!passwordValid) {
    return {
      strongPassword: {
        hasUpperCase: hasUpperCase,
        hasLowerCase: hasLowerCase,
        hasNumeric: hasNumeric,
        hasSpecialCharacter: hasSpecialCharacter,
        isValidLength: isValidLength
      }
    }
  }
  return null
}

export function passwordMatchValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: boolean } | null => {
    const password = control.get('newPassword');
    const confirmPassword = control.get('confPassword');

    if (!password || !confirmPassword) {
      return null;
    }

    return password.value !== confirmPassword.value ? { 'passwordMismatch': true } : null;
  };
}
