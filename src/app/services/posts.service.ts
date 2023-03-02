import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Firestore, collectionData, collection, addDoc, doc, updateDoc,query,where,documentId, getDocs } from '@angular/fire/firestore';
import { ToastrService } from 'ngx-toastr';
import { Post } from '../models/post';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

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

  uploadImage(selectedImage:any,postData:Post, formStatus?:string, id?:any){
    console.log(selectedImage + " - " + postData + " - " + formStatus + " - " + id);
    const filePath = `postIMG/${Date.now()}`;
    const ref = this.storage.ref(filePath);
    const task = ref.put(selectedImage);
    task.then( (response) => {
      response.ref.getDownloadURL().then( val => {
        postData.postImgPath = val;
        console.log(postData);

        if(formStatus === "Add New"){
          console.log("Save data post services");

          this.saveData(postData);
        }
        if(formStatus == "Edit"){
          this.updateData(id, postData);
        }
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
        // console.log(val);
    })
    return  collectionData(collectionInstance);
  }

  loadOneData(id:any){
    const collectionInstance = collection(this.firestore, 'Post');
    let q = query(collectionInstance);

    if (id) {
      q = query(collectionInstance, where('id', '==', id));
    }
    return collectionData(q) as unknown as Observable<Post[]>;
  }



  async updateData(id: string, Post:Post) {
    const playersRef = collection(this.firestore, 'Post');
    let q = query(playersRef, where('id', '==', id));
    const querySnapshot = await getDocs(q);
    console.log(querySnapshot);
    querySnapshot.forEach((document) => {
      const docRef = doc(this.firestore, 'Post', document.id);
      updateDoc(docRef,
        {
          category: {category: Post.category.category, categoryId: Post.category.categoryId},
          title: Post.title,
          permalink: Post.permalink,
          excerpt: Post.excerpt,
          postImgPath: Post.postImgPath,
          content: Post.content,
          isFeatured:Post.isFeatured,
          views:Post.views,
          status:Post.status,
          createdAt:Post.createdAt
        }
        ).then(() => {
          this.toastr.success("Update is success");
          this.router.navigate([['/posts']]);

      });
    });
  }

}
