import Express from "express";
const router = Express.Router();
import mediaController from "../controllers/mediaController";

router.get("/search", mediaController.getSearch);
router.get("/game", mediaController.getGameInfo);
router.get("/", mediaController.getRoot);

export default router;
