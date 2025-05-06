import { Component } from '@angular/core';
import { SharedService } from '../../services/shared.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-readers',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './readers.component.html',
  styleUrl: './readers.component.css'
})
export class ReadersComponent {
  searchQuery: string = '';
  currentPage: number = 1;
  pageSize: number = 5;
  totalCount: number = 0;
  pageSizeOptions = [5, 10, 25, 50];
  data: any;
  userId: number | undefined;
  status: number | undefined;
  constructor(private service: SharedService) { }

  ngOnInit() {
    this.getData();
  }

  getData() {
    this.service.getApi(`getAllReader?search=${this.searchQuery}&page=${this.currentPage}&limit=${this.pageSize}`).subscribe({
      next: (resp: any) => {
        this.data = resp.readers;
        this.totalCount = resp.totalCount;
      },
      error: error => {
        console.log(error.message);
      }
    });
  }

  handleCheckboxChange() {
    this.service.getApi(`toggleUserStatusByAdmin/${this.userId}`).subscribe({
      next: resp => {
        this.getData();
      }
    })
  }

  selectedSwitch: any;
  onSwitchClick(event: Event, item: any, switchRef: HTMLInputElement) {
    this.status = item.status
    event.preventDefault();
    this.userId = item.id;
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
