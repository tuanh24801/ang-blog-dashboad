import { Observable } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { CategoriesService } from '../services/categories.service';
import { Category } from '../models/category';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css']
})
export class CategoriesComponent implements OnInit {

  constructor(private categoriesService:CategoriesService) {}

  userData: Observable<any>;
  formCategory: string;
  formIdCategory: string;
  formStatus: string = "Add";

  ngOnInit(): void {
    this.userData = this.categoriesService.loadData();
  }

  onSubmit(formData:any){

    if(this.formStatus === "Edit"){
      this.categoriesService.updateData(this.formIdCategory,this.formCategory);
      this.formStatus = "Add";
      this.formCategory = "";
      this.formIdCategory = "";
      formData.reset();
      return;
    }

    this.categoriesService.saveData(formData.value);
    formData.reset();
  }

  onEdit(id:string,category:any){
    this.formIdCategory = id;
    this.formCategory = category;
    this.formStatus = "Edit";
  }

  onDelete(id:string,category:any){
    this.categoriesService.deleteData(id, category);
  }

}
