import { Injectable, OnInit } from '@angular/core';
import { Firestore, collectionData, collection, addDoc, doc, updateDoc, deleteDoc } from '@angular/fire/firestore';
import { Category } from '../models/category';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class CategoriesService implements OnInit{

  constructor(private firestore: Firestore, private toastr: ToastrService) { }

  ngOnInit(): void {

  }

  saveData(categoryData:Category){
    const collectionInstance = collection(this.firestore, 'Category');
    addDoc(collectionInstance, categoryData)
    .then( (refData) => {
      this.toastr.success("Dữ liệu được thêm thành công ... !");
      console.log(refData);
    })
    .catch( (err) => {
      console.log(err);
    })
  }



  loadData(){
    const collectionInstance = collection(this.firestore, 'Category');
    collectionData(collectionInstance, {idField :'id'}).subscribe(val => {
        // console.log(val);
    })
    return  collectionData(collectionInstance, {idField :'id'});
  }


  updateData(id_: string, category_:string){
    const docInstance = doc(this.firestore, 'Category', id_);
    updateDoc(docInstance, {category: category_})
    .then( () => {
      this.toastr.success(category_ + " : Update success !!");
      console.log(category_ + " : Update success !!");
    })
    .catch( (err) => {
      console.log(err);

    })
  }

  deleteData(id_: string, category_?:string){
    const docInstance = doc(this.firestore, 'Category', id_);
    deleteDoc(docInstance)
    .then( () => {
      this.toastr.error(category_ + " : Deleted !!");
    })
    .catch( (err) => {
      console.log(err);
    })
  }



}
