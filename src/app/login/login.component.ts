import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { GlobalConstant } from '../shared/global-constants';
import { SnackbarService } from '../snackbar.service';
import { UserService } from '../user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  formLogin: any = FormGroup;
  responseMessage: any;
  constructor(private formBuilder: FormBuilder,
    private userService: UserService,
    public dialogRef: MatDialogRef<LoginComponent>,
    private snackBarService: SnackbarService,
    private ngxService: NgxUiLoaderService,
    private router: Router) { }

  ngOnInit(): void {
    this.formLogin = this.formBuilder.group({
      email: [null, [Validators.required, Validators.pattern(GlobalConstant.emailRegex)]],
      password: [null, Validators.required]
    })
  }

  loginSubmit() {
    this.ngxService.start();
    var formData = this.formLogin.value;
    var data = {
      email: formData.email,
      password: formData.password
    }
    this.userService.login(data).subscribe((response: any) => {
      this.ngxService.stop();
      // this.responseMessage = response?.message;
      this.dialogRef.close();
      localStorage.setItem('token', response.token)
      this.router.navigate(['/cafe/dashboard'])
      this.snackBarService.openSnackBar(this.responseMessage, "login success")
    }, (error) => {
      this.ngxService.stop();
      if (error.error?.message) {
        this.responseMessage = error.error?.message
      } else {
        this.responseMessage = GlobalConstant.generError
      }
      this.snackBarService.openSnackBar(this.responseMessage, GlobalConstant.error)
    })
  }
}
