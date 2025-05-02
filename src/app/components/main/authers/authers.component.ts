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

  data: any;
  authorId: number | undefined
  constructor(private service: SharedService) { }

  ngOnInit() {
    this.getData();
  }

  getData() {
    this.service.getApi('getAllAuthor').subscribe({
      next: (resp: any) => {
        this.data = resp.authors;
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
}
