import { EventEmitter, Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Document } from './document.model';
import { MOCKDOCUMENTS } from './MOCKDOCUMENTS';

@Injectable({
  providedIn: 'root'
})
export class DocumentService {
  private documents: Document[] = [];
  documentSelectedEvent = new EventEmitter<Document>();
  // documentChangedEvent = new EventEmitter<Document[]>();
  documentListChangedEvent = new Subject<Document[]>();
  maxDocumentId: number;
  currentDocId: number;

  constructor(private http: HttpClient) {
    // this.documents = MOCKDOCUMENTS;
    // this.maxDocumentId = this.getMaxId();
  }

  getDocuments(): Document[] {
    this.http.get<Document[]>('http://localhost:3000/documents')
    .subscribe({
      next: (documents: Document[]) => {
        this.documents = documents;
        this.maxDocumentId = this.getMaxId();
        this.documents.sort(function (a, b) {
          if (a.name < b.name) { return -1 }
          else if (a.name > b.name) { return 1 }
          else { return 0 }
        });
        let documentsListClone = this.documents.slice();
        this.documentListChangedEvent.next(documentsListClone);
      },

      error: (error: any) => {
        console.log(error);
      }
    });
    return this.documents.slice();
  }

  sortAndSend() {
    this.documents.sort();
    this.documentListChangedEvent.next(this.documents.slice());
  }

  // storeDocuments(documents: Document[]) {
  //   let getDocumentList = JSON.stringify(this.documents);
  //   let httpHeaders: HttpHeaders = new HttpHeaders();
  //   httpHeaders.set('Content-Type', 'application/json');

  //   this.http.put(
  //     'https://cmsproject-98236-default-rtdb.firebaseio.com/documents.json',
  //     getDocumentList, { 'headers': httpHeaders })
  //     .subscribe(() => {
  //       let documentsListClone = this.documents.slice();
  //       this.documentListChangedEvent.next(documentsListClone);
  //     });
  // }

  getDocument(id: string): Document {
    for (let document of this.documents) {
      if (document.id === id) {
        return document;
      }
    }
    return null;
  }

  getMaxId(): number {
    let maxId = 0;
    for (let document of this.documents) {
      let currentId = parseInt(document.id);
      if (currentId > maxId) {
        maxId = currentId;
      }
    }
    return maxId;
  }

  addDocument(document: Document) {
    if (!document) {
      return;
    }

    // make sure id of the new Document is empty
    document.id = '';

    const headers = new HttpHeaders({'Content-Type': 'application/json'});

    // add to database
    this.http.post<{ message: string, document: Document }>('http://localhost:3000/documents',
      document,
      { headers: headers })
      .subscribe(
        (responseData) => {
          // add new document to documents
          this.documents.push(responseData.document);
          this.sortAndSend();
        }
      );
  }

  // addDocument(newDocument: Document) {
  //   if (!newDocument) {
  //     return
  //   }
  //   this.maxDocumentId++;
  //   newDocument.id = this.maxDocumentId.toString();
  //   this.documents.push(newDocument);
  //   let documentsListClone = this.documents.slice();
  //   this.storeDocuments(documentsListClone);
  // }


  updateDocument(originalDocument: Document, newDocument: Document) {
    if (!originalDocument || !newDocument) {
      return;
    }

    const pos = this.documents.findIndex(d => d.id === originalDocument.id);

    if (pos < 0) {
      return;
    }

    // set the id of the new Document to the id of the old Document
    newDocument.id = originalDocument.id;
    newDocument._id = originalDocument._id;

    const headers = new HttpHeaders({'Content-Type': 'application/json'});

    // update database
    this.http.put('http://localhost:3000/documents/' + originalDocument.id,
      newDocument, { headers: headers })
      .subscribe(
        (response: Response) => {
          this.documents[pos] = newDocument;
          this.sortAndSend();
        }
      );
  }

  // updateDocument(originalDocument: Document, newDocument: Document) {
  //   if (!originalDocument || !newDocument) {
  //     return;
  //   }
  //   let pos = this.documents.indexOf(originalDocument);
  //   if (pos < 0) {
  //     return;
  //   }
  //   newDocument.id = originalDocument.id;
  //   this.documents[pos] = newDocument;
  //   let documentsListClone = this.documents.slice();
  //   this.storeDocuments(documentsListClone);
  // }


  deleteDocument(document: Document) {

    if (!document) {
      return;
    }

    const pos = this.documents.findIndex(d => d.id === document.id);

    if (pos < 0) {
      return;
    }

    // delete from database
    this.http.delete('http://localhost:3000/documents/' + document.id)
      .subscribe(
        (response: Response) => {
          this.documents.splice(pos, 1);
          this.sortAndSend();
        }
      );
  }
  
  // deleteDocument(document: Document) {
  //   if (!document) {
  //      return;
  //   }
  //   const pos = this.documents.indexOf(document);
  //   if (pos < 0) {
  //      return;
  //   }
  //   this.documents.splice(pos, 1);
  //   let documentsListClone = this.documents.slice();
  //   this.storeDocuments(documentsListClone);
  // }
}
