import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { SharedService } from '../../services/shared.service';
import Swal from 'sweetalert2';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-authers',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './authers.component.html',
  styleUrl: './authers.component.css'
})
export class AuthersComponent {

  data: any;

  constructor(private service: SharedService) { }

  ngOnInit() {
    this.getData();
  }

  getData() {
    this.service.getApi('getAllAuthor').subscribe({
      next: (resp: any) => {
        this.data = resp.author;
      },
      error: error => {
        console.log(error.message);
      }
    });
  }

    handleCheckboxChange(row: any) {
      //row.status = row.status === 0 ? 1 : 0;
      if (row.status == 0) {
        Swal.fire({
          title: "Are you sure?",
          text: "You want to active this user!",
          icon: "success",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Yes!",
          cancelButtonText: "No"
        }).then((result) => {
          if (result.isConfirmed) {
            this.service.getApi(`toggleAuthorStatusByAdmin/${row.id}`).subscribe({
              next: resp => {
                //this.toastr.success(resp.message)
                this.getData();
              }
            })
          } else {
            this.getData();
          }
        });
      } else {
        Swal.fire({
          title: "Are you sure?",
          text: "You want to deactive this user!",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Yes!",
          cancelButtonText: "No"
        }).then((result) => {
          if (result.isConfirmed) {
            this.service.getApi(`toggleAuthorStatusByAdmin/${row.id}`).subscribe({
              next: resp => {
                //this.toastr.success(resp.message)
                this.getData();
              }
            })
          } else {
            this.getData();
          }
        });
      }
    }


}
