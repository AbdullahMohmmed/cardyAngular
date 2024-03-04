import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { InfoCardComponent } from '../../user/ui/info-card/info-card.component';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';


@Component({
  selector: 'app-setting',
  standalone: true,
  imports: [MatDatepickerModule, FormsModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule, MatButtonModule, MatNativeDateModule],
  providers: [  
    MatDatepickerModule,  
  ],
  templateUrl: './setting.component.html',
  styleUrl: './setting.component.css'
})
export class SettingComponent {
 formGroup: FormGroup = new FormGroup({
  name: new FormControl(),
  dob: new FormControl(),
  userName: new FormControl(),
  jobTitle: new FormControl(),
  email: new FormControl(),
  mobile: new FormControl(),
  city: new FormControl(),
  password: new FormControl(),
  bio: new FormControl(),
  insta: new FormControl(),
  twitter: new FormControl(),
  github: new FormControl(),
  linkedin: new FormControl(),
 })
 save(){
  const data = this.formGroup.getRawValue()
  console.log('Data is ==> ', data)
 }

}
