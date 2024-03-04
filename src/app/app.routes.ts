import { Routes } from '@angular/router';
import { UserComponent } from './user/user.component';
import { LoginComponent } from './registerion/login/login.component';
import { SignupComponent } from './registerion/sign-up/sign-up.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'my-card/:username', component: UserComponent },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
];
