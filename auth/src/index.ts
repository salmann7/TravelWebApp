import express from 'express';
import { json } from 'body-parser';
import "express-async-errors";
import mongoose from 'mongoose';
import cookieSession from 'cookie-session';
const cors = require('cors');

import { currentUserRouter } from './routes/current-user';
import { signInRouter } from './routes/signin';
import { signOutRouter } from './routes/signout';
import { signUpRouter } from './routes/signup';
import { errorHandler } from './middlewares/error-handler';
import { NotFoundError } from './errors/not-found-error';

const app = express();
app.use(cors());
app.set('trust proxy', true);
app.use( json() );
app.use( cookieSession({
    signed : false,
    secure : true
}));

app.use( currentUserRouter );
app.use( signInRouter );
app.use( signOutRouter );
app.use( signUpRouter );

app.all( '*', ()=>{
    throw new NotFoundError();
})

app.use( errorHandler );

const start = async ()=> {
    // if(!process.env.JWT_KEY){
    //     throw new Error("JWT Key must be defined")
    // }
    try{
        // await mongoose.connect( "mongodb://auth-mongo-srv:27017/auth");
        await mongoose.connect( "mongodb://localhost:27017/auth");
        console.log("connected to auth-mongo-db");
    } catch( err ){
        console.error(err);
    }

    app.listen( 3000, ()=>{
        console.log("Auth service listening on port 3000@@@@");
    });
    
}

start();


