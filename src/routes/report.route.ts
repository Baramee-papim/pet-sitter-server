import { Router } from "express";
import ReportController from "../controllers/report.controller";

const ReportRoute = Router();
console.log("report.route loaded");

ReportRoute.post("/", ReportController.createReport);

export default ReportRoute;