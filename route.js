import  express  from "express";
import { Home, appendVideo, completeVideo, createVideo, getVideo } from "./controller.js";

const Router = express.Router()

Router.route("/").get(Home)

Router.route("/api/create").post(createVideo)

Router.route("/api/append").post(appendVideo)

Router.route("/api/complete").post(completeVideo)

Router.route("/api/:id").get(getVideo)

export {
    Router
}