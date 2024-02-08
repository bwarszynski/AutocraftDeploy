import express from "express";
import { updateUser, deleteUser, getSingleUser, getAllUsers, getUserProfile, getMyAppointments } from "../Controllers/userController.js";
import {authenticate, restrict} from "../auth/verifyToken.js";

const router = express.Router();

router.get('/:id', authenticate, restrict(["customer"]), getSingleUser);
router.get('/', authenticate, restrict(["admin"]), getAllUsers);
router.put('/:id', authenticate, restrict(["customer"]), updateUser);
router.delete('/:id', authenticate, restrict(["customer"]), deleteUser);
router.get('/profile/me', authenticate, restrict(["customer"]), getUserProfile);
router.get('/appointments/my-appointments', authenticate, restrict(["customer"]), getMyAppointments);

export default router;

