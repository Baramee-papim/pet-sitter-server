import { Router } from "express";
import { createReview } from "../controllers/review.controller";




const Reviewroute = Router();
console.log("review.route loaded");

Reviewroute.post("/", createReview);

export default Reviewroute;