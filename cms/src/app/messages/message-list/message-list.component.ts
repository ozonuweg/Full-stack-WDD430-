import { Component, OnInit } from '@angular/core';
import { Message } from '../message.model';

@Component({
  selector: 'cms-message-list',
  templateUrl: './message-list.component.html',
  styleUrls: ['./message-list.component.css']
})
export class MessageListComponent implements OnInit {
  messages: Message[] = [
    new Message(2002, 'Late Submission', 'Hello Brother Marvis, I wanted to inform you that I will be turning in my assignment late this week. I recently contacted COVID.', 'Rita Lyonne'),
    new Message(2003, 'Problem Understanding Angular', 'I still do not get the concepts of Angualr. The video tutorials are very confusing and it is making me behind in my work.', 'Jose Hermendez'),
    new Message(2004, 'Grade Change', 'I saw that I was given 0 out of 3 for Week 2 Developer Forum. I belive this is an error as I contributed last week.', 'Ochuko Wavren')
  ];

  constructor() { }

  ngOnInit(): void {
  }

  onAddMessage(message: Message) {
    this.messages.push(message);
  }

}
