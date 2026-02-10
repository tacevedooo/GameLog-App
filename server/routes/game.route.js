import { Router } from "express";
import gameController from "../controllers/game.controller.js";
import auth from "../middlewares/auth.js";
import role from "../middlewares/role.js";

const router = Router();

// Create game → ONLY admin
router.post(
  "/",
  auth,
  role("admin"),
  gameController.create
);

// Get all games → any authenticated user
router.get(
  "/",
  auth,
  gameController.getAll
);

// Get game by ID → any authenticated user
router.get(
  "/:id",
  auth,
  gameController.getById
);

// Update game → ONLY admin
router.put(
  "/:id",
  auth,
  role("admin"),
  gameController.update
);

// Delete game → ONLY admin
router.delete(
  "/:id",
  auth,
  role("admin"),
  gameController.delete
);

export default router;
