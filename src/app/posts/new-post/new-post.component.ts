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
  post : Array<Post>;
  formStatus: string = "Add New";
  postIdParam:string;

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

    //get params (id)
    this.route.queryParams.subscribe(value => {
      if(value['id']){
        this.postIdParam = value['id'];
        this.postsService.loadOneData(value['id']).subscribe( (post)  => {
          this.post = post;

          this.postForm = this.formBuilder.group({
            title: [this.post[0].title, [Validators.required, Validators.minLength(10)]],
            permalink: [this.post[0].permalink],
            excerpt: [this.post[0].excerpt,[Validators.required, Validators.minLength(50)]],
            category: [`${this.post[0].category.category}-${this.post[0].category.categoryId}`,[Validators.required]],
            postImg: ['',[Validators.required]],
            content: [this.post[0].content,[Validators.required]]
          });
          this.imgSrc = this.post[0].postImgPath;
          this.formStatus = "Edit";
        });
      }else{
        console.log("NO param");

        this.postForm = this.formBuilder.group({
          title: ['', [Validators.required, Validators.minLength(10)]],
          permalink: [''],
          excerpt: ['',[Validators.required, Validators.minLength(50)]],
          category: ['',[Validators.required]],
          postImg: ['',[Validators.required]],
          content: ['',[Validators.required]]
        });
      }
    })
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

  permalinkChanged(title:string):string{
    return  title.replace(/\s/g,'-');
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
    const permalink_ = this.permalinkChanged(this.postForm.value.title);
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
    if(this.formStatus == "Edit"){
      this.postsService.uploadImage(this.selectedImg, postData, this.formStatus, this.postIdParam);
    }

    if(this.formStatus == "Add New"){
      this.postsService.uploadImage(this.selectedImg,postData, this.formStatus);
    }
    this.postForm.reset();
    this.imgSrc = '../../../assets/placeholder-image.jpg';
  }

}
