import { CommonModule } from '@angular/common';
import { Component, Input, inject } from '@angular/core';
import {
  FormArray,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { CUser } from '../../../shared/types/user.type';
import { AuthService } from '../../../shared/service/auth.service';
import { first, take } from 'rxjs';

@Component({
  selector: 'app-settings-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './settings-form.component.html',
  styleUrl: './settings-form.component.css',
})
export class SettingsFormComponent {
  private userSrv = inject(AuthService);
  form = new FormGroup({
    name: new FormControl('', [Validators.required]),
    email: new FormControl({ disabled: true, value: '' }, [
      Validators.required,
      Validators.email,
    ]),
    photo: new FormControl(),
    username: new FormControl({ disabled: true, value: '' }),
    position: new FormControl(),
    colors: new FormArray([]),
    uid: new FormControl(),
    bio: new FormControl('', []),
    phone: new FormControl('', []),
    address: new FormControl(),
  });
  constructor() {
    this.userSrv.user$.pipe(take(2)).subscribe((user) => {
      console.log(user);
      if (user) {
        this.form.patchValue(user as any);
      }
    });
  }

  update() {
    const value = this.form.getRawValue() as unknown as CUser;
    console.log(value);
    this.userSrv.updateUser(value).subscribe();
  }
}
