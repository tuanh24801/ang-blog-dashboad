export interface Post {
  id: string;
  title: string,
  permalink: string,
  excerpt: string,
  category: {
    category: string,
    categoryId: string,
  },
  postImgPath: string,
  content: string,
  isFeatured: boolean,
  views: number,
  status: string,
  createdAt: Date
}
