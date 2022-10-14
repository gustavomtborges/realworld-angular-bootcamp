import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  catchError,
  map,
  mergeMap,
  Observable,
  of,
  tap,
  Subject,
  finalize,
} from 'rxjs';

export type state = 'error' | 'success' | '';
export type payload = { email: string; password: string };

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  private readonly API_URL = 'https://api.realworld.io/api';
  constructor(private httpClient: HttpClient) {}

  // action stream / producer
  private loginSubmittedSubject = new Subject<payload>();
  loginSubmitted$ = this.loginSubmittedSubject.asObservable();
  // side efect / producer
  private loadingSubject = new Subject<boolean>();
  loading$ = this.loadingSubject.asObservable();

  // data stream estado do login
  isLoading$ = this.loading$.pipe(map((t) => (t ? 'aguarde...' : '')));

  // data stream estado da resposta
  loginSubmittedResponse$: Observable<state> = this.loginSubmitted$.pipe(
    tap(() => this.loadingSubject.next(true)),
    mergeMap((payload) =>
      this.httpClient
        .post(`${this.API_URL}/users/login`, { user: payload })
        .pipe(
          map(() => 'success' as state),
          catchError(() => of('error' as state)),
          finalize(() => this.loadingSubject.next(false))
        )
    )
  );

  dispatch(payload: payload): void {
    this.loginSubmittedSubject.next(payload);
  }
}
