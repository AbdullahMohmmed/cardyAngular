import { Component } from '@angular/core';
import {MatDialog, MatDialogModule} from '@angular/material/dialog';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-send-message',
  standalone: true,
  imports: [MatButtonModule, MatDialogModule,MatIconModule,MatInputModule,MatFormFieldModule,FormsModule],
  templateUrl: './send-message.component.html'
  ,
  styleUrl: './send-message.component.css'
})
export class SendMessageComponent {

}
