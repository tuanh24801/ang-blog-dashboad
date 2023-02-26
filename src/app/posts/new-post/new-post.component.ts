import { CategoriesService } from './../../services/categories.service';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-new-post',
  templateUrl: './new-post.component.html',
  styleUrls: ['./new-post.component.css']
})
export class NewPostComponent implements OnInit {

  permalink:string;
  imgSrc:any = '../../../assets/placeholder-image.jpg';
  selectedImg:any;
  categories: Observable<any>;

  postForm: FormGroup;

  constructor(private categoriesService:CategoriesService, private fb: FormBuilder){
    // bỏ vì cũ quá rồi, Validate Angular 15
    this.postForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(10)]],
      permalink: ['', [Validators.required] ],
      excerpt: ['',[Validators.required, Validators.minLength(50)]],
      category: ['',[Validators.required]],
      postImg: ['',[Validators.required]],
      content: ['',[Validators.required, Validators.minLength(10)]]
    });
  }


  ngOnInit() {
    this.categories = this.categoriesService.loadData();
  }
//bỏ
  get fc(){
    return this.postForm.controls;
  }

  onTitleChange($event: any):void {
    const title = $event.target.value;
    let permalink =  title.replace(/\s/g,'-');
    this.permalink = permalink;
  }

  showPreview($event:any):any{
    const reader = new FileReader();
    reader.onload = (e:any) => {
      this.imgSrc = e.target.result;
    }
    reader.readAsDataURL($event.target.files[0]);
    this.selectedImg = $event.target.files[0];
  }

}
