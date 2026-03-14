import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoadingService {
  private loadingCount = 0;
  private loadingSubject = new BehaviorSubject<boolean>(false);
  private messageSubject = new BehaviorSubject<string>('Preparando informacion...');

  // observable para que el loader se suscriba
  loading$: Observable<boolean> = this.loadingSubject.asObservable();
  message$: Observable<string> = this.messageSubject.asObservable();

  show(message?: string) {
    this.loadingCount++;
    if (message) {
      this.messageSubject.next(message);
    }
    if (this.loadingCount === 1) {
      this.loadingSubject.next(true);
    }
  }

  hide() {
    if (this.loadingCount > 0) {
      this.loadingCount--;
    }
    if (this.loadingCount === 0) {
      this.loadingSubject.next(false);
    }
  }

  reset() {
    this.loadingCount = 0;
    this.loadingSubject.next(false);
    this.messageSubject.next('Preparando informacion...');
  }

  setMessage(message: string) {
    this.messageSubject.next(message);
  }
}
