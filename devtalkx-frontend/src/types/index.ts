export interface Post {
  _id: string; // From MongoDB
  title: string;
  authorId: {
    _id: string;
    firstName: string;
    lastName: string;
    photoUrl?: string;
    devRole?: string;
  };
  tags: string[];
  content: string;
  photoUrl?: string;
  linkUrl?: string;
  createdAt: string;
}