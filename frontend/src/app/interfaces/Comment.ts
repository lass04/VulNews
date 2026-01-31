import { Post } from './Post';
import { User } from './User';

export interface Comment{
    _id:string;
    content:String;
    author:User;
    post:Post;
    createdAt:string;
    updatedAt:string;
    __v?:number
}