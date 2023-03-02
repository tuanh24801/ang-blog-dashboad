import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Firestore, collectionData, collection, addDoc, doc, updateDoc,query,where,documentId, getDocs, deleteDoc } from '@angular/fire/firestore';
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
        if(formStatus === "Add New"){
          console.log("Image saved");
          this.saveData(postData);
        }
        if(formStatus === "Edit"){
          this.updateData(id, postData);
          console.log("Image saved Edit");
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

  async updatePostFeatured(id: string, active:boolean) {
    const playersRef = collection(this.firestore, 'Post');
    let q = query(playersRef, where('id', '==', id));
    const querySnapshot = await getDocs(q);
    console.log(querySnapshot);
    querySnapshot.forEach((document) => {
      const docRef = doc(this.firestore, 'Post', document.id);
      updateDoc(docRef,
        {
          isFeatured:active,
        }
        ).then(() => {
          if(active){
            this.toastr.success("Post is active featured");
          }else{
            this.toastr.warning("Post is remove")
          }


      });
    });
  }



  //delete with file url
  deteteImange(folderRef:any,id:string){

    this.storage.storage.refFromURL(folderRef).delete().then( () => {
      this.deleteData(id);
    });

  }

  async deleteData(id: string) {
    const playersRef = collection(this.firestore, 'Post');
    let q = query(playersRef, where('id', '==', id));
    const querySnapshot = await getDocs(q);

    querySnapshot.forEach(async (document) => {
      const docRef = doc(this.firestore, 'Post', document.id);
      deleteDoc(docRef).then( () => {
        this.toastr.success("Post Deleted");
        console.log("post is deleted");

      });
    });
  }

  //remove with id file
  removeRequestFiles(requestId: string) {
    const folderPath = `requests/${requestId}`;
    const folderRef = this.storage.ref(folderPath);

    folderRef.listAll().subscribe((val) => {
      val.items.forEach((ref) => ref.delete());
    });
  }

}
