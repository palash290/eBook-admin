import { Component } from '@angular/core';
import { SharedService } from '../../services/shared.service';
import { CommonModule } from '@angular/common';
import { NzMessageService } from 'ng-zorro-antd/message';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-e-book',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './e-book.component.html',
  styleUrl: './e-book.component.css'
})
export class EBookComponent {
  bookId: any;
  data: any;
  constructor(private service: SharedService, private toastr: NzMessageService) { }

  ngOnInit() {
    this.getData();
  }

  getData() {
    this.service.getApi('getAllEbook').subscribe({
      next: (resp: any) => {
        this.data = resp.ebook;
      },
      error: error => {
        console.log(error.message);
      }
    });
  }

  deleteBook() {
    this.service.delete(`deleteBook/${this.bookId}`).subscribe({
      next: (res: any) => {
        if (res.success == true) {
          this.toastr.success(res.message);
          this.data = this.data.filter((item: any) => item.id !== this.bookId);
        } else {
          this.toastr.warning(res.message)
        }
      },
      error: (error) => {
        this.toastr.error(error);
      }
    })
  }

  categories(data: any) {
    return data
      .map((c: any) => c.category?.name)
      .filter((name: any) => name)
      .join(' | ');
  }

}
