import { Component } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Router } from '@angular/router';
import { NzFlexDirective } from 'ng-zorro-antd/flex';
import { NzInputOtpComponent } from 'ng-zorro-antd/input';
import { NzTypographyComponent } from 'ng-zorro-antd/typography';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SharedService } from '../../services/shared.service';
import { LoaderComponent } from "../../shared/loader/loader.component";

@Component({
  selector: 'app-otp-verification',
  standalone: true,
  imports: [NzFlexDirective, NzTypographyComponent, NzInputOtpComponent, FormsModule, ReactiveFormsModule, CommonModule, LoaderComponent],
  templateUrl: './otp-verification.component.html',
  styleUrl: './otp-verification.component.css'
})
export class OtpVerificationComponent {
  email!: string;
  Form!: FormGroup;
  loading: boolean = false;
  isResendDisabled: boolean = false;
  countdown: number = 60;
  interval: any;

  constructor(private router: Router, private srevice: SharedService, private toster: NzMessageService) { }

  ngOnInit() {
    const email = sessionStorage.getItem('email');
    if (email) {
      this.email = email
    }
    this.initForm()
    this.startCountdown()
  }

  initForm() {
    this.Form = new FormGroup({
      otp: new FormControl('', [Validators.required, Validators.minLength(4), Validators.maxLength(4)]),
    })
  }
  get otp() {
    return this.Form.get('otp');
  }

  onSubmit() {
    this.Form.markAllAsTouched();
    if (this.Form.valid) {
      this.loading = true;
      const formURlData = new URLSearchParams();
      formURlData.set('email', this.email);
      formURlData.set('otp', this.Form.value.otp);
      this.srevice.postAPI1('verifyForgetPasswordOtp', formURlData.toString()).subscribe({
        next: (res: any) => {
          if (res.success == true) {
            this.toster.success(res.message);
            this.router.navigateByUrl('/reset-password');
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

  restrictToNumbers(event: KeyboardEvent) {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode < 48 || charCode > 57) {
      event.preventDefault();
    }
  }

  startCountdown() {
    this.isResendDisabled = true;
    this.countdown = 60;

    this.interval = setInterval(() => {
      if (this.countdown > 0) {
        this.countdown--;
      } else {
        this.isResendDisabled = false;
        clearInterval(this.interval);
      }
    }, 1000);
  }

  resendOtp() {
    if (!this.isResendDisabled) {
      this.loading = true;
      const formURlData = new URLSearchParams();
      formURlData.set('email', this.email);
      this.srevice.postAPI1('forgotPassword', formURlData.toString()).subscribe({
        next: (res: any) => {
          if (res.success == true) {
            this.loading = false;
            this.toster.success('OTP resent successfully.');
            this.startCountdown();
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
