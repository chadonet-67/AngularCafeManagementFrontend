import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ForgotPasswordComponent } from '../forgot-password/forgot-password.component';
import { LoginComponent } from '../login/login.component';
import { SignupComponent } from '../signup/signup.component';
import { UserService } from '../user.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(private dialog: MatDialog,
    private router: Router,
    private userService: UserService) { }

  ngOnInit(): void {
    if (localStorage.getItem('token') != null){
      this.userService.checkToken().subscribe((response:any) => {
        this.router.navigate(['/cafe/dashboard'])
      }, (error: any) => {
        console.log(error)
      })
    }
  }
  signupAction() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = "560px";
    // dialogConfig.height ="500px"

    this.dialog.open(SignupComponent, dialogConfig)
  }
  forgotPassword() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = "560px";
    this.dialog.open(ForgotPasswordComponent, dialogConfig)
  }
  loginAction() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = "560px",

      this.dialog.open(LoginComponent, dialogConfig)
  }
}
