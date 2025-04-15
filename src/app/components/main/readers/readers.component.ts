import { Component } from '@angular/core';
import { SharedService } from '../../services/shared.service';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-readers',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './readers.component.html',
  styleUrl: './readers.component.css'
})
export class ReadersComponent {

  data: any;

  constructor(private service: SharedService) { }

  ngOnInit() {
    this.getData();
  }

  getData() {
    this.service.getApi('getAllReader').subscribe({
      next: (resp: any) => {
        this.data = resp.readers;
      },
      error: error => {
        console.log(error.message);
      }
    });
  }

  handleCheckboxChange(row: any) {
    //row.status = row.status === 0 ? 1 : 0;
    //debugger
    if (row.status == 0) {
      Swal.fire({
        title: "Are you sure?",
        text: "You want to active this author!",
        icon: "success",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes!",
        cancelButtonText: "No"
      }).then((result) => {
        if (result.isConfirmed) {
          this.service.getApi(`toggleUserStatusByAdmin/${row.id}`).subscribe({
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
        text: "You want to deactive this author!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes!",
        cancelButtonText: "No"
      }).then((result) => {
        if (result.isConfirmed) {
          this.service.getApi(`toggleUserStatusByAdmin/${row.id}`).subscribe({
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
