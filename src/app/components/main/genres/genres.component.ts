import { Component, ElementRef, ViewChild } from '@angular/core';
import { SharedService } from '../../services/shared.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { RouterLink } from '@angular/router';
import { AbstractControl, FormControl, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-genres',
  standalone: true,
  imports: [RouterLink, FormsModule, CommonModule, ReactiveFormsModule],
  templateUrl: './genres.component.html',
  styleUrl: './genres.component.css'
})
export class GenresComponent {
  genreForm!: FormGroup
  genreId: any;
  data: any;
  searchQuery: string = '';
  currentPage: number = 1;
  pageSize: number = 10;
  totalCount: number = 0;
  pageSizeOptions = [5, 10, 25, 50];
  loading: boolean = false;
  @ViewChild('closeModal') closeModal!: ElementRef

  constructor(private service: SharedService, private toastr: NzMessageService) {
    this.genreForm = new FormGroup({
      name: new FormControl('', [Validators.required, NoWhitespaceDirective.validate]),
    });
  }

  ngOnInit() {
    this.getData();
  }

  ngAfterViewInit() {
    const modalElement = document.getElementById('ct_Add_modal');
    if (modalElement) {
      modalElement.addEventListener('hidden.bs.modal', () => {
        this.resetForm();
      });
    }
  }
  getData() {
    this.service.getApi(`getAllCategory?search=${this.searchQuery}&page=${this.currentPage}&limit=${this.pageSize}`).subscribe({
      next: (resp: any) => {
        this.data = resp.category;
        this.totalCount = resp.totalCount;
      },
      error: error => {
        console.log(error.message);
      }
    });
  }

  deleteGenre() {
    this.service.delete(`deleteBook/${this.genreId}`).subscribe({
      next: (res: any) => {
        if (res.success == true) {
          this.toastr.success(res.message);
          this.data = this.data.filter((item: any) => item.id !== this.genreId);
        } else {
          this.toastr.warning(res.message)
        }
      },
      error: (error) => {
        this.toastr.error(error);
      }
    })
  }
  onSubmit() {
    if (this.genreForm.invalid) {
      this.genreForm.markAllAsTouched()
      return
    }
    this.loading = true;
    let formData = { name: this.genreForm.value.name }

    if (this.genreId) {
      this.service.update(`updateCategory/${this.genreId}`, formData).subscribe({
        next: (res: any) => {
          if (res.success == true) {
            this.toastr.success(res.message);
            this.closeModal.nativeElement.click();
            this.getData();
            this.genreId = null;
            this.genreForm.reset();
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
      this.service.postAPI('addCategory', formData).subscribe({
        next: (res: any) => {
          if (res.success == true) {
            this.toastr.success(res.message);
            this.closeModal.nativeElement.click();
            this.getData();
            this.genreForm.reset();
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

  editGenre(data: any) {
    this.genreId = data.id;
    this.genreForm.patchValue({
      name: data.name
    })
  }

  resetForm() {
    this.genreId = null;
    this.genreForm.reset();
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
}

export class NoWhitespaceDirective {
  static validate(control: AbstractControl): ValidationErrors | null {
    if (!control.value || control.value.trim() == '') {
      return { required: true };
    }
    return null;
  }
}