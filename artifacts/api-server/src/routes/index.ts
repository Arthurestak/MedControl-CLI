import { Router, type IRouter } from "express";
import healthRouter from "./health";
import medicationsRouter from "./medications";

const router: IRouter = Router();

router.use(healthRouter);
router.use(medicationsRouter);

export default router;
