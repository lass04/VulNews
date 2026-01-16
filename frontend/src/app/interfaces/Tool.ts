import { Category } from './Category';

export interface Tools{
    id:number,
    name:String,
    description:String,
    category:Category[],
    link:String
}