import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Document } from '../document.model';

@Component({
  selector: 'cms-document-list',
  templateUrl: './document-list.component.html',
  styleUrls: ['./document-list.component.css']
})
export class DocumentListComponent implements OnInit {
  @Output() selectedDocumentEvent = new EventEmitter<Document>();
  documents: Document[] = [
    new Document(1, 'CSE110 - Programming Building Blocks', 'This course will introduce students to programming. It will introduce the building blocks of programming languages (variables, decisions, calculations, loops, array, and input/output) and use them to solve problems.', 'https://www.byui.edu/catalog#/courses/view/5bd9d03c89d33a2e00f47336', null),
    new Document(2, 'CSE111 - Programming with Functions', 'CSE 111 students become more organized, efficient, and powerful computer programmers by learning to research and call functions written by others; to write, call , debug, and test their own functions; and to handle errors within functions.', 'https://www.byui.edu/catalog#/courses/view/61eb18599ef18d6e77118759', null),
    new Document(3, 'CSE210 - Programming with Classes', 'This course will introduce the notion of classes and objects. It will present encapsulation at a conceptual level. It will also work with inheritance and polymorphism.', 'https://www.byui.edu/catalog#/courses/view/6022ddd26b7cbd00276537b7', null),
    new Document(4, 'CSE212 - Programming with Data Structures', 'This course will introduce students to the common programming data structures with an emphasis on how to use them to solve practical, real-world problems.', 'https://www.byui.edu/catalog#/courses/view/603592ce26e7060027b8b90e', null),
    new Document(5, 'CSE310 - Applied Programming', 'This course will teach students to work in teams on large projects using new technology on self-defined projects. The class will simulate real-word programming projects with the aim of producing workable solutions that have potential impact.', 'https://www.byui.edu/catalog#/courses/view/60243d7cf90d3000271cc01a', null),
  ];

  constructor() { }

  ngOnInit(): void {
  }

  onSelectedDocument(document: Document) {
    this.selectedDocumentEvent.emit(document);
  }

}
