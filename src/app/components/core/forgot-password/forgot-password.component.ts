import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { SharedService } from '../../services/shared.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { LoaderComponent } from "../../shared/loader/loader.component";

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [RouterLink, CommonModule, FormsModule, ReactiveFormsModule, LoaderComponent],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css'
})
export class ForgotPasswordComponent {
  Form!: FormGroup;
  loading: boolean = false;

  constructor(private router: Router, private srevice: SharedService, private toster: NzMessageService) { }


  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    this.Form = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
    })
  }

  onSubmit() {
    this.Form.markAllAsTouched();
    if (this.Form.valid) {
      this.loading = true;
      const formURlData = new URLSearchParams();
      formURlData.set('email', this.Form.value.email);
      this.srevice.postAPI1('forgotPassword', formURlData.toString()).subscribe({
        next: (res: any) => {
          if (res.success == true) {
            this.toster.success(res.message);
            sessionStorage.setItem('email', this.Form.value.email);
            this.router.navigateByUrl('/otp-verification');
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
}
