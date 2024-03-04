import { Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { SendMessageComponent } from '../send-message/send-message.component';
import { CUser } from '../../../shared/types/user.type';

@Component({
  selector: 'app-info-card',
  standalone: true,
  imports: [MatButtonModule, MatIconModule, MatDialogModule],
  templateUrl: './info-card.component.html',
  styleUrl: './info-card.component.css',
})
export class InfoCardComponent {
  @Input({ required: true }) data!: CUser;
  constructor(public dialog: MatDialog) {}

  openDialog() {
    const dialogRef = this.dialog.open(SendMessageComponent, {
      restoreFocus: false,
    });
  }
}
