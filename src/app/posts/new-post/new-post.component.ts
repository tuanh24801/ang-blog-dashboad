import { PostsService } from './../../services/posts.service';
import { CategoriesService } from './../../services/categories.service';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { FormBuilder, FormControl, FormGroup, Validators,AbstractControl } from '@angular/forms';
import { Post } from '../../models/post';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { ActivatedRoute } from '@angular/router';

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

  postForm: FormGroup = new FormGroup({
    title: new FormControl(''),
    permalink: new FormControl(''),
    excerpt: new FormControl(''),
    category: new FormControl(''),
    postImg: new FormControl(''),
    content: new FormControl(''),
  });

  constructor(
    private categoriesService:CategoriesService,
    private formBuilder: FormBuilder,
    private postsService:PostsService,
    private route: ActivatedRoute
    ){


    this.route.queryParams.subscribe(value => {
      this.postsService.getPlayer(value);
    })

    this.postForm = this.formBuilder.group({
      title: ['', [Validators.required, Validators.minLength(10)]],
      permalink: ['', Validators.required],
      excerpt: ['',[Validators.required, Validators.minLength(50)]],
      category: ['',[Validators.required]],
      postImg: ['',[Validators.required]],
      content: ['',[Validators.required]]
    });
    this.postForm.controls['permalink'].disable();
  }

  get f(): { [key: string]: AbstractControl } {
    return this.postForm.controls;
  }

  ngOnInit() {
    this.categories = this.categoriesService.loadData();
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


  onSubmit(){
    this.postForm.controls['permalink'].enable();
    this.postForm.controls['permalink'].setValue(this.permalink);
    const permalink_ = this.postForm.value.permalink;
    this.postForm.controls['permalink'].disable();
    const category_ = this.postForm.value.category.split('-');
    const postData: Post = {
      id: Date.now().toString(),
      title: this.postForm.value.title,
      permalink: permalink_,
      excerpt: this.postForm.value.excerpt,
      category: {
        category: category_[0],
        categoryId: category_[1],
      },
      postImgPath: '',
      content: this.postForm.value.content,
      isFeatured: true,
      views: 0,
      status: "string",
      createdAt: new Date()
    };
    this.postsService.uploadImage(this.selectedImg,postData);
    this.postForm.reset();
    this.imgSrc = '../../../assets/placeholder-image.jpg';
  }

}
