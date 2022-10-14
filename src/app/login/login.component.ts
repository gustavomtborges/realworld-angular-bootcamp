import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { LoginService } from './login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  formGroup = new FormGroup({
    inputName: new FormControl('', Validators.required),
    inputPasswd: new FormControl('', Validators.required),
  });

  loginSubmittedResponse$ = this.loginService.loginSubmittedResponse$;
  isLoading$ = this.loginService.isLoading$;

  onSubmit() {
    const { inputName, inputPasswd } = this.formGroup.value;
    this.loginService.dispatch({
      email: inputName!,
      password: inputPasswd!,
    });
  }

  constructor(private loginService: LoginService) {}
}
