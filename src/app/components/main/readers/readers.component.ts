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
  userId: number | undefined;
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

  handleCheckboxChange() {
    this.service.getApi(`toggleUserStatusByAdmin/${this.userId}`).subscribe({
      next: resp => {
        this.getData();
      }
    })
  }

  selectedSwitch: any;
  onSwitchClick(event: Event, item: any, switchRef: HTMLInputElement) {
    event.preventDefault();
    this.userId = item.id;
    this.selectedSwitch = switchRef;
  }
}
