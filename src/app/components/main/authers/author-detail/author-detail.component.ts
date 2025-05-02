import { Component } from '@angular/core';
import { SharedService } from '../../../services/shared.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { CommonModule } from '@angular/common';
import { LoaderComponent } from '../../../shared/loader/loader.component';

@Component({
  selector: 'app-author-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, LoaderComponent],
  templateUrl: './author-detail.component.html',
  styleUrl: './author-detail.component.css'
})
export class AuthorDetailComponent {
  authors!: any
  authorId: number | undefined;
  userInfo: any;
  loading: boolean = false
  categoryNames: string = ''
  constructor(private router: Router, private service: SharedService, private toastr: NzMessageService, private route: ActivatedRoute) {
    this.route.queryParams.subscribe(params => {
      this.authorId = params['id']
    })
  }

  ngOnInit(): void {
    this.loading = true
    this.getProfile()
    if (this.authorId) {
      this.getAuthors()
    }
  }

  getAuthors() {
    let apiUrl = `getAllAuthor/${this.authorId}`

    this.service.getApi(apiUrl).subscribe({
      next: (resp: any) => {
        this.authors = resp.author;
        this.loading = false
        if (this.authors?.AuthorCategory) {
          this.categoryNames = this.authors.AuthorCategory
            .map((c: any) => c.category?.name)
            .filter((name: any) => name)
            .join(' | ');

        } else {
          this.categoryNames = 'No Categories';
        }
      },
      error: error => {
        console.log(error.message);
        this.loading = false
      }
    });
  }

  getProfile() {
    this.service.profileData$.subscribe((data) => {
      if (data) {
        this.userInfo = data;
      }
    })
  }
}
