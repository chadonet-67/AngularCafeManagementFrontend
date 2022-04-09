import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ProductService } from 'src/app/product.service';
import { GlobalConstant } from 'src/app/shared/global-constants';
import { SnackbarService } from 'src/app/snackbar.service';
import { ConfirmationComponent } from '../dialog/confirmation/confirmation.component';
import { ProductComponent } from '../dialog/product/product.component';

@Component({
  selector: 'app-manage-product',
  templateUrl: './manage-product.component.html',
  styleUrls: ['./manage-product.component.scss']
})
export class ManageProductComponent implements OnInit {

  displayedColumns: string[] = ['name', 'categoryName', 'description', 'price', 'edit'];
  dataSource: any;
  responseMessage: any;

  constructor(private productService: ProductService,
    private ngxSerice: NgxUiLoaderService,
    private router: Router,
    private snackBarService: SnackbarService,
    private dialog: MatDialog) { }

  ngOnInit(): void {
    this.ngxSerice.start();
    this.tableData()
  }

  tableData() {
    this.productService.getProduct().subscribe((response: any) => {
      this.ngxSerice.stop();
      this.dataSource = new MatTableDataSource(response)
      this.responseMessage = response?.message
    }, (error: any) => {
      this.ngxSerice.stop();
      console.log(error)
      if (error.error?.message) {
        this.responseMessage = error.error?.message
      } else {
        this.responseMessage = GlobalConstant.generError
      }

      this.snackBarService.openSnackBar(this.responseMessage, GlobalConstant.error)
    })
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase()
  }
  handleAddAction(){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      action : "Add"
    }
    dialogConfig.width = "850px";
    const dialogRef  =   this.dialog.open(ProductComponent,dialogConfig);
    this.router.events.subscribe(()=>{
       dialogRef.close();
    });

    const sub = dialogRef.componentInstance.onAddProduct.subscribe((response:any)=>{
      this.tableData()
      console.log(response)
    })
  }

  handleEditAction(values:any){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      action : "Edit",
      data : values
    }
    dialogConfig.width = "850px";
    const dialogRef  =   this.dialog.open(ProductComponent,dialogConfig);
    this.router.events.subscribe(()=>{
       dialogRef.close();
    });

    const sub = dialogRef.componentInstance.onEditProduct.subscribe(
      (response:any)=>{
      this.tableData()
      console.log(response)
    })
  }

  handleDeleteAction(values:any){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      message : 'delete '+values.name+' product'
    }
    const dialogRef = this.dialog.open(ConfirmationComponent,dialogConfig);
    this.router.events.subscribe(()=>{
      dialogRef.close()
    });
    const sub = dialogRef.componentInstance.onEmitStatusChange.subscribe((response)=>{
      this.ngxSerice.start();
      this.deleteProduct(values.id);
      dialogRef.close()
    })
  }
  deleteProduct(id : any){
    this.productService.delete(id).subscribe((response:any)=>{
      this.ngxSerice.stop();
      this.tableData();
      this.responseMessage = response.message;
      this.snackBarService.openSnackBar(this.responseMessage,"Product delete")
    },(error:any)=>{
      this.ngxSerice.stop();
      console.log(error)
      if (error.error?.message) {
        this.responseMessage = error.error?.message
      } else {
        this.responseMessage = GlobalConstant.generError
      }

      this.snackBarService.openSnackBar(this.responseMessage, GlobalConstant.error)
    })
  }

  onChange(status:any,id:any){
    var data ={
       status :status.toString(),
       id:id
    }
    this.productService.updateStatus(data).subscribe((response:any)=>{
      this.ngxSerice.stop();
      this.responseMessage = response?.message;
      this.snackBarService.openSnackBar(this.responseMessage,"success")
    },(error:any)=>{
      this.ngxSerice.stop();
      console.log(error)
      if (error.error?.message) {
        this.responseMessage = error.error?.message
      } else {
        this.responseMessage = GlobalConstant.generError
      }

      this.snackBarService.openSnackBar(this.responseMessage, GlobalConstant.error)
    })
  }
}
