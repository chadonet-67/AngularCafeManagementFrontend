import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { GlobalConstant } from '../shared/global-constants';
import { SnackbarService } from '../snackbar.service';
import { UserService } from '../user.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

  signupForm : any = FormGroup;
reponseMessage :any;

  constructor(private formBuilder : FormBuilder,
                      private router : Router,
                      private snackBarService : SnackbarService,
                      private userService : UserService,
                      private dialogRef : MatDialogRef<SignupComponent>,
                      private ngxService : NgxUiLoaderService      ) { }

  ngOnInit(): void {
    this.signupForm = this.formBuilder.group({
      name : [null,[Validators.required,Validators.pattern(GlobalConstant.nameRegex)]],
      email : [null,[Validators.required,Validators.pattern(GlobalConstant.emailRegex)]],
      contactNumber : [null,[Validators.required,Validators.pattern(GlobalConstant.contactNumberRegex)]],
      password : [null,Validators.required]
    })
  }

  handleSubmit(){
    this.ngxService.start();
    var formData = this.signupForm.value;
    var data = {
      name : formData.name,
      email : formData.email,
      contactNumber : formData.contactNumber,
      password : formData.password
    }

    this.userService.signup(data).subscribe((response:any)=>{
      this.ngxService.stop();
      this.dialogRef.close();
      this.reponseMessage = response?.message;
      this.snackBarService.openSnackBar(this.reponseMessage,"");
      this.router.navigate(['/'])
    },(error)=>{
      this.ngxService.stop();
      if(error.error?.message){
        this.reponseMessage = error.error?.message;
      }else
      {
        this.reponseMessage = GlobalConstant.generError
      }
      this.snackBarService.openSnackBar(this.reponseMessage,GlobalConstant.error)
    }
    )
  }
}
