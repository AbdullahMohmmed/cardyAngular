import { Injectable } from '@angular/core';

import {
  getFirestore,
  getDocs,
  collectionChanges,
  collection,
  doc,
  getDoc,
  setDoc,
  Query,
  query,
} from '@angular/fire/firestore';
import { logEvent, analyticInstance$ } from '@angular/fire/analytics';
import {
  AngularFirestoreCollection,
  AngularFirestoreDocument,
  AngularFirestore,
  DocumentChangeAction,
  DocumentSnapshotDoesNotExist,
  Action,
  DocumentSnapshotExists,
  QueryFn,
} from '@angular/fire/compat/firestore';
import * as firebase from 'firebase/compat/app';
import {
  Observable,
  map,
  take,
  tap,
  expand,
  takeWhile,
  mergeMap,
  from,
  first,
} from 'rxjs';
import { LoggerService } from './logger.service';
type CollectionPredicate<T> = string | AngularFirestoreCollection<T>;
type DocPredicate<T> = string | AngularFirestoreDocument<T>;
@Injectable({
  providedIn: 'root',
})
export class FireService {
  constructor(private afs: AngularFirestore, private logger: LoggerService) {}
  col<T>(
    ref: CollectionPredicate<T>,
    queryFn?: QueryFn<firebase.default.firestore.DocumentData>
  ): AngularFirestoreCollection<T> {
    return typeof ref === 'string' ? this.afs.collection<T>(ref, queryFn) : ref;
  }
  doc<T>(ref: DocPredicate<T>): AngularFirestoreDocument<T> {
    return typeof ref === 'string' ? this.afs.doc<T>(ref) : ref;
  }

  /** Get Data */
  doc$<T>(ref: DocPredicate<T>): Observable<T> {
    return this.doc(ref)
      .snapshotChanges()
      .pipe(
        map(
          (
            doc: Action<
              DocumentSnapshotDoesNotExist | DocumentSnapshotExists<T>
            >
          ) => {
            return doc.payload.data() as T;
          }
        )
      );
  }
  col$<T>(
    ref: CollectionPredicate<T>,
    queryFn?: QueryFn<firebase.default.firestore.DocumentData>
  ): Observable<T[]> {
    return this.col(ref, queryFn)
      .snapshotChanges()
      .pipe(
        map((docs: DocumentChangeAction<T>[]) => {
          return docs.map((a: DocumentChangeAction<T>) =>
            a.payload.doc.data()
          ) as T[];
        })
      );
  }
  colWithIds$<T>(
    ref: CollectionPredicate<T>,
    queryFn?: QueryFn<firebase.default.firestore.DocumentData>
  ): Observable<any[]> {
    return this.col(ref, queryFn)
      .snapshotChanges()
      .pipe(
        map((actions: DocumentChangeAction<T>[]) => {
          return actions.map((a: DocumentChangeAction<T>) => {
            const data: T = a.payload.doc.data() as T;
            const id = a.payload.doc.id;
            return { id, ...data };
          });
        })
      );
  }

  /** Write Data */
  get timestamp() {
    return firebase.default.firestore.FieldValue.serverTimestamp();
  }
  set<T>(ref: DocPredicate<T>, data: any): Promise<void> {
    const timestamp = this.timestamp;
    return this.doc(ref).set({
      ...data,
      updatedAt: timestamp,
      createdAt: timestamp,
    });
  }
  update<T>(ref: DocPredicate<T>, data: any): Promise<void> {
    const resp = this.doc(ref)
      .update({
        ...data,
        updatedAt: this.timestamp,
      })
      .then(() => {});
    return resp;
  }
  delete<T>(ref: DocPredicate<T>): Promise<void> {
    return this.doc(ref).delete();
  }
  add<T>(
    ref: CollectionPredicate<T>,
    data: any
  ): Promise<firebase.default.firestore.DocumentReference<T>> {
    const timestamp = this.timestamp;
    const resp = this.col(ref).add({
      ...data,
      updatedAt: timestamp,
      createdAt: timestamp,
      isDeleted: false,
    });
    return resp;
  }
  addWithId<T>(
    ref: CollectionPredicate<T>,
    data: any,
    id: string
  ): Promise<firebase.default.firestore.DocumentReference<T> | void> {
    const timestamp = this.timestamp;
    const resp = this.col(ref)
      .doc(id)
      .set({
        ...data,
        updatedAt: timestamp,
        createdAt: timestamp,
        isDeleted: false,
      });
    return resp;
  }
  geopoint(lat: number, lng: number): firebase.default.firestore.GeoPoint {
    return new firebase.default.firestore.GeoPoint(lat, lng);
  }
  /// If doc exists update, otherwise set
  upsert<T>(ref: DocPredicate<T>, data: any): Promise<void> {
    const doc = this.doc(ref).snapshotChanges().pipe(take(1)).toPromise();

    return doc.then(
      (
        snap:
          | Action<DocumentSnapshotDoesNotExist | DocumentSnapshotExists<T>>
          | any
      ) => {
        return snap.payload.exists
          ? this.update(ref, data)
          : this.set(ref, data);
      }
    );
  }

