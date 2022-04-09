import { Component, EventEmitter, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ProductService } from 'src/app/product.service';
import { GlobalConstant } from 'src/app/shared/global-constants';
import { SnackbarService } from 'src/app/snackbar.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit {

  onAddProduct = new EventEmitter();
  onEditProduct = new EventEmitter();
  onDeleteProduct = new EventEmitter()
  responseMessage :any ;
  dialogAction : any ="Add";
  action:any="Add";
  productForm:any = FormGroup
  category :any = []
  constructor(private productService:ProductService,
    private snackBarService : SnackbarService,
    private dialogRef : MatDialogRef<ProductComponent>,
    @Inject(MAT_DIALOG_DATA ) public dialogData :any,
    private formBuilder :FormBuilder) { }

  ngOnInit(): void {
    this.productForm = this.formBuilder.group({
      name : [null,[Validators.required]],
      categoryName : [null,[Validators.required]],
      description : [null,[Validators.required]],
      price : [null,[Validators.required]]
    })
    if(this.dialogData.action === 'Edit'){
      this.dialogAction = "Edit";
      this.action="Update";
      this.productForm.patchValue(this.dialogData.data)
    }
    this.getProduct()
  }

  handleSubmit(){
    if(this.dialogAction==="Edit"){
       this.edit()
    }else if(this.dialogAction.action === "Delete"){
     this.delete()
    }
    else
    {
     this.add()
    }
    
  }

  add(){
    var formData = this.productForm.value;
    var data ={
      name : formData.name,
      categoryId : formData.categoryId,
      description : formData.description,
      price : formData.price
    }

    this.productService.add(data).subscribe((response:any)=>{
      this.dialogRef.close();
      this.onAddProduct.emit();
      this.responseMessage = response.message;
      this.snackBarService.openSnackBar(this.responseMessage,"Product Add Success")
    },(error:any)=>{
      this.dialogRef.close()
      console.log(error)
      if(error.error?.message){
        this.responseMessage = error.error?.message
      }else{
        this.responseMessage = GlobalConstant.generError
      }
      this.snackBarService.openSnackBar(this.responseMessage,GlobalConstant.error)
    })
  }

  edit(){
    var formData = this.productForm.value;
    var data ={
      id : this.dialogData.data.id,
      name : formData.name,
      categoryId : formData.categoryId,
      description : formData.description,
      price : formData.price
    }

    this.productService.update(data).subscribe((response:any)=>{
      this.dialogRef.close();
      this.onEditProduct.emit();
      this.responseMessage = response.message;
      this.snackBarService.openSnackBar(this.responseMessage,"Product Add Success")
    },(error:any)=>{
      this.dialogRef.close()
      console.log(error)
      if(error.error?.message){
        this.responseMessage = error.error?.message
      }else{
        this.responseMessage = GlobalConstant.generError
      }
      this.snackBarService.openSnackBar(this.responseMessage,GlobalConstant.error)
    })
  }

  delete(){}

  getProduct(){
    this.productService.getProduct().subscribe((response:any)=>{
    
      this.category = response;

    },(error:any)=>{
    
      console.log(error)
      if(error.error?.message){
        this.responseMessage = error.error?.message
      }else{
        this.responseMessage = GlobalConstant.generError
      }
      this.snackBarService.openSnackBar(this.responseMessage,GlobalConstant.error)
    })
  }
}
