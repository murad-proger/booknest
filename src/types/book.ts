export type Book = {
  id: number;
  title: string;
  author: string;
  price: number;
  images: {
    id: number;
    url: string;
  }[];
};