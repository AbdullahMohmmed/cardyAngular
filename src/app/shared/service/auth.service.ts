import { Injectable, inject } from '@angular/core';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
} from '@angular/fire/auth';
import {
  BehaviorSubject,
  Observable,
  filter,
  from,
  map,
  switchMap,
  tap,
} from 'rxjs';
import {
  CUser,
  LoginCredential,
  RegisterCredential,
  UpdateUser,
} from '../types/user.type';
import { FireService } from './fire.service';
import { LoggerService } from './logger.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private fire = inject(FireService);
  private logger = inject(LoggerService);
  private auth = inject(AngularFireAuth);
  private router = inject(Router);
  private cookieSrv = inject(CookieService);
  private userSubject = new BehaviorSubject<CUser | null>(null);

  get user$() {
    return this.userSubject.asObservable();
  }

  constructor() {
    const userCookie = this.cookieSrv.get('userCardyData');
    const userData =
      typeof userCookie === 'string' && userCookie
        ? (JSON.parse(userCookie) as CUser)
        : null;
    if (userData) {
      this.userSubject.next(userData);
    }
    this.getAuth().pipe(takeUntilDestroyed()).subscribe();
  }
  private getAuth() {
    return this.auth.authState.pipe(
      tap((user) => {
        this.logger.log('auth user ==> ', user);
      }),
      filter((user) => user !== null),
      map((user) => user as firebase.default.User),
      switchMap(({ uid }) => this.getUser(uid))
    );
  }

  private getUser(uid: string) {
    return (
      this.fire.docWithRefs$<CUser>(`users/${uid}`) as Observable<CUser>
    ).pipe(
      map((user) => ({ ...user, uid })),
      tap((user) => this.userSubject.next(user))
    );
  }
  getUserByUsername(username: string) {
    return this.fire
      .colWithIds$<CUser[]>('users', (ref) =>
        ref.where('username', '==', username)
      )
      .pipe(map((users) => users[0] as CUser));
  }
  login({ email, password }: LoginCredential) {
    return from(this.auth.signInWithEmailAndPassword(email, password)).pipe(
      map((res) => res.user?.uid),
      switchMap((uid) => this.getUser(uid as string)),
      tap(({ username }) => this.router.navigate(['/', 'my-card', username]))
    );
  }

  signUp(data: RegisterCredential) {
    const { email, password } = data;
    delete (data as unknown as Partial<RegisterCredential>).password;
    return this.fire
      .col$<CUser>('users', (ref) => ref.where('username', '==', data.username))
      .pipe(
        map((users) => {
          if (users.length > 0) throw new Error('username already used');
          return users;
        }),
        switchMap(() =>
          from(this.auth.createUserWithEmailAndPassword(email, password))
        ),
        map((res) => res.user?.uid),
        switchMap((uid) =>
          this.fire.addWithId<CUser>('users', data, uid as string)
        )
      );
  }

  updateUser(data: UpdateUser) {
    const { uid } = data;
    return from(this.fire.update(`users/${uid}`, data));
  }
}
