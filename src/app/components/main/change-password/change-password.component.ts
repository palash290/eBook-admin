import { Component } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { SharedService } from '../../services/shared.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { LoaderComponent } from "../../shared/loader/loader.component";

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, LoaderComponent],
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.css'
})
export class ChangePasswordComponent {

  form!: FormGroup;
  passwordMismatch = false;
  loading: boolean = false;

  constructor(private service: SharedService, private router: Router, private toster: NzMessageService) { }

  ngOnInit() {
    this.initForm()
  }

  initForm() {
    this.form = new FormGroup({
      current_password: new FormControl('', Validators.required),
      newPassword: new FormControl('', [Validators.required, strongPasswordValidator]),
      confPassword: new FormControl('', Validators.required),
    }, {
      validators: [
        passwordMatchValidator(),
        passwordMismatchValidator()
      ]
    });

  }

  onSubmit() {
    this.form.markAllAsTouched();
    if (this.form.valid) {
      this.loading = true;
      const formURlData = new URLSearchParams();
      formURlData.set('current_password', this.form.value.current_password);
      formURlData.set('new_password', this.form.value.confPassword);
      this.service.postAPI1('changePassword', formURlData.toString()).subscribe({
        next: (res: any) => {
          if (res.success == true) {
            this.toster.success(res.message);
            this.form.reset();
            // this.router.navigateByUrl('/');
            this.loading = false;
          } else {
            this.loading = false;
            this.toster.warning(res.message)
          }
        },
        error: (error) => {
          this.loading = false;
          this.toster.error(error.error.message);
        }
      });
    }
  }

  isPasswordVisible1: boolean = false;

  togglePasswordVisibility1() {
    this.isPasswordVisible1 = !this.isPasswordVisible1;
  }

  isPasswordVisible2: boolean = false;

  togglePasswordVisibility2() {
    this.isPasswordVisible2 = !this.isPasswordVisible2;
  }

  isPasswordVisible3: boolean = false;

  togglePasswordVisibility3() {
    this.isPasswordVisible3 = !this.isPasswordVisible3;
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

export function passwordMismatchValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const currentPassword = control.get('current_password')?.value;
    const newPassword = control.get('newPassword')?.value;
    if (!currentPassword || !newPassword) return null;

    return currentPassword === newPassword
      ? { sameAsCurrent: true }
      : null;
  };
}