import { Request, Response } from "express"
import supabase from "../../utils/supabaseSetUp"
import { supabaseQueryClass } from "../../utils/databaseInterface"
import moment from "moment";
import { getDate } from "../../utils/convertTimeStamptz";
const databaseQuery = new supabaseQueryClass();

export const getCaloriesToday =async (req:Request, res: Response) => {
    const {userid} = req.headers;
    if(!userid){
        return res.status(400).json({mssg:"userid is required!"});
    }
    let totalCaloriesBurnt = 0;
    const todayDate = getDate(moment().format());
    const {data, error}:any = await databaseQuery.selectWhere(supabase, 'CompletedWorkouts','userid', userid, 'completedWorkoutID, timestamp');
    if(error){
        return res.status(400).json({mssg:"Something went wrong!", error});
    }
    else if (data.length ===0){
        return res.status(200).json({mssg:"User has no workouts!", totalCaloriesBurnt});
    }
    else{
        console.log(`data ln 19: ${JSON.stringify(data)}`);
        let arrayOfWorkoutsToday = []
        for(let i = 0; i< data.length; i++){
            const workoutTimeStamp = data[i].timestamp
            const workoutDate = getDate(workoutTimeStamp)
            console.log(`workoutDate:${workoutDate}`)
            if( workoutDate=== todayDate){
                arrayOfWorkoutsToday.push(data[i])
            }
        }
        console.log(`arrayOfWorkoutsToday: ${JSON.stringify(arrayOfWorkoutsToday)}`);
        let arrayOfExercisesToday = []
        for(let i= 0; i<arrayOfWorkoutsToday.length; i++){
            const completedWorkoutID = arrayOfWorkoutsToday[i].completedWorkoutID
            console.log(`completedWorkoutID: ${completedWorkoutID}`)
            const {data, error}:any = await databaseQuery.selectWhere(supabase, 'TrackedWorkoutsWithExercises','completedWorkoutID', completedWorkoutID, 'AEID');
            if(error){
                return res.status(400).json({mssg:"Something went wrong!", error});
            }
            else if (data.length ===0){
                return res.status(400).json({mssg:"No workout registered in TrackedWorkoutsWithExercises"});
            }
            else{
                console.log(`data ln 44: ${JSON.stringify(data)}`);
                for(let i = 0; i< data.length; i++){
                    arrayOfExercisesToday.push(data[i].AEID)
                }
                console.log(`after push: ${JSON.stringify(arrayOfExercisesToday)}`);

            }
        }
        console.log(`arrayOfExercisesToday: ${JSON.stringify(arrayOfExercisesToday)}`);

        
        for(let i = 0; i< arrayOfExercisesToday.length; i++){
            const AEID = arrayOfExercisesToday[i]
           const {data,error}:any = await databaseQuery.match(supabase, 'ActualExercises','calories', {userID:userid,AEID});
            if(error){
                return res.status(400).json({mssg:"Something went wrong!", error});
            }
            else if (data.length ===0){
                return res.status(400).json({mssg:"Selecting where data.length===0"});
            }
            else{
                console.log(`data ln 61: ${JSON.stringify(data)}`);
                const exerciseCaloriesBurnt = data[0].calories
                if(exerciseCaloriesBurnt){
                    totalCaloriesBurnt = totalCaloriesBurnt+ exerciseCaloriesBurnt;
                }
            }
        }
        console.log(`totalCaloriesBurnt:${totalCaloriesBurnt}`);
        return res.status(200).json({mssg:"Success", totalCaloriesBurnt})

    }
}