  /** Inspect Data */
  inspectDoc(ref: DocPredicate<any>): void {
    const tick = new Date().getTime();
    this.doc(ref)
      .snapshotChanges()
      .pipe(
        take(1),
        tap(
          (
            d: Action<
              DocumentSnapshotDoesNotExist | DocumentSnapshotExists<any>
            >
          ) => {
            const tock = new Date().getTime() - tick;
            // console.log(`Loaded Document in ${tock}ms`, d);
          }
        )
      )
      .subscribe();
  }
  inspectCol(ref: CollectionPredicate<any>): void {
    const tick = new Date().getTime();
    this.col(ref)
      .snapshotChanges()
      .pipe(
        take(1),
        tap((c: DocumentChangeAction<any>[]) => {
          const tock = new Date().getTime() - tick;
          // console.log(`Loaded Collection in ${tock}ms`, c);
        })
      )
      .subscribe();
  }

  /** Create and read doc references */
  /// create a reference between two documents
  connect(host: DocPredicate<any>, key: string, doc: DocPredicate<any>) {
    return this.doc(host).update({ [key]: this.doc(doc).ref });
  }
  /// returns a documents references mapped to AngularFirestoreDocument
  docWithRefs$<T>(ref: DocPredicate<T>) {
    return this.doc$(ref).pipe(
      map((doc: T | any) => {
        for (const k of Object.keys(doc)) {
          if (doc[k] instanceof firebase.default.firestore.DocumentReference) {
            doc[k] = this.doc(doc[k].path);
          }
        }
        return doc;
      })
    );
  }

  /** Atomic batch example */
  /// Just an example, you will need to customize this method.
  atomic() {
    const batch = firebase.default.firestore().batch();
    /// add your operations here

    const itemDoc = firebase.default.firestore().doc('items/myCoolItem');
    const userDoc = firebase.default.firestore().doc('users/userId');

    const currentTime = this.timestamp;

    batch.update(itemDoc, { timestamp: currentTime });
    batch.update(userDoc, { timestamp: currentTime });

    /// commit operations
    return batch.commit();
  }
  /**
   * Delete a collection, in batches of batchSize. Note that this does
   * not recursively delete subcollections of documents in the collection
   * from: https://github.com/AngularFirebase/80-delete-firestore-collections/blob/master/src/app/firestore.service.ts
   */
  deleteCollection(path: string, batchSize: number): Observable<any> {
    const source = this.deleteBatch(path, batchSize);

    // expand will call deleteBatch recursively until the collection is deleted
    return source.pipe(
      expand((val) => this.deleteBatch(path, batchSize)),
      takeWhile((val) => val > 0)
    );
  }
  // Detetes documents as batched transaction
  private deleteBatch(path: string, batchSize: number): Observable<any> {
    const colRef = this.afs.collection(path, (ref) =>
      ref.orderBy('__name__').limit(batchSize)
    );
    let count = 0;
    return colRef.snapshotChanges().pipe(
      takeWhile((s: any) => count++ == 0),
      mergeMap((snapshot: DocumentChangeAction<{}>[]) => {
        // Delete documents in a batch
        const batch = this.afs.firestore.batch();
        snapshot.forEach((doc) => {
          batch.delete(doc.payload.doc.ref);
        });

        return from(batch.commit()).pipe(map(() => snapshot.length));
      })
    );
  }
  async log(eventName: string, eventParams: any) {
    const an = await analyticInstance$.pipe(first()).toPromise();
    this.logger.log('logger start:: ==> ', { eventName, eventParams });
    this.logger.log('logger analytic :: ==> ', an);
    if (an) {
      logEvent(an, eventName, eventParams);
    }
  }
}
