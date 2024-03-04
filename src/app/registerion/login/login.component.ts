import { Component, Input } from '@angular/core';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';

import {MatFormFieldModule} from '@angular/material/form-field';
 import {ReactiveFormsModule, FormControl, FormGroup, FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule, MatButtonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  profileForm = new FormGroup({
    email: new FormControl(''),
    password: new FormControl(''),
  });
  login() {
    console.log( this.profileForm.value.email , this.profileForm.value.password);
  }

}
