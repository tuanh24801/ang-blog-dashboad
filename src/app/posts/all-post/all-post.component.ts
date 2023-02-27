import { Observable } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { PostsService } from 'src/app/services/posts.service';
@Component({
  selector: 'app-all-post',
  templateUrl: './all-post.component.html',
  styleUrls: ['./all-post.component.css']
})
export class AllPostComponent implements OnInit{

  // we have 2 ways to export to front array or observable
  allPost : Array<any>;
  allPost_ : Observable<any>;

  constructor(private postsService: PostsService){}

  ngOnInit(): void {
    this.postsService.loadData().subscribe( (val) =>{
      this.allPost = (val);
    });

    this.allPost_ = this.postsService.loadData();


  }
}
