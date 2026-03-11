import AppError from "../errors/AppError";
import ReviewRepository from "../repositories/review.repository";
import SitterRepository from "../repositories/sitter.repository";

const ReviewService = {
  getReviewsBySitterId: async (
    sitterId: number,
    page: number,
    limit: number,
    rating: number | null
  ) => {
    const sitter = await SitterRepository.getById(sitterId, true);

    if (!sitter) {
      throw new AppError(404, "Sitter not found");
    }

    const { result, totalReviews } = await ReviewRepository.getBySitterId(
      sitterId,
      page,
      limit,
      rating
    );

    return {
      totalReviews,
      totalPages: Math.ceil(totalReviews / limit),
      reviews: result.map((review) => ({
        reviewId: review.reviewId,
        rating: review.rating,
        comment: review.comment,
        createdAt: review.createdAt,
        reviewer: {
          name: review.booking.user.name,
          profileImgUrl: review.booking.user.profileImgUrl,
        },
      })),
    };
  },
};

export default ReviewService;