import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { environment } from 'src/environments/environment';
import { GlobalConstant } from '../shared/global-constants';
import { SnackbarService } from '../snackbar.service';
import { UserService } from '../user.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {

  url = environment.apiUrl;
  formGroup:any = FormGroup;
  responseMessage : any;

  constructor(
                      private userService : UserService,
                      private formBuilder : FormBuilder,
                      private ngxService : NgxUiLoaderService,
                      private dialogRef : MatDialogRef<ForgotPasswordComponent>,
                      private snackBarService : SnackbarService  ) { }

  ngOnInit(): void {
    this.formGroup = this.formBuilder.group({
      email : [null,[Validators.required,Validators.pattern(GlobalConstant.emailRegex)]]
    })
  }

  handleSubmit()
  {
    this.ngxService.start();
    var formData = this.formGroup.value
    var data = {
      email : formData.email
    }
    this.userService.forgotPassoword(data).subscribe((response:any)=>{
         this.ngxService.stop();
         this.responseMessage = response?.message;
         this.dialogRef.close();
         this.snackBarService.openSnackBar(this.responseMessage,"");
    },(error)=>{
        this.ngxService.stop();
        if(error.error?.message)
        {
          this.responseMessage = error.error?.message;
        }else
        {
          this.responseMessage = GlobalConstant.generError;
        }
        this.snackBarService.openSnackBar(this.responseMessage,GlobalConstant.error)
    })
  }
}
