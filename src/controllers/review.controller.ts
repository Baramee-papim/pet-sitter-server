import { Request, Response } from "express";
import AppError from "../errors/AppError";
import ReviewService from "../services/review.service";
import { GetReviewsQuery, ReviewItem } from "../types/review";
import { SitterIdParams } from "../types/sitter";

const ReviewController = {
  getReviewsBySitterId: async (
    req: Request<SitterIdParams, {}, {}, GetReviewsQuery>,
    res: Response,
  ) => {
    const sitterId = Number(req.params.sitterId);
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 5;
    const rating = Number(req.query.rating) || null;
    let result;

    try {
      result = await ReviewService.getReviewsBySitterId(
        sitterId,
        page,
        limit,
        rating,
      );
    } catch (error) {
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({ error: error.message });
      }

      return res.status(500).json({ error: "Internal server error" });
    }

    const reviewsResponse = {
      totalReviews: result.totalReviews,
      totalPages: result.totalPages,
      currentPage: page,
      limit,
      reviews: result.reviews.map((review: ReviewItem) => ({
        id: review.reviewId,
        rating: review.rating,
        comment: review.comment,
        createdAt: review.createdAt,
        reviewer: review.reviewer,
      })),
    };

    return res.status(200).json(reviewsResponse);
  },
};

export default ReviewController;
