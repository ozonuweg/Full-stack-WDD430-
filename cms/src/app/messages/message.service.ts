import { EventEmitter, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Subject } from 'rxjs';

import { Message } from './message.model';
import { MOCKMESSAGES } from './MOCKMESSAGES';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  private messages: Message[] = [];
  messagesChangedEvent = new EventEmitter<Message[]>();
  messageListChangedEvent = new Subject<Message[]>();
  maxMessageId: number;

  constructor(private http: HttpClient) {
    // this.messages = MOCKMESSAGES;
  }

  getMessages(): Message[] {
    this.http.get<Message[]>('http://localhost:3000/messages')
    .subscribe({
      next: (messages: Message[]) => {
        this.messages = messages;
        this.maxMessageId = this.getMaxId();
        this.messages.sort(function (a, b) {
          if (a.sender < b.sender) { return -1 }
          else if (a.sender > b.sender) { return 1 }
          else { return 0 }
        });
        let messagesListClone = this.messages.slice();
        this.messagesChangedEvent.next(messagesListClone);
      },

      error: (error: any) => {
        console.log(error);
      }
    });
    return this.messages.slice();
  }

  sortAndSend() {
    this.messages.sort();
    this.messagesChangedEvent.next(this.messages.slice());
  }

  // storeMessages() {
  //   let getMessageList = JSON.stringify(this.messages);
  //   let httpHeaders: HttpHeaders = new HttpHeaders();
  //   httpHeaders.set('Content-Type', 'application/json');

  //   this.http.put(
  //     'https://cmsproject-98236-default-rtdb.firebaseio.com/messages.json',
  //     getMessageList, { 'headers': httpHeaders })
  //     .subscribe(() => {
  //       let messageListClone = this.messages.slice();
  //       this.messagesChangedEvent.next(messageListClone);
  //     });
  // }

  getMessage(id: string): Message {
    if (!this.messages) {
      return null;
    }
    
    for (let message of this.messages) {
      if (message.id === id) {
        return message;
      }
    }
    return null;
  }

  getMaxId(): number {
    let maxId = 0;
    for (let message of this.messages) {
      let currentId = parseInt(message.id);
      if (currentId > maxId) {
        maxId = currentId;
      }
    }
    return maxId;
  }

  addMessage(message: Message) {
    if (!message) {
      return;
    }

    const headers = new HttpHeaders({'Content-Type': 'application/json'});

    // add to database
    this.http.post<{ message: Message }>('http://localhost:3000/messages',
      message,
      { headers: headers })
      .subscribe(
        (responseData) => {
          // add new message to messages
          this.messages.push(responseData.message);
          this.sortAndSend();
        }
      );
  }

  // addMessage(messages: Message){
  //   this.messages.push(messages);
  //   // this.storeMessages(this.messages.slice());
  //   this.storeMessages();
  // }
}
