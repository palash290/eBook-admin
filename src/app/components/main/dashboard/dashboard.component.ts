import { Component } from '@angular/core';
import { SharedService } from '../../services/shared.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {

  data: any;

  constructor(private service: SharedService) { }

  ngOnInit() {
    this.getData();
  }

  getData() {
    this.service.get('dashboard-details').subscribe({
      next: (resp: any) => {
        this.data = resp.data.totalBookingsPerMonth;
      },
      error: error => {
        console.log(error.message);
      }
    });
  }
  

}
