import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { CommonModule } from '@angular/common';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';
import { LoaderComponent } from '../../../shared/loader/loader.component';
import { SharedService } from '../../../services/shared.service';

@Component({
  selector: 'app-book-details',
  standalone: true,
  imports: [RouterLink, CommonModule, LoaderComponent, NzModalModule],
  templateUrl: './book-details.component.html',
  styleUrl: './book-details.component.css'
})
export class BookDetailsComponent {
  bookData!: any;
  bookId!: number
  loading: boolean = false
  constructor(private router: Router, private service: SharedService, private toastr: NzMessageService, private route: ActivatedRoute, private modalService: NzModalService) {
    this.route.queryParams.subscribe(params => {
      this.bookId = params['id'];
    })
  }

  ngOnInit(): void {
    this.getBookById()
  }

  getBookById() {
    this.loading = true
    let apiUrl = `getAllEbook/${this.bookId}`
    this.service.getApi(apiUrl).subscribe({
      next: (resp: any) => {
        this.bookData = resp.book;
        this.loading = false
      },
      error: error => {
        console.log(error.message);
        this.loading = false
      }
    });
  }
}
