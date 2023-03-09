const test = require('ava');
import { Request, Response } from 'express';
const sinon = require('sinon');
import { loginUser } from '../../../../routes/User/authentication.controller';
import {v4 as uuidv4} from 'uuid';
const bcrypt = require('bcrypt');
import supabase from '../../../../utils/supabaseSetUp';
import { supabaseQueryClass } from '../../../../utils/databaseInterface';
import { createHashedPassword } from '../../../../utils/userFunctions';
const supabaseQuery = new supabaseQueryClass();

let randomEmail:string;

test.before(async (t : any) => {
    const uuid = uuidv4();
    randomEmail = `${uuid}@gmail.com`
    
    const hashedPassword = await createHashedPassword("CorrectPassword123!")
    const {data, error}:any = await supabaseQuery.insert(supabase, 'User',{firstName: "firstName", lastName:"lastName", 
    email:randomEmail, password: hashedPassword});
    
    if(error){
        t.fail()
    }
})

test.after(async() => {
    await supabaseQuery.deleteFrom(supabase, 'User', 'email', randomEmail);
})

const mockResponse = () => {
    let res: any = {};
    res.status = sinon.stub().returns(res);
    res.json = sinon.stub().returns(res);
    return res;
  };

  const mockRequest = (sessionData : any) => {
    return {
      body: sessionData,
    };
  };
  
  test("Login with missing email", async (t: any) => {
            
    console.log("In Login with missing email")
    const req = mockRequest({password: "Password123"});
    const res = mockResponse();
            
            await loginUser(req as Request, res as Response)

            t.true(res.status.calledWith(400))
            t.true(res.json.calledWith({mssg: 'All Fields Must Be Filled'}));
        });


    test("Login with missing password", async (t: any) => {

        const req = mockRequest({email:"testemail@gmail.com"});
        const res = mockResponse();
    
        await loginUser(req as Request, res as Response)
        t.true(res.status.calledWith(400))
        t.true(res.json.calledWith({mssg: 'All Fields Must Be Filled'}));
});

    test("Login with missing password and email", async (t: any) => {
    
       const req = mockRequest({});
       const res = mockResponse();
        
        await loginUser(req as Request, res as Response)
        t.true(res.status.calledWith(400))
        t.true(res.json.calledWith({mssg: 'All Fields Must Be Filled'}));
    });
    

    test("Login with non-existent email results in incorrect email message", async (t: any) => {

            
        const req = mockRequest({
            email: `${uuidv4()}@gmail.com`,
            password:`CorrectPassword123!`
        });
        const res = mockResponse();

        await loginUser(req as Request, res as Response)


        t.true(res.status.calledWith(400))
        t.true(res.json.calledWith({mssg: 'Incorrect Email'}));

    });




test("Login with existent email but wrong password", async (t: any) => {

    const req = mockRequest({
                            email: randomEmail,
                             password:`WrongPassword123!`});
    const res = mockResponse();

   
    await loginUser(req as Request, res as Response)

    t.true(res.status.calledWith(400))
    t.true(res.json.calledWith({mssg: "Incorrect Password"}));
});

test("Login with correct email and correct password", async (t : any) => {
    

    const req = mockRequest({
        email: randomEmail,
         password:`CorrectPassword123!`});
    const res = mockResponse();

    await loginUser(req as Request, res as Response)

    const argsPassed = res.json.getCall(0).args[0];
    const expectation  = {
        firstName: "someFirstName", 
        email: "someEmail",
        token: "someToken",
        id: "someId",
        mssg:"someMessage"
    }
    
    t.true(res.status.calledWith(200))
    t.true(res.json.calledOnceWith(argsPassed))
    t.true(JSON.stringify(Object.keys(argsPassed))=== JSON.stringify(Object.keys(expectation)))
    t.true(Object.keys(argsPassed).length === 5)
    t.true(argsPassed.firstName == "firstName")
    t.true(argsPassed.email == randomEmail)
    t.true(argsPassed.mssg == "Successful Login")
    // // expect(resultJson.mssg).toEqual("Succesful Login");

});


    
    
