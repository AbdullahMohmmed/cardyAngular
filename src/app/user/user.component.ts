import { Component, Input, inject } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { InfoCardComponent } from '../user/ui/info-card/info-card.component';
import { AuthService } from '../shared/service/auth.service';
import {
  EMPTY,
  Observable,
  catchError,
  combineLatest,
  of,
  switchMap,
  tap,
} from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CUser } from '../shared/types/user.type';
import { SettingsFormComponent } from './ui/settings-form/settings-form.component';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatSidenavModule,
    InfoCardComponent,
    SettingsFormComponent,
  ],
  templateUrl: './user.component.html',
  styleUrl: './user.component.css',
})
export class UserComponent {
  private aRouter = inject(ActivatedRoute);
  private userSrv = inject(AuthService);
  user$ = this.userSrv.user$;

  display: 'card' | 'setting' | 'notfound' = 'card';
  data$?: Observable<CUser>;
  constructor() {
    const { username } = this.aRouter.snapshot.params;
    if (this.user$) {
      this.user$
        .pipe(
          switchMap((user) =>
            combineLatest({
              user: of(user),
              resUser: this.userSrv.getUserByUsername(username),
            })
          ),
          tap(({ user, resUser }) => {
            this.display = !resUser
              ? 'notfound'
              : resUser.username === user?.username
              ? 'setting'
              : 'card';
            this.data$ = of(resUser);
          })
        )
        .subscribe();
    } else {
      this.data$ = this.userSrv.getUserByUsername(username).pipe(
        tap((user) => {
          this.display = 'card';
        }),
        catchError((e) => {
          console.log(e);
          this.display = 'notfound';
          return EMPTY;
        })
      );
    }
  }
}
