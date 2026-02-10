import { Router } from "express";
import experienceController from "../controllers/experience.controller.js";
import auth from "../middlewares/auth.js";

const router = Router();

/* -------------------- AUTH (ALL ROUTES) -------------------- */
router.use(auth);

/**
 * Create experience
 * POST /api/experiences
 */
router.post("/", experienceController.create);

/**
 * Get all experiences
 * GET /api/experiences
 */
router.get("/", experienceController.getAll);

/**
 * Get experiences by user
 * GET /api/experiences/user/:userId
 */
router.get("/user/:userId", experienceController.getByUser);

/**
 * Get experiences by game
 * GET /api/experiences/game/:gameId
 */
router.get("/game/:gameId", experienceController.getByGame);

/**
 * Update experience
 * PUT /api/experiences/:id
 */
router.put("/:id", experienceController.update);

/**
 * Delete experience
 * DELETE /api/experiences/:id
 */
router.delete("/:id", experienceController.delete);

export default router;
