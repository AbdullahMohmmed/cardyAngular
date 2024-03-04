import { Component } from '@angular/core';
 import {MatIconModule} from '@angular/material/icon';
import {MatDialog, MatDialogModule} from '@angular/material/dialog';
import {MatButtonModule} from '@angular/material/button';
import { SendMessageComponent } from '../send-message/send-message.component';



@Component({
  selector: 'app-info-card',
  standalone: true,
  imports: [MatButtonModule,MatIconModule,MatDialogModule],
  templateUrl: './info-card.component.html',
  styleUrl: './info-card.component.css'
})
export class InfoCardComponent {
  constructor(public dialog: MatDialog) {}

  openDialog() {
    const dialogRef = this.dialog.open(SendMessageComponent, {restoreFocus: false});

   }
}
