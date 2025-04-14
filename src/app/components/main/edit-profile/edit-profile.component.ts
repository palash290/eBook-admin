import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SharedService } from '../../services/shared.service';

@Component({
  selector: 'app-edit-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './edit-profile.component.html',
  styleUrl: './edit-profile.component.css'
})
export class EditProfileComponent {

  profileForm!: FormGroup;
  userDet: any;
  userEmail: any;
  name: any;
  phone: any;
  loading: boolean = false;

  pattern1 = "^[0-9_-]{8,15}";

  constructor(private route: Router, private service: SharedService) { }

  ngOnInit() {
    this.initForm();
    this.loadUserProfile();
  }

  initForm() {
    this.profileForm = new FormGroup({
      name: new FormControl('', Validators.required),
      phone: new FormControl('', [Validators.required, Validators.pattern(this.pattern1)]),
      email: new FormControl({ value: this.userEmail, disabled: true }),
    });
  }

  loadUserProfile() {
    this.service.get('get-profile').subscribe({
      next: (resp: any) => {
        this.userEmail = resp.admin.email;
        this.name = resp.admin.name;
        this.phone = resp.admin.phone_number;

        this.profileForm.patchValue({
          name: this.name,
          phone: this.phone,
          email: this.userEmail,
        });

      },
      error: (error) => {
        console.log(error.message);
      }
    });
  }

  onSubmit() {
    // if (this.profileForm.valid) {
    //   this.toastr.warning('Please check all the fields!');
    //   return;
    // }

    const name = this.profileForm.value.name?.trim();
    //const phone = this.profileForm.value.phone?.trim();

    if (!name) {
      return;
    }

    this.profileForm.markAllAsTouched();

    if (this.profileForm.valid) {
      this.loading = true;
      const formURlData = new URLSearchParams();
      formURlData.set('name', this.profileForm.value.name);
      //formURlData.set('email', this.userEmail);
      formURlData.set('phone_number', this.profileForm.value.phone);

      this.service.postAPI('update-profile', formURlData.toString()).subscribe({
        next: (resp: any) => {
          if (resp.success === true) {
            //this.toastr.success(resp.message);
            this.loading = false;
          } else {
            //this.toastr.warning(resp.message);
            this.loading = false;
          }
        },
        error: (error) => {
          //this.toastr.warning('Something went wrong.');
          console.log(error.message);
          this.loading = false;
        }
      });
    } else {
      //this.loading = false;
      //this.toastr.warning('Please check all the fields!');
    }
  }

}
