import { desc } from "drizzle-orm";
import db from "../db/db";
import { reports } from "../db/schema";

const ReportRepository = {
  createReport: async (payload: {
    reporterUserId: string;
    reportedUserId: string;
    issue: string;
    description?: string | null;
  }) => {
    const [report] = await db
      .insert(reports)
      .values({
        reporterUserId: payload.reporterUserId,
        reportedUserId: payload.reportedUserId,
        issue: payload.issue,
        description: payload.description ?? null,
      })
      .returning();

    return report;
  },

  findDuplicateOpenReport: async (payload: {
    reporterUserId: string;
    reportedUserId: string;
    issue: string;
  }) => {
    const report = await db.query.reports.findFirst({
      where: (reports, { and, eq, isNull }) =>
        and(
          eq(reports.reporterUserId, payload.reporterUserId),
          eq(reports.reportedUserId, payload.reportedUserId),
          eq(reports.issue, payload.issue),
          isNull(reports.resolvedAt),
          isNull(reports.cancelledAt),
        ),
      orderBy: [desc(reports.createdAt)],
    });

    return report;
  },

  getReportById: async (reportId: number) => {
    const report = await db.query.reports.findFirst({
      where: (reports, { eq }) => eq(reports.reportId, reportId),
    });

    return report;
  },
};

export default ReportRepository;