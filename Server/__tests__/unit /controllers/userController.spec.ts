require('dotenv').config();
import server from '../../../server';
const request = require('supertest')
import { Request, Response } from 'express';
import { createToken, loginUser, signupUser } from '../../../controllers/userController';
const jwt = require('jsonwebtoken');
import {v4 as uuidv4} from 'uuid';
import { response } from 'express';
import { R } from 'chart.js/dist/chunks/helpers.core';
import { after } from 'node:test';
import supabase from '../../../utils/supabaseSetUp';
import { supabaseQueryClass } from '../../../utils/databaseInterface';
const supabaseQuery = new supabaseQueryClass();
//test createJWToken, then verify with correct and incorrect secret
describe('testing createToken',() => {

    test('createToken results in legitimate token',() => {

         const uuid = uuidv4();
         const token = createToken(uuid);
         
         try{
            //if jwt doesn't verify, it throws an error
            const decodedToken = jwt.verify(token, process.env.JWTSECRET)
            expect(decodedToken.id).toBe(uuid); //token payload
         }
         catch(err){
            fail(err)
         }
    })

    test('createToken with incorrect secret results in illegitimate token ',() => {
        const uuid = uuidv4();
        const secret = uuidv4();
        const token = createToken(uuid, secret);
        
        expect(() => 
        {jwt.verify(token, process.env.JWTSECRET)}
        ).toThrow();
    })
})


//test login
//test with no email
//test with no password
//test with no password and no email

describe("login form with missing fields", () => {
	
	let mockRequest: Partial<Request>;
	let mockResponse: Partial<Response>;

	let resultJson = {};
	let resultStatus = {};

    afterEach(() => 
    {server.close()})
	beforeEach( () => {

        mockRequest = {};
		mockResponse = {};

		resultJson = {};
		resultStatus = {};

        mockResponse = {
            status : jest.fn().mockImplementation((result) => {
                resultStatus = result;
                return mockResponse;
            }),
            json: jest.fn().mockImplementation((result) => {
                resultJson = result;
                return mockResponse;
            })

        }
        
	});

	test("Login with missing email", async () => {

        mockRequest = {
            body:{password:"Password123"}

        };
        
        await loginUser(mockRequest as Request, mockResponse as Response)
		expect(resultStatus).toBe(400);
		// when the res.json is called we expect it to have the body json from the controller
		expect(resultJson).toEqual({mssg: "All Fields Must Be Filled"});
	});

    test("Login with missing password", async () => {
       
        mockRequest = {
            body:{email:"testemail@gmail.com"}

        };
        
        await loginUser(mockRequest as Request, mockResponse as Response)
		expect(resultStatus).toBe(400);
		// when the res.json is called we expect it to have the body json from the controller
		expect(resultJson).toEqual({mssg: "All Fields Must Be Filled"});
	});

    test("Login with missing password and email", async () => {
      
        mockRequest = {
            body:{}

        };
        
        await loginUser(mockRequest as Request, mockResponse as Response)
		expect(resultStatus).toBe(400);
		// when the res.json is called we expect it to have the body json from the controller
		expect(resultJson).toEqual({mssg: "All Fields Must Be Filled"});
	});

    test("Login with missing password and email", async () => {
      
        mockRequest = {
            body:{}

        };
        
        await loginUser(mockRequest as Request, mockResponse as Response)
		expect(resultStatus).toBe(400);
		// when the res.json is called we expect it to have the body json from the controller
		expect(resultJson).toEqual({mssg: "All Fields Must Be Filled"});
	});

    describe("Login with non-existent email", () => {
            test("non-existent email results in incorrect email message", async () => {

                mockRequest = {
                    body:{
                        email: `${uuidv4()}@gmail.com`,
                        password:`Password123`
                    }

                };

                await loginUser(mockRequest as Request, mockResponse as Response)

                expect(resultStatus).toBe(400);
                // when the res.json is called we expect it to have the body json from the controller
                expect(resultJson).toEqual({mssg: "Incorrect Email"});

            });
        })


    describe("Login Form with correct email but wrong and correct passwords", () => {

                    let randomEmail:string;

            beforeAll(async () => {
                const uuid = uuidv4();
                randomEmail = `${uuid}@gmail.com`
                console.log(`randomEmail: ${randomEmail}`)
                const {data, error}:any = await supabaseQuery.insert(supabase, 'User',{firstName: "TEST", lastName:"TEST", 
                email:randomEmail, password:"CorrectPassword123!" });
                
                if(error){
                    fail(error);
                }
            })

            
            test("Login with existent email but wrong password", async () => {

                mockRequest = {
                    body:{
                        email: randomEmail,
                        password:`WrongPassword123!`
                    }

                };

                await loginUser(mockRequest as Request, mockResponse as Response)
                expect(resultStatus).toBe(400);
                // when the res.json is called we expect it to have the body json from the controller
                expect(resultJson).toEqual({mssg: "Incorrect Password"});
            });

            afterAll(async() => {
                await supabaseQuery.deleteFrom(supabase, 'User', 'email', randomEmail);

            })


    })
})

//test with email that doesn't exist in database
//test with correct email, but wrong password
//test with correct email, but correct password
//test with wrong email, but correct password




//test signup
//test with no email/password/age/firstName/lastName
//test with bad emails
//test with bad names (eg. numbers)
//test with bad passwords
//test with already existing email
//test with correct details



//get user
//test with existing user in db
//test with non-existent user in db
//test with non-existent user in db
