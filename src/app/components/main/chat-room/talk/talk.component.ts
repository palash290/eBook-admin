import { Component } from '@angular/core';
import { SharedService } from '../../../services/shared.service';
import { ActivatedRoute } from '@angular/router';
import { CommonModule, DatePipe, Location } from '@angular/common';
import { NzImageModule } from 'ng-zorro-antd/image';
@Component({
  selector: 'app-talk',
  standalone: true,
  imports: [CommonModule, NzImageModule],
  templateUrl: './talk.component.html',
  styleUrl: './talk.component.css',
  providers: [DatePipe]
})
export class TalkComponent {

  data: any;
  chatId: any;
  constructor(private service: SharedService, private route: ActivatedRoute, public location: Location, private datePipe: DatePipe) {

  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.chatId = params['id'];
      if (this.chatId) {
        this.getData();
      }
    })
  }

  getData() {
    this.service.getApi(`getAllChats/${this.chatId}`).subscribe({
      next: (resp: any) => {
        this.data = resp.data;
      },
      error: error => {
        console.log(error.message);
      }
    });
  }

  formatDate(timestamp: Date) {
    const now = new Date();
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    if (timestamp > oneHourAgo) {
      return this.datePipe.transform(timestamp, 'shortTime');
    } else if (timestamp > oneDayAgo) {
      return this.datePipe.transform(timestamp, 'mediumTime');
    } else {
      return this.datePipe.transform(timestamp, 'medium');
    }
  }
}
