import { Component , Input } from '@angular/core';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatSidenavModule} from '@angular/material/sidenav';
import {InfoCardComponent} from '../user/ui/info-card/info-card.component';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [MatToolbarModule,MatButtonModule,MatIconModule,MatSidenavModule,InfoCardComponent],
  templateUrl: './user.component.html',
  styleUrl: './user.component.css'
})
export class UserComponent {
@Input() name = '';

}
