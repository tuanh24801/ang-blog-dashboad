import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  loggedIn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  isLoggedInGuard:boolean = false;
  constructor(public afAuth: AngularFireAuth,private toastrService:ToastrService, private router:Router) { }

  SignIn(email: string, password: string) {
    return this.afAuth
      .signInWithEmailAndPassword(email, password)
      .then((result) => {
        this.toastrService.success("Login success")
        this.loadUser();
        this.loggedIn.next(true);
        this.isLoggedInGuard = true;
        this.router.navigate(['/'])
      })
      .catch((error) => {
        this.toastrService.error(error.message);

      });
  }

  loadUser(){
    this.afAuth.authState.subscribe(user => {
      localStorage.setItem('user', JSON.stringify(user))
      console.log(JSON.parse(JSON.stringify(user)));
    })
  }

  logOut(){
    this.afAuth.signOut().then( () => {
      this.toastrService.success("U are Logout");
      localStorage.removeItem('user');
      this.loggedIn.next(false);
      this.isLoggedInGuard = false;

      this.router.navigate(['/login']);
    })
  }

  isLoggedIn(){
    return this.loggedIn.asObservable();
  }

}
