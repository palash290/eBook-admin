import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SharedService } from '../../services/shared.service';

@Component({
  selector: 'app-chat-room',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './chat-room.component.html',
  styleUrl: './chat-room.component.css'
})
export class ChatRoomComponent {

      data: any;
    
      constructor(private service: SharedService) { }
    
      ngOnInit() {
        this.getData();
      }
    
      getData() {
        this.service.getApi('getAllChats').subscribe({
          next: (resp: any) => {
            this.data = resp.ebook;
          },
          error: error => {
            console.log(error.message);
          }
        });
      }

}
