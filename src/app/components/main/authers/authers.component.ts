import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { SharedService } from '../../services/shared.service';
import Swal from 'sweetalert2';
import { FormsModule } from '@angular/forms';
import { AuthorDetailComponent } from "./author-detail/author-detail.component";
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-authers',
  standalone: true,
  imports: [CommonModule, FormsModule, AuthorDetailComponent, RouterLink],
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
  authorId: number | undefined
  constructor(private service: SharedService) { }

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

  handleCheckboxChange() {
    this.service.getApi(`toggleAuthorStatusByAdmin/${this.authorId}`).subscribe({
      next: resp => {
        this.getData();
      }
    })
  }

  selectedSwitch: any;
  onSwitchClick(event: Event, item: any, switchRef: HTMLInputElement) {
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
}
