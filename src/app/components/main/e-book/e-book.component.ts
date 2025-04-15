import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SharedService } from '../../services/shared.service';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-e-book',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './e-book.component.html',
  styleUrl: './e-book.component.css'
})
export class EBookComponent {

    data: any;
  
    constructor(private service: SharedService) { }
  
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


}
