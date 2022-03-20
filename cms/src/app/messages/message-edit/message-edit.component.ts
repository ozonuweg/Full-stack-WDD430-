import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { Message } from '../message.model';
import { MessageService } from '../message.service';

@Component({
  selector: 'cms-message-edit',
  templateUrl: './message-edit.component.html',
  styleUrls: ['./message-edit.component.css']
})
export class MessageEditComponent implements OnInit {
  @ViewChild('subject') subjectRef : ElementRef;
  @ViewChild('msgText') msgTextRef : ElementRef;
  @Output() addMessageEvent = new EventEmitter<Message>();

  currentSender: string = '101';

  constructor(private messageService: MessageService) { }

  ngOnInit(): void {
  }

  onSendMessage() {
    const msgSubject: string = this.subjectRef.nativeElement.value;
    const msgMsgText: string = this.msgTextRef.nativeElement.value;
    const newMessage = new Message('15', msgSubject, msgMsgText, this.currentSender);
    this.messageService.addMessage(newMessage);
    this.onClear();
  }

  onClear() {
    this.subjectRef.nativeElement.value = "";
    this.msgTextRef.nativeElement.value = "";
  }

}
