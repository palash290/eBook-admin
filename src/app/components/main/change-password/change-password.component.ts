import { Component } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { SharedService } from '../../services/shared.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.css'
})
export class ChangePasswordComponent {

  form!: FormGroup;
  passwordMismatch = false;
  loading: boolean = false;

  constructor(private service: SharedService) { }

  ngOnInit() {
    this.initForm()
  }

  initForm() {
    this.form = new FormGroup({
      current_password: new FormControl('', Validators.required),
      new_password: new FormControl('', [Validators.required, Validators.minLength(8)]),
      confirm_password: new FormControl('', Validators.required),
    }, { validators: passwordMatchValidator() });

  }

  submitForm() {
    this.form.markAllAsTouched();

    const currPassword = this.form.value.current_password?.trim();
    const newPassword = this.form.value.new_password?.trim();

    if (!currPassword || !newPassword) {
      //this.toastr.warning('Passwords cannot be empty or just spaces.');
      return;
    }

    if (this.form.valid && !this.passwordMismatch) {
      this.loading = true;
      const formURlData = new URLSearchParams();
      formURlData.set('old_password', this.form.value.current_password);
      formURlData.set('new_password', this.form.value.confirm_password);
      this.service.postAPI('change-password', formURlData).subscribe({
        next: (resp: any) => {
          if (resp.success == true) {
            //this.toastr.success(resp.message);
            console.log(resp.message)
            this.form.reset();
            this.loading = false;
          } else {
            //this.toastr.warning(resp.message);
            this.loading = false;
          }
        },
        error: (error) => {
          this.loading = false;
          //this.toastr.warning('Current password is incorrect.');
          console.error('Login error:', error.message);
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

export function passwordMatchValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: boolean } | null => {
    const password = control.get('new_password');
    const confirmPassword = control.get('confirm_password');

    if (!password || !confirmPassword) {
      return null;
    }
    return password.value !== confirmPassword.value ? { 'passwordMismatch': true } : null;
  };


}
