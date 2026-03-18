import AppError from "../errors/AppError";
import BookingRepository from "../repositories/booking.repository";
import ReportRepository from "../repositories/report.repository";
import SitterService from "./sitter.service";

const ReportService = {
  createReport: async ({
    userId,
    bookingId,
    issue,
    description,
  }: {
    userId: string;
    bookingId: number;
    issue: string;
    description?: string;
  }) => {
    const normalizedBookingId = Number(bookingId);
    const trimmedIssue = String(issue ?? "").trim();
    const trimmedDescription = String(description ?? "").trim();

    if (!normalizedBookingId || !trimmedIssue) {
      throw new AppError(400, "booking_id and issue are required");
    }

    const booking = await BookingRepository.getBookingById(normalizedBookingId);

    if (!booking) {
      throw new AppError(404, "Booking not found");
    }

    if (booking.petOwnerId !== userId) {
      throw new AppError(403, "You cannot report this booking");
    }

    const sitter = await SitterService.getSitterById(booking.petSitterId, false);

    if (!sitter?.sitter?.id) {
      throw new AppError(404, "Pet sitter user not found");
    }

    const duplicateReport = await ReportRepository.findDuplicateOpenReport({
      reporterUserId: userId,
      reportedUserId: sitter.sitter.id,
      issue: trimmedIssue,
    });

    if (duplicateReport) {
      throw new AppError(409, "This report has already been submitted");
    }

    const report = await ReportRepository.createReport({
      reporterUserId: userId,
      reportedUserId: sitter.sitter.id,
      issue: trimmedIssue,
      description: trimmedDescription || null,
    });

    return report;
  },
};

export default ReportService;