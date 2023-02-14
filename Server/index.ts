//Configuration
import { Request, Response } from 'express';

import { request } from 'http';

const express = require('express');
const app = express();

const cors = require('cors');
app.use(cors());

const supabase = require('../dist/utils/supabaseSetUp.js');
const supabaseQueryClass = require('../dist/utils/databaseInterface.js');
const supabaseQuery = new supabaseQueryClass();

/**---------------- Routes Start--------------- */
//HomePage Route
app.get('/', (req: Request, res: Response) => {
    res.send('Homepage');
});

//Authentication Routes
const authRouter = require('../routes/authentication.js');
app.use('/api/user', authRouter);

//Change Profile Details Routes
const changeProfileDetailsRouter = require('../routes/changeProfileDetails.js');
app.use('/api/user', changeProfileDetailsRouter);

//Get User Details Routes
const getUserInfo = require('../routes/getUserInfo.js');
app.use('/api/user', getUserInfo);

/**---------------- Routes End------------------ */

export default app;
