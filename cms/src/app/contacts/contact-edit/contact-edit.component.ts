import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router, Params } from '@angular/router';

import{Contact} from '../contact.model';
import {ContactService} from '../contact.service';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';

@Component({
  selector: 'cms-contact-edit',
  templateUrl: './contact-edit.component.html',
  styleUrls: ['./contact-edit.component.css']
})
export class ContactEditComponent implements OnInit {
  originalContact: Contact;
  contact: Contact;
  groupContacts: Contact[] = [];
  editMode: boolean = false;
  id: string;

  //This is a variable that stores the list of draggable contacts
  // addedContacts = [];
  

  constructor(
    private contactService: ContactService,
    private router: Router,
    private route: ActivatedRoute) { 
    }

  ngOnInit(): void {
    this.route.params
    .subscribe((params: Params) => {
      this.id = params['id'];
      if(!this.id){
        this.editMode = false;
        return;
      }
      this.originalContact = this.contactService.getContact(this.id);
      if(!this.originalContact){
        return;
      }
      this.editMode = true;
      this.contact = JSON.parse(JSON.stringify(this.originalContact));

      if(this.contact.group && this.contact.group.length > 0) {
        this.groupContacts = JSON.parse(JSON.stringify(this.originalContact.group));
      }
    })
  }

  onSubmit(form: NgForm ){
    let value = form.value;
    let newContact = new Contact(
      value.id,
      value.name,
      value.email,
      value.phone,
      value.imageUrl,
      []);

      if(this.editMode){
        this.contactService.updateContact(this.originalContact, newContact);
      }else{
        this.contactService.addContact(newContact);
      }
      this.router.navigate(['/contacts']);
  }

  onCancel(){
    this.router.navigate(['/contacts']);
  }

  isInvalidContact(newContact: Contact) {
    if (!newContact) {
      return true;
    }
    if (this.contact && newContact.id === this.contact.id) {
      return true;
    }
    for (let i = 0; i < this.groupContacts.length; i++){
      if (newContact.id === this.groupContacts[i].id) {
        return true;
      }
    }
    return false;
  }

  addToGroup($event: any) {
    const selectedContact: Contact = $event.dragData;
    const invalidGroupContact = this.isInvalidContact(selectedContact);
    if (invalidGroupContact){
      return;
    }
    this.groupContacts.push(selectedContact);
  }

  onRemoveItem(index: number) {
    if (index < 0 || index >= this.groupContacts.length) {
       return;
    }
    this.groupContacts.splice(index, 1);
 }

  // start for dragging and drop
  // drop(event: CdkDragDrop<string[]>) {
  //   if(event.previousContainer === event.container) {
  //     moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
  //   } else {
  //     transferArrayItem(
  //       event.previousContainer.data,
  //       event.container.data,
  //       event.previousIndex,
  //       event.currentIndex
  //     );
  //   }
  // }

}
