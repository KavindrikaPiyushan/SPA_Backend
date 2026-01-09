import express from "express";
import { CreateSignature } from "../controller/cloudinary.controller.js";
import { authenticate } from "../utils/auth.js";

const router = express.Router();

router.post("/create-signature", authenticate, CreateSignature);

export default router;

