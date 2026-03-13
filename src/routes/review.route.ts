import { Router } from "express";
import ReviewController from "../controllers/review.controller";




const Reviewroute = Router();
console.log("review.route loaded");

Reviewroute.post("/", ReviewController.createReview)

export default Reviewroute;