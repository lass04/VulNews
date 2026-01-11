import { Post } from './Post';
import { User } from './User';

export interface PostComment{
    id:number,
    content:String,
    author:User,
    post:Post,
    reactions:number,
    date:Date
}