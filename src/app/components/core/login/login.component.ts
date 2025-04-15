import { Component, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { SharedService } from '../../services/shared.service';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LoaderComponent } from '../../shared/loader/loader.component';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [LoaderComponent, CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  isPasswordVisible: boolean = false;
  loginForm!: FormGroup;
  loading: boolean = false;
  resetForm!: FormGroup;
  @ViewChild('closeModal') closeModal!: ElementRef;

  constructor(private route: Router, private apiService: SharedService, private toastr: NzMessageService) {
    if (this.apiService.isLogedIn()) {
      this.route.navigate(['/home/dashboard']);
    }
  }

  ngOnInit(): void {
    this.initForm();
    this.initResetForm();
  }

  initResetForm() {
    this.resetForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email])
    })
  }

  initForm() {
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', Validators.required),
    })
  }

  loginAndFetchData() {
    this.loginForm.markAllAsTouched();
    if (this.loginForm.valid) {
      this.loading = true;
      const formURlData = new URLSearchParams();
      formURlData.set('email', this.loginForm.value.email);
      formURlData.set('password', this.loginForm.value.password);
      this.apiService.postAPI1('login', formURlData.toString()).subscribe({
        next: (resp: any) => {
          if (resp.success == true) {
            this.route.navigateByUrl("/home/dashboard");
            this.apiService.setToken(resp.token);
            this.toastr.success(resp.message);
            this.loading = false;
          } else {
            this.toastr.warning(resp.message);
            this.loading = false;
          }
        },
        error: (error) => {
          this.loading = false;
          if (error.error.message) {
            this.toastr.error(error.error.message);
          } else {
            this.toastr.error('Something went wrong!');
          }
        }
      });
    }
  }

  togglePasswordVisibility() {
    this.isPasswordVisible = !this.isPasswordVisible;
  }

  onSubmitReset() {
    this.resetForm.markAllAsTouched()
    if (this.resetForm.valid) {
      this.loading = true
      const formURlData = new URLSearchParams()
      formURlData.set('email', this.resetForm.value.email)
      this.apiService
        .postAPI('forgot-password', formURlData.toString())
        .subscribe({
          next: (resp: any) => {
            if (resp.success == true) {
              this.loading = false
              //this.toastr.success(resp.message)
              this.resetForm.reset()

              this.closeModal.nativeElement.click();
            } else {
              this.loading = false
              //this.toastr.warning(resp.message)
            }
            console.log(resp)
          },
          error: (error: any) => {
            this.loading = false
            if (error.error.message) {
              //this.toastr.error(error.error.message);
            } else {
              //this.toastr.error('Something went wrong!');
            }
          }
        })
    }
  }

}
