import express from "express";
import { authenticate, restrict } from "../auth/verifyToken.js";
import { getCheckoutSession } from "../Controllers/bookingController.js";

const router = express.Router();

router.post(
    "/checkout-session/:mechanicId",
    authenticate,
    restrict(["customer"]),
    getCheckoutSession
);

export default router;