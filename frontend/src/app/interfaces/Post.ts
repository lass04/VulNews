import { Comment } from './Comment';
import { User } from './User';

export interface Post{
    _id: string,
    title:string,
    content:string,
    author:User,
    reactions:string[],
    comments?:Comment[],
    createdAt: string;
    updatedAt: string;
    __v?: number;
    likedByMe?:boolean

    showComments?: boolean;
    newComment?: string;
}