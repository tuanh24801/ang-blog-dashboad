import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Observable } from "rxjs";
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit{

  userEmail :string;
  user_ : any;
  isLoggedIn$ : Observable<boolean>;
  constructor(private auth:AuthService){}

  ngOnInit(): void {
    this.user_ = localStorage.getItem('user');
    this.userEmail = JSON.parse(this.user_ ).email;
    this.isLoggedIn$ = this.auth.isLoggedIn();
    this.isLoggedIn$.subscribe( (val) => {
      console.log(val);
    })


  }

  onLogout(){
    this.auth.logOut();
  }


}
