import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SharedService } from '../../services/shared.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LoaderComponent } from "../../shared/loader/loader.component";

@Component({
  selector: 'app-chat-room',
  standalone: true,
  imports: [RouterLink, CommonModule, FormsModule, LoaderComponent],
  templateUrl: './chat-room.component.html',
  styleUrl: './chat-room.component.css'
})
export class ChatRoomComponent {
  data: any;
  searchQuery: string = '';
  currentPage: number = 1;
  pageSize: number = 5;
  totalCount: number = 0;
  pageSizeOptions = [5, 10, 25, 50];
  loading: boolean = false
  constructor(private service: SharedService) { }

  ngOnInit() {
    this.loading = true
    this.getData();
  }

  getData() {
    this.service.getApi(`getAllChats?search=${this.searchQuery}&page=${this.currentPage}&limit=${this.pageSize}`).subscribe({
      next: (resp: any) => {
        this.data = resp.chats;
        this.totalCount = resp.totalCount;
        this.loading = false
      },
      error: error => {
        console.log(error.message);
        this.loading = false
      }
    });
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
