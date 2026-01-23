import { Category } from './Category';
import { User } from './User';

export interface Post{
    id:number,
    title:string,
    content:string,
    category:Category,
    author:User,
    reactions:number,
    date:Date
}