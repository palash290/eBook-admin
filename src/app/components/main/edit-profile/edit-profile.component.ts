import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SharedService } from '../../services/shared.service';
import { NzMessageService } from 'ng-zorro-antd/message';

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
  profilePreview: string | undefined
  profileImage: File | null = null
  // pattern1 = "^[0-9_-]{8,15}";

  constructor(private route: Router, private service: SharedService, private toastr: NzMessageService) { }

  ngOnInit() {
    this.initForm();
    this.loadUserProfile();
  }

  initForm() {
    this.profileForm = new FormGroup({
      name: new FormControl('', [Validators.required, NoWhitespaceDirective.validate]),
      // phone: new FormControl('', [Validators.required, Validators.pattern(this.pattern1)]),
      email: new FormControl(''),
    });
  }

  loadUserProfile() {
    this.service.profileData$.subscribe((data) => {
      if (data) {
        this.profilePreview = data.avatar_url;
        this.profileForm.patchValue({
          name: data.fullName,
          email: data.email,
        });
      }
    });
  }

  onSubmit() {
    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched()
      return
    }
    this.loading = true;
    let formData = new FormData()
    formData.append('fullName', this.profileForm.value.name)
    if (this.profileImage) {
      formData.append('avatar_url', this.profileImage)
    }

    this.service.update('editProfile', formData).subscribe({
      next: (res: any) => {
        if (res.success == true) {
          this.toastr.success(res.message);
          this.service.getProfile('getMyProfile')
        } else {
          this.loading = false;
          this.toastr.warning(res.message);
        }
      },
      error: (error) => {
        this.loading = false;
        this.toastr.error(error);
      }
    });
  }

  onFileChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.profilePreview = e.target.result;
      };
      reader.readAsDataURL(file);
      this.profileImage = file
    }
  }

}

export class NoWhitespaceDirective {
  static validate(control: AbstractControl): ValidationErrors | null {
    if (!control.value || control.value.trim() == '') {
      return { required: true };
    }
    return null;
  }
}