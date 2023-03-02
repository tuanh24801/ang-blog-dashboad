import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Firestore, collectionData, collection } from '@angular/fire/firestore';
@Injectable({
  providedIn: 'root'
})
export class SubscibersService {

  constructor(
    private storage: AngularFireStorage,
    private firestore: Firestore,
    ) { }

    loadData(){
      const collectionInstance = collection(this.firestore, 'Subscribers');
      collectionData(collectionInstance, {idField :'id'}).subscribe(val => {
          // console.log(val);
      })
      return  collectionData(collectionInstance);
    }
  }
