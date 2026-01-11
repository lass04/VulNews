import { Category } from './Category';
import { User } from './User';

export interface Post{
    id:number,
    title:String,
    content:String,
    category:Category,
    author:User,
    reactions:number,
    date:Date
}