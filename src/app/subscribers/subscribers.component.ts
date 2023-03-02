import { Component,OnInit } from '@angular/core';
import { SubscibersService } from '../services/subscibers.service';
import { Observable } from 'rxjs';
@Component({
  selector: 'app-subscribers',
  templateUrl: './subscribers.component.html',
  styleUrls: ['./subscribers.component.css']
})
export class SubscribersComponent implements OnInit{

  allSub : Observable<any>;
  constructor(private subsciber:SubscibersService){}
  ngOnInit(): void {
      this.allSub = this.subsciber.loadData();
  }



}
