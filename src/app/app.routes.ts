import { Routes } from '@angular/router';
import { UserComponent } from './user/user.component';
import { LoginComponent } from './registerion/login/login.component';

export const routes: Routes = [
  {path:"",redirectTo:"login",pathMatch:"full"},

  {path:"user",component:UserComponent},
  {path:"login",component:LoginComponent},
];
