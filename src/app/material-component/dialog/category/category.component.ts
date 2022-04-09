import { Component, EventEmitter, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CategoryService } from 'src/app/category.service';
import { GlobalConstant } from 'src/app/shared/global-constants';
import { SnackbarService } from 'src/app/snackbar.service';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit {

  onAddCategory = new EventEmitter();
  onEditCategory = new EventEmitter();
  formGroup : any = FormGroup
  dialogAction : any ="Add";
  action:any="Add";
  responseMessage :any;

  constructor(@Inject(MAT_DIALOG_DATA) public dialogData:any,
  private formBuilder:FormBuilder,
  private dialogRef:MatDialogRef<CategoryComponent>,
  private snackBarService:SnackbarService,
  private categoryService :CategoryService) { }

  ngOnInit(): void {

    this.formGroup = this.formBuilder.group({
      name : [null,[Validators.required]]
    })

    if(this.dialogData.action === 'Edit'){
      this.dialogAction ="Edit";
      this.action = "Update";
      this.formGroup.patchValue(this.dialogData.data)
    }
  }

  handleSubmit(){
    if(this.dialogAction==="Edit"){
       this.edit()
    }else
    {
     this.add()
    }
  }

  edit(){
    let formData = this.formGroup.value;
    let data = {
      id : this.dialogData.data.id,
      name: formData.name
    }
    this.categoryService.update(data).subscribe((response:any)=>{
      this.dialogRef.close();
      this.onEditCategory.emit()
      this.responseMessage = response?.message;
      this.snackBarService.openSnackBar(this.responseMessage,"success")
    },(error)=>{
     this.dialogRef.close();
      console.log(error)
      if(error.error?.message){
        this.responseMessage = error.error?.message
      }else
      {
        this.responseMessage = GlobalConstant.generError
      }
      this.snackBarService.openSnackBar(this.responseMessage,GlobalConstant.error)
    })
  }
  add(){
   let formData = this.formGroup.value;
   let data = {
     name: formData.name
   }
   this.categoryService.add(data).subscribe((response:any)=>{
     this.dialogRef.close();
     this.onAddCategory.emit()
     this.responseMessage = response?.message;
     this.snackBarService.openSnackBar(this.responseMessage,"success")
   },(error)=>{
    this.dialogRef.close();
     console.log(error)
     if(error.error?.message){
       this.responseMessage = error.error?.message
     }else
     {
       this.responseMessage = GlobalConstant.generError
     }
     this.snackBarService.openSnackBar(this.responseMessage,GlobalConstant.error)
   })
  }
}
