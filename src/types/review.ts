export interface GetReviewsQuery {
  page?: string;
  limit?: string;
  rating?: string;
}

export interface ReviewItem {
  reviewId: number;
  rating: number;
  comment: string;
  createdAt: string;
  reviewer: {
    name: string;
    profileImgUrl: string | null;
  };
}