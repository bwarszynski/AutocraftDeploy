import express from "express";
import {getAllReviews, createReview} from "../Controllers/reviewController.js";
import { authenticate, restrict } from "../auth/verifyToken.js";

const router = express.Router({ mergeParams: true});

// mechanic/mechanicId/reviews

router
    .route('/')
    .get(getAllReviews)
    .post(authenticate, restrict(["customer"]), createReview);

export default router;
