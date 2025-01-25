import { Hono } from "hono";
import searchController from "../controllers/search-controller";
import metadataController from "../controllers/metadata-controller";
import imageController from "../controllers/image-controller";

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
