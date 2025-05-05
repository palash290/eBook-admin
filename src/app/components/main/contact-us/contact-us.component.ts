import { Component } from '@angular/core';
import { SharedService } from '../../services/shared.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-contact-us',
  standalone: true,
  imports: [RouterLink, CommonModule, FormsModule],
  templateUrl: './contact-us.component.html',
  styleUrl: './contact-us.component.css'
})
export class ContactUsComponent {
  data: any;
  searchQuery: string = '';
  currentPage: number = 1;
  pageSize: number = 5;
  totalCount: number = 0;
  pageSizeOptions = [5, 10, 25, 50];
  constructor(private service: SharedService, private toastr: NzMessageService) { }

  ngOnInit() {
    this.getData();
  }

  getData() {
    this.service.getApi(`getAllContact?search=${this.searchQuery}&page=${this.currentPage}&limit=${this.pageSize}`).subscribe({
      next: (resp: any) => {
        this.data = resp.contact;
        this.totalCount = resp.totalCount;
      },
      error: error => {
        console.log(error.message);
      }
    });
  }

  markAsResolved(id: any) {
    this.service.delete(`UpdateContactIssue/${id}`).subscribe({
      next: (res: any) => {
        if (res.success == true) {
          this.toastr.success(res.message);
          this.getData();
        } else {
          this.toastr.warning(res.message)
        }
      },
      error: (error) => {
        this.toastr.error(error);
      }
    })
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
