import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { LoginService } from './login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [LoginService],
})
export class LoginComponent {
  formGroup = new FormGroup({
    inputName: new FormControl('', Validators.required),
    inputPasswd: new FormControl('', Validators.required),
  });

  vm$ = this.loginService.state$;

  onSubmit() {
    const { inputName, inputPasswd } = this.formGroup.value;
    this.loginService.submitForm({
      email: inputName!,
      password: inputPasswd!,
    });
  }

  constructor(private loginService: LoginService) {}
}
