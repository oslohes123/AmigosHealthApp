import app from "../../index";
const request = require('supertest');
const test = require('ava');
import { createToken } from "../../utils/userFunctions";
import { Request, Response } from 'express';
const sinon = require('sinon');
import { getInfo } from "../../routes/authentication.controller"; 
import {v4 as uuidv4} from 'uuid';
const bcrypt = require('bcrypt');
import supabase from "../../utils/supabaseSetUp";
import { supabaseQueryClass } from "../../utils/databaseInterface"; 
const supabaseQuery = new supabaseQueryClass();

const getInfoRoute = '/api/user/getInfo'

let existingEmail: string;
let hashedPassword: string;
let token: string;
test.before(async (t: any) => {
  
  const uuid = uuidv4();
  existingEmail = `${uuid}@gmail.com`

  const salt = await bcrypt.genSalt(10);
  hashedPassword = await bcrypt.hash("CorrectPassword123!", salt);

  await supabaseQuery.insert(supabase, 'User',{firstName: "Already", lastName:"Exists", 
  email:existingEmail, age: 30, password: hashedPassword});

  const{data, error}:any = await supabaseQuery.selectWhere(supabase,'User'
    ,'email',existingEmail,'id');

    if(error){
        t.fail("Inserting and selecting user failed!");
    }
    console.log(`data[0].id : ${data[0].id}`)
    token = createToken(data[0].id)
  
  if(error){
      t.fail(error);
  }
})

test.after(async(t: any) => {
  await supabaseQuery.deleteFrom(supabase, 'User', 'email', existingEmail);
})

test("GET /api/user/getInfo with no fields", async (t: any) => {
    const response = await request(app)
   .get(getInfoRoute)
   .set("authorization", token)
   .send({});
 
   console.log(`response: ${JSON.stringify(response)}`)
   t.true(response.status === 400)
   t.true(response.headers['content-type'] === "application/json; charset=utf-8")
   t.true(JSON.stringify(response.body) === JSON.stringify({mssg: 'Email must be provided'}));
 })

 
 test("GET /api/user/getInfo with existing user", async (t: any) => {
    const randomEmail = `${uuidv4()}@gmail.com`
    const response = await request(app)
   .get(getInfoRoute)
   .set({"authorization": token, "email": existingEmail})
    const expectedResponse = JSON.stringify({
        "firstName": "Already",
        "lastName": "Exists",
        "email": existingEmail,
        "age": 30
        })
   t.true(response.status === 200)
   t.true(response.headers['content-type'] === "application/json; charset=utf-8")
   console.log(`response.body: ${JSON.stringify(response.body)}`)
   t.true(JSON.stringify(response.body['user']) === expectedResponse);
})

