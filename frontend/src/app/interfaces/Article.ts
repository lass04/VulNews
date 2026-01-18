export interface Article {
  _id: string;
  title: string;
  author: string;        
  category: string[];    
  content: string;
  reactions: number;
  createdAt: string;
  updatedAt: string;
  __v?: number;
}


