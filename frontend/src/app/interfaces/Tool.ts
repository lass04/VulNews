export interface Tool {
  _id: string;
  name: string;
  description: string;
  category: string[];   
  link: string;
  image: string;
  createdAt: string;
  updatedAt: string;
  __v?: number;
}
