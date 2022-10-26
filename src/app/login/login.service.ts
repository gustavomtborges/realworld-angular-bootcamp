import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, BehaviorSubject, distinctUntilChanged } from 'rxjs';

type Form = {
  email: string;
  password: string;
};
type State = {
  isLoading: boolean;
  status: 'error' | 'success' | 'nao enviado';
};

let _state: State = {
  isLoading: false,
  status: 'nao enviado',
};

@Injectable()
export class LoginService {
  private readonly API_URL = 'https://api.realworld.io/api';
  constructor(private httpClient: HttpClient) {}

  private store = new BehaviorSubject<State>(_state);
  public state$ = this.store.asObservable();

  public status$ = this.state$.pipe(
    map((s) => s.status),
    distinctUntilChanged()
  );

  public isLoading$ = this.state$.pipe(
    map((s) => s.isLoading),
    distinctUntilChanged()
  );

  public submitForm(form: Form): void {
    const newState = this.reducer(
      { type: 'login request', payload: form },
      _state
    );
    this.setState(newState);
  }

  private sideEffect(form: Form): void {
    this.httpClient
      .post(`${this.API_URL}/users/login`, {
        user: { email: form.email, password: form.password },
      })
      .subscribe({
        next: () => {
          const newState = this.reducer({ type: 'login sucesso' }, _state);
          this.setState(newState);
        },
        error: () => {
          const newState = this.reducer({ type: 'login erro' }, _state);
          this.setState(newState);
        },
      });
  }

  private reducer(
    action: { type: string; payload?: Form },
    state: State
  ): State {
    switch (action.type) {
      case 'login request':
        this.sideEffect(action.payload!);
        return { ...state, isLoading: true };
      case 'login sucesso':
        return { ...state, isLoading: false, status: 'success' };
      case 'login erro':
        return { ...state, isLoading: false, status: 'error' };

      default:
        return state;
    }
  }

  private setState(newState: State): void {
    this.store.next(newState);
  }
}
