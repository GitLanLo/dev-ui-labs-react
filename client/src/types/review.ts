export type ReviewUser = {
  id: string;
  name: string;
  isPro: boolean;
  avatarUrl: string;
};

export type Review = {
  id: string;
  comment: string;
  date: string;
  rating: number;
  user: ReviewUser;
};

export type NewReview = Pick<Review, 'comment' | 'rating'>;

export type Reviews = Review[];
export type ReviewsByOfferId = Record<string, Reviews>;
