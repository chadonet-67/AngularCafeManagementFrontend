import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { GlobalConstant } from 'src/app/shared/global-constants';
import { SnackbarService } from 'src/app/snackbar.service';
import { UserService } from 'src/app/user.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {

  changePassworForm: any = FormGroup;
  responseMessage: any;
  constructor(private formBuilder: FormBuilder,
    private userService: UserService,
    private ngxservice: NgxUiLoaderService,
    private snackBarService: SnackbarService,
    private dialogRef: MatDialogRef<ChangePasswordComponent>) { }

  ngOnInit(): void {
    this.changePassworForm = this.formBuilder.group({
      oldPassword: [null, Validators.required],
      newPassword: [null, Validators.required],
      confirmPassword: [null, Validators.required]
    })
  }

  validateSubmit() {
    if (this.changePassworForm.controls['newPassword'].value != this.changePassworForm.controls['confirmPassword'].value) {
      return true;
    } else {
      return false;
    }
  }
  handleChangePasswordSubmit() {
    this.ngxservice.start();
    var formData = this.changePassworForm.value;
    var data = {
      oldPassword: formData.oldPassword,
      newPassword: formData.newPassword,
      confirmPassword: formData.confirmPassword
    }
    this.userService.changePassword(data).subscribe((response: any) => {
      this.ngxservice.stop();
      this.responseMessage = response?.message;
      this.dialogRef.close();
      this.snackBarService.openSnackBar(this.responseMessage, "success");
    }, (error) => {
      console.log(error);
      this.ngxservice.stop();
      if (error.error?.message) {
        this.responseMessage = error.error?.message
      } else {
        this.responseMessage = GlobalConstant.generError
      }
      this.snackBarService.openSnackBar(this.responseMessage, GlobalConstant.error)
    })
  }
}
