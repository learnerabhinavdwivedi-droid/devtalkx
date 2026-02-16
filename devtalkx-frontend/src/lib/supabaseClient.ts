import React from 'react';
// Point this to your new types file where 'Post' is defined
import { Post } from '../types'; 

interface PostCardProps extends Post {
  onDelete: (id: string) => void;
}