const express = require('express');
const getWorkoutRouter = express.Router();
getWorkoutRouter.use(express.json());
import { getWorkoutDetails, getAllWorkoutNames } from "./getWorkout.controller";
import RouteNamesClass from "../../utils/routeNamesClass";
const routeNames = new RouteNamesClass()
//Routes
getWorkoutRouter.get(routeNames.partialGetWorkout, getWorkoutDetails);
getWorkoutRouter.get(routeNames.partialGetAllWorkoutNames, getAllWorkoutNames)
export default getWorkoutRouter;
export {}