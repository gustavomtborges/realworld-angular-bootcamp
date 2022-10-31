import { HttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { delay, of, switchMap, take, throwError, toArray } from 'rxjs';

import { LoginService } from './login.service';

describe('LoginService', () => {
  let service: LoginService;
  let httpClientMock = { post: jest.fn() };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        LoginService,
        { provide: HttpClient, useValue: httpClientMock },
      ],
    });
    service = TestBed.inject(LoginService);
  });

  afterEach(() => {
    httpClientMock.post.mockReset();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('deve iniciar o estado com os valores padrao', (done) => {
    service.state$.subscribe((s) => {
      expect(s.status).toEqual('nao enviado');
      expect(s.isLoading).toEqual(false);
      done();
    });
  });

  it('deve retornar status sucesso ao realizar login com sucesso', (done) => {
    httpClientMock.post.mockReturnValue(of('login sucesso').pipe(delay(1)));

    service.state$.pipe(take(3), toArray()).subscribe((s) => {
      expect(s[2].status).toEqual('success');
      expect(s[2].isLoading).toEqual(false);
      done();
    });

    service.submitForm({ email: 'oi', password: 'test' });
  });

  it('deve retornar status erro ao realizar login com erro', (done) => {
    httpClientMock.post.mockReturnValue(
      of('').pipe(
        delay(1),
        switchMap(() => throwError(() => new Error('erro stub')))
      )
    );

    service.state$.pipe(take(3), toArray()).subscribe((s) => {
      expect(s[2].status).toEqual('error');
      expect(s[2].isLoading).toEqual(false);
      done();
    });

    service.submitForm({ email: 'oi', password: 'test' });
  });
});
