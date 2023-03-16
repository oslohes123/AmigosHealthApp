require('dotenv').config()
import { Request, Response } from 'express';
import supabase from '../../utils/supabaseSetUp'
import {supabaseQueryClass} from '../../utils/databaseInterface'
import {getWords, getFaces, average, getOccurrences, wordFreq} from '../../functions/mhfunctions'
import { getDate } from '../../utils/convertTimeStamptz';
import moment from 'moment';
import{v4 as uuidv4} from 'uuid'
import { createHashedPassword } from '../../utils/userFunctions';

let randomEmail: string;
const supabaseQuery = new supabaseQueryClass();
const uuid = uuidv4();
randomEmail = `${uuid}@gmail.com`


export const wordValues = async(req:Request,res:Response) => {
    const { id } = req.headers
    const { data,error }:any = await supabaseQuery.mostrecent(supabase, 'Mental Health','todays_word','created_at', id);
        if(error){
            console.log("Failed to return last 7 words")
            return res.status(400).json({mssg:"Failed to retrieve last 7 words"})
        }
        else{
            const freq = wordFreq(getWords(data))
            console.log(`this: ${JSON.stringify(data)}`)
             return res.status(200).json({mssg: "MentalHealthOverview", words: getWords(data), freq: freq})
        }
    }
        
  
export const faceValues = async(req:Request,res:Response) =>{
    const { id } = req.headers
    const { data,error }:any = await supabaseQuery.mostrecent(supabase, 'Mental Health','face_id','created_at', id);
        if(error){
            console.log("Failed to return last 7 faces")
            return res.status(400).json({mssg : "Failed to retrieve last 7 faces"})
        }
        else{
           const avg = average(getFaces(data));
            return res.status(200).json({mssg: "Retrieved faces",faces: getFaces(data), average: avg, success: "successful"}) 
        } 
}        

export const todaysValue = async(req:Request,res:Response) => {
    const { uuid } = req.headers
    let randomEmail: string;
    randomEmail = `${uuid}@gmail.com`
    let todayDate = getDate(moment().format());
    const hashedPassword = await createHashedPassword("CorrectPassword123!")

    await supabaseQuery.insert(supabase, "User", {id: uuid, firstName: "First", lastName:"User", 
    email:randomEmail, password: hashedPassword, age: 31})
    await supabaseQuery.insert(supabase, "Mental Health", {user_id: uuid, face_id: '1',created_at: todayDate, todays_word: 'Awful'});
    const {data, error}:any = await supabaseQuery.todays_data(supabase, 'Mental Health','user_id', 'created_at', uuid,  todayDate, 'todays_word');
    
    if(error){
        return res.status(400).json({mssg:"Something went wrong!", error});
    }
    else if (data.length ==0){
        return res.status(200).json({mssg:"User has not inputted a word today"});
    }
    else{
        return res.status(200).json({mssg:"Here is today's word!", word: data})
    }
}