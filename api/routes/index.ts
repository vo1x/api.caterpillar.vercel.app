import { Hono } from "hono";
import {
  searchController,
  metadataController,
  imageController,
} from "../controllers";

const router = new Hono();

router.get("/", (c) => {
  return c.json(
    { message: "The caterpillar is up and crawling", ver: 1.0 },
    { status: 200 }
  );
});

router.get("/search", searchController);

router.get("/game", metadataController);
router.post("/image/upload", imageController);

export default router;
