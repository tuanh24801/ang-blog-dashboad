import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Firestore, collectionData, collection, addDoc, doc, updateDoc,FieldPath, deleteDoc,query,where,documentId } from '@angular/fire/firestore';
import { ToastrService } from 'ngx-toastr';
import { Post } from '../models/post';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { JsonPipe } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class PostsService {

  constructor(
    private storage: AngularFireStorage,
    private firestore: Firestore,
    private toastr: ToastrService,
    private router: Router
    ) { }

  uploadImage(selectedImage:any,postData:Post){
    const filePath = `postIMG/${Date.now()}`;
    const ref = this.storage.ref(filePath);
    const task = ref.put(selectedImage);
    task.then( (response) => {
      response.ref.getDownloadURL().then( val => {
        postData.postImgPath = val;
        this.saveData(postData);
      });
    });
  }

  saveData(postData:Post){
    const collectionInstance = collection(this.firestore, 'Post');
    addDoc(collectionInstance, postData)
    .then( (refData) => {
      this.toastr.success("Dữ liệu post được thêm thành công ... !");
      this.router.navigate([['/posts']]);
    })
    .catch( (err) => {
      console.log(err);
    })
  }

  loadData(){
    const collectionInstance = collection(this.firestore, 'Post');
    collectionData(collectionInstance, {idField :'id'}).subscribe(val => {
        console.log(val);
    })
    return  collectionData(collectionInstance, {idField :'id'});
  }

  loadOneData(id:any){
    const collectionInstance = collection(this.firestore, 'Post');
    collectionData(collectionInstance, {idField :'id'}).subscribe(val => {
        console.log(val);
    })
    return  collectionData(collectionInstance, {idField :'id'});
  }

  getPlayer(filter :any) {
    const playersRef = collection(this.firestore, 'Post');
    let q = query(playersRef);
    if (filter) {
      q = query(playersRef, where('id', '==', '1677527901331'));
      console.log( JSON.stringify(documentId()));

    }
    collectionData(q , {idField :'id'}).subscribe( (val) => {
      console.log(val);

    })

    return collectionData(q) as unknown as Observable<Post[]>;
  }

}
