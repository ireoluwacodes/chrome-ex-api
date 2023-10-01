import  express  from "express";
import { Home, appendVideo, completeVideo, createVideo, getVideo } from "./controller.js";

const Router = express.Router()

Router.route("/").get(Home)

Router.route("/api").post(createVideo)

Router.route("/api").post(appendVideo)

Router.route("/api").post(completeVideo)

Router.route("/api").post(getVideo)

export {
    Router
}