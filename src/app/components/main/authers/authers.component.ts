import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { SharedService } from '../../services/shared.service';
import Swal from 'sweetalert2';
import { AbstractControl, FormControl, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-authers',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, FormsModule, ReactiveFormsModule],
  templateUrl: './authers.component.html',
  styleUrl: './authers.component.css'
})
export class AuthersComponent {
  searchQuery: string = '';
  currentPage: number = 1;
  pageSize: number = 5;
  totalCount: number = 0;
  pageSizeOptions = [5, 10, 25, 50];
  data: any;
  authorId: number | undefined | null
  status: number | undefined
  authorForm!: FormGroup;
  loading: boolean = false;
  profilePreview: string | undefined;
  profileImage: File | null = null;
  @ViewChild('closeModal') closeModal!: ElementRef

  constructor(private service: SharedService, private toastr: NzMessageService) {
    this.authorForm = new FormGroup({
      fullName: new FormControl('', [Validators.required, NoWhitespaceDirective.validate]),
    });
  }

  ngOnInit() {
    this.getData();
  }

  getData() {
    this.service.getApi(`getAllAuthor?search=${this.searchQuery}&page=${this.currentPage}&limit=${this.pageSize}`).subscribe({
      next: (resp: any) => {
        this.data = resp.authors;
        this.totalCount = resp.totaCount;
      },
      error: error => {
        console.log(error.message);
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

  handleCheckboxChange() {
    this.service.getApi(`toggleAuthorStatusByAdmin/${this.authorId}`).subscribe({
      next: resp => {
        this.getData();
      }
    })
  }

  selectedSwitch: any;
  onSwitchClick(event: Event, item: any, switchRef: HTMLInputElement) {
    this.status = item.status
    event.preventDefault();
    this.authorId = item.id;
    this.selectedSwitch = switchRef;
  }

  search(event: any) {
    this.searchQuery = event.target.value.trim().toLowerCase();
    this.currentPage = 1;
    this.getData();
  }
  changePage(page: number) {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.getData();
  }

  changePageSize(newPageSize: number) {
    this.pageSize = newPageSize;
    this.currentPage = 1;
    this.getData();
  }

  get totalPages(): number {
    return Math.ceil(this.totalCount / this.pageSize);
  }

  onSubmit() {
    if (this.authorForm.invalid) {
      this.authorForm.markAllAsTouched()
      return
    }
    this.loading = true;

    let formData = new FormData()
    formData.append('fullName', this.authorForm.value.fullName)
    if (this.profileImage) {
      formData.append('avatar_url', this.profileImage)
      formData.append('coverImage', this.profileImage)
    }

    if (this.authorId) {
      this.service.update(`updateCategory/${this.authorId}`, formData).subscribe({
        next: (res: any) => {
          if (res.success == true) {
            this.toastr.success(res.message);
            this.closeModal.nativeElement.click();
            this.getData();
            this.authorId = null;
            this.authorForm.reset();
          } else {
            this.loading = false;
            this.toastr.warning(res.message);
          }
        },
        error: (error) => {
          this.loading = false;
          this.toastr.error(error.error.message);
        }
      });
    } else {
      this.service.postAPI('addAuthor', formData).subscribe({
        next: (res: any) => {
          if (res.success == true) {
            this.toastr.success(res.message);
            this.closeModal.nativeElement.click();
            this.getData();
            this.authorForm.reset();
          } else {
            this.loading = false;
            this.toastr.warning(res.message);
          }
        },
        error: (error) => {
          this.loading = false;
          this.toastr.error(error.error.message);
        }
      });
    }
  }

  editAuthor(data: any) {
    this.authorId = data.id;
    this.authorForm.patchValue({
      name: data.name
    })
  }

  resetForm() {
    this.authorId = null;
    this.authorForm.reset();
  }

  deleteAuthor() {
    this.service.delete(`deleteBook/${this.authorId}`).subscribe({
      next: (res: any) => {
        if (res.success == true) {
          this.toastr.success(res.message);
          this.data = this.data.filter((item: any) => item.id !== this.authorId);
        } else {
          this.toastr.warning(res.message)
        }
      },
      error: (error) => {
        this.toastr.error(error);
      }
    })
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