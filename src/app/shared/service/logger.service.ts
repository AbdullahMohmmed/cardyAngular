import { Injectable } from '@angular/core';
import { env } from '../../../env/env';

@Injectable({
  providedIn: 'root',
})
export class LoggerService {
  log(message: string, value?: any) {
    if (!env.production) {
      if (value) console.log(message, value);
      else console.log(message);
    }
  }
  error(message: string, value?: any) {
    if (!env.production) {
      if (value) console.error(message, value);
      else console.error(message);
    }
  }
}
