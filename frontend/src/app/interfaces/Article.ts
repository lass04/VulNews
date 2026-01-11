import { Category } from './Category';
import { User } from "./User";

export interface Article{
    id:number,
    title:String,
    author:User,
    content:String,
    category:Category,
    reactions:number,
    date:Date
}