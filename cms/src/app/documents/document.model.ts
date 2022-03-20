import { ObjectId } from "mongoose";

export class Document {
    constructor(
        public _id: ObjectId,
        public id: string, 
        public name: string, 
        public description: string, 
        public url: string, 
        public children: []) 
        { 

    }
}