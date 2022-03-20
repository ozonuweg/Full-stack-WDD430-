import { EventEmitter, Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Contact } from './contact.model';
import { MOCKCONTACTS } from './MOCKCONTACTS';

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  private contacts: Contact[] = [];
  contactSelectedEvent = new EventEmitter<Contact>();
  contactChangedEvent = new EventEmitter<Contact[]>();
  contactListChangedEvent = new Subject<Contact[]>();
  maxContactId: number;
  currentContactId: number;

  constructor(private http: HttpClient) {
    // this.contacts = MOCKCONTACTS;
    // this.maxContactId = this.getMaxId();
  }

  getContacts(): Contact[] {
    this.http.get<Contact[]>('http://localhost:3000/contacts')
    .subscribe({
      next: (contacts: Contact[]) => {
        this.contacts = contacts;
        this.maxContactId = this.getMaxId();
        this.contacts.sort();
        let contactsListClone = this.contacts.slice();
        this.contactListChangedEvent.next(contactsListClone);
      },

      error: (error: any) => {
        console.log(error);
      }
    });
    return this.contacts.slice();
  }

  sortAndSend() {
    this.contacts.sort();
    this.contactListChangedEvent.next(this.contacts.slice());
  }

  // storeContacts(contacts: Contact[]) {
  //   let getContactList = JSON.stringify(this.contacts);
  //   let httpHeaders: HttpHeaders = new HttpHeaders();
  //   httpHeaders.set('Content-Type', 'application/json');

  //   this.http.put(
  //     'https://cmsproject-98236-default-rtdb.firebaseio.com/contacts.json',
  //     getContactList, { 'headers': httpHeaders })
  //     .subscribe(() => {
  //       let contactsListClone = this.contacts.slice();
  //       this.contactListChangedEvent.next(contactsListClone);
  //     });
  // }

  getContact(id: string): Contact {
    for (let contact of this.contacts) {
      if (contact.id === id) {
        return contact;
      }
    }
    return null;
  }

  getMaxId(): number {
    let maxId = 0;
    for (let contact of this.contacts) {
      let currentId = parseInt(contact.id);
      if (currentId > maxId) {
        maxId = currentId;
      }
    }
    return maxId;
  }


  addContact(contact: Contact) {
    if (!contact) {
      return;
    }

    // make sure id of the new Contact is empty
    contact.id = '';

    const headers = new HttpHeaders({'Content-Type': 'application/json'});

    // add to database
    this.http.post<{ message: string, contact: Contact }>('http://localhost:3000/contacts',
      contact,
      { headers: headers })
      .subscribe(
        (responseData) => {
          // add new contact to contacts
          this.contacts.push(responseData.contact);
          this.sortAndSend();
        }
      );
  }

  // addContact(newContact: Contact) {
  //   if (!newContact) {
  //     return
  //   }
  //   this.maxContactId++;
  //   newContact.id = this.maxContactId.toString();
  //   this.contacts.push(newContact);
  //   let contactsListClone = this.contacts.slice();
  //   this.storeContacts(contactsListClone);
  // }


  updateContact(originalContact: Contact, newContact: Contact) {
    if (!originalContact || !newContact) {
      return;
    }

    const pos = this.contacts.findIndex(d => d.id === originalContact.id);

    if (pos < 0) {
      return;
    }

    // set the id of the new Contact to the id of the old Contact
    // newContact.id = originalContact.id;
    newContact.id = originalContact.id;

    const headers = new HttpHeaders({'Content-Type': 'application/json'});

    // update database
    this.http.put('http://localhost:3000/contacts/' + originalContact.id,
      newContact, { headers: headers })
      .subscribe(
        (response: Response) => {
          this.contacts[pos] = newContact;
          this.sortAndSend();
        }
      );
  }

  // updateContact(originalContact: Contact, newContact: Contact) {
  //   if (!originalContact || !newContact) {
  //     return;
  //   }
  //   let pos = this.contacts.indexOf(originalContact);
  //   if (pos < 0) {
  //     return;
  //   }
  //   newContact.id = originalContact.id;
  //   this.contacts[pos] = newContact;
  //   let contactsListClone = this.contacts.slice();
  //   this.storeContacts(contactsListClone);
  // }


  deleteContact(contact: Contact) {

    if (!contact) {
      return;
    }

    const pos = this.contacts.findIndex(d => d.id === contact.id);

    if (pos < 0) {
      return;
    }

    // delete from database
    this.http.delete('http://localhost:3000/contacts/' + contact.id)
      .subscribe(
        (response: Response) => {
          this.contacts.splice(pos, 1);
          this.sortAndSend();
        }
      );
  }

  // deleteContact(contact: Contact) {
  //   if(!contact) {
  //     return;
  //   }
  //   const pos = this.contacts.indexOf(contact);
  //   if (pos < 0) {
  //     return;
  //   }
  //   this.contacts.splice(pos, 1);
  //   let contactsListClone = this.contacts.slice();
  //   this.storeContacts(contactsListClone);
  // }
}
