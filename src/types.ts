export interface FeedPost {
  userId: number;
  id: number;
  title: string;
  body: string;
}

export interface FeedUser {
  id: number;
  name: string;
  username: string;
  email: string;
}

export interface PostWithUser extends FeedPost {
  author: FeedUser;
  liked: boolean;
}