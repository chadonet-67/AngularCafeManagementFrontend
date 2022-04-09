import { tokenReference } from '@angular/compiler';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import jwt_decode from 'jwt-decode';
import { AuthService } from './auth.service';
import { GlobalConstant } from './shared/global-constants';
import { SnackbarService } from './snackbar.service';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class RouteGuardService {

  constructor(private router: Router,
    private snackBarService: SnackbarService,
    private userService: UserService,
    private auth : AuthService) { }

    canActivate(route : ActivatedRouteSnapshot):boolean{
      let expectedRoleArray = route.data;
         expectedRoleArray = expectedRoleArray.expectedRole;

         const token:any = localStorage.getItem('token');
         var tokenPlayload:any ;
         try{
           tokenPlayload = jwt_decode(token)
         }catch
         {
           localStorage.clear();
           this.router.navigate(['/'])
         }

         let checkRole = false;
         for(let i = 0; i<expectedRoleArray.length;i++){
          if(expectedRoleArray[i] == tokenPlayload.role){
            checkRole = true
         }
         }
  

       if(tokenPlayload.role == 'user' || tokenPlayload=='admin'){
         if(this.auth.isAuthencated() && checkRole){
           return true
         }
         this.snackBarService.openSnackBar(GlobalConstant.unauthorization,GlobalConstant.error)
         this.router.navigate(['/cafe/dashboard']);
         return false;
       }else
       {
         this.router.navigate(['/'])
         localStorage.clear()
         return false;
       }
    }
}
