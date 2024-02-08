import express from "express";
import { updateMechanic, deleteMechanic, getSingleMechanic, getAllMechanics, getMechanicProfile } from "../Controllers/mechanicController.js";
import {authenticate, restrict, adminAuth, mechanicAuth, customerAuth} from "../auth/verifyToken.js";
import reviewRouter from "./review.js";


const router = express.Router();

//zagnieżdzenie
router.use("/:mechanicId/reviews", reviewRouter);
router.get('/:id', getSingleMechanic);
router.get('/', getAllMechanics);
router.put('/:id', authenticate, restrict(["mechanic"]), updateMechanic);
router.delete('/:id', authenticate, restrict(["mechanic"]), deleteMechanic);
router.get('/profile/me', authenticate, restrict(["mechanic"]), getMechanicProfile);

export default router;

