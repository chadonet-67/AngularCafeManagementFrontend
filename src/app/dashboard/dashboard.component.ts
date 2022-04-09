import { Component, AfterViewInit } from '@angular/core';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { DashboardService } from '../dashboard.service';
import { GlobalConstant } from '../shared/global-constants';
import { SnackbarService } from '../snackbar.service';

@Component({
	selector: 'app-dashboard',
	templateUrl: './dashboard.component.html',
	styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements AfterViewInit {
	responseMessage :any;
	data:any;

	ngAfterViewInit() { }

	constructor(private dasboardService : DashboardService,
		               private snacbarService : SnackbarService,
					   private ngxService : NgxUiLoaderService) {
						   this.ngxService.start()
						   this.dashBoardData()
	}

	dashBoardData(){
              this.dasboardService.getDetails().subscribe((response:any)=>{
				  this.ngxService.stop();
				  this.data = response;
			  },(error:any)=>{
                 this.ngxService.stop()
				 console.log(error)
				 if(error.error?.message){
					 this.responseMessage = error.error?.message
				 }else{
                       this.responseMessage = GlobalConstant.generError;
				 }
				 this.snacbarService.openSnackBar(this.responseMessage,GlobalConstant.error)
			  })
	}
}
