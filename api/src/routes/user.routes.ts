import { Application, Router } from "express";
import userController from "../controllers/user.controllers";

export default (app: Application): void => {
  const router = Router();

  router.post("/login", userController.login);

  router.get("/", userController.getAll);

  router.get("/:id", userController.getById);

  router.post("/", userController.create);

  router.put("/:id", userController.update);

  router.delete("/:id", userController.remove);

  app.use("/api/users", router);
};
