import express, { Request, Response} from 'express';
import { body, validationResult } from 'express-validator';
import { BadRequestError } from '../errors/bad-request-error';
import { RequestValidationError } from '../errors/request-validation-error';
import { User } from '../models/user';
import { Password } from '../services/password';
import jwt from "jsonwebtoken";

const router = express.Router();

router.post('/api/users/signin',
[
    body('email')
      .isEmail()
      .withMessage("Email must be valid"),
    body('password')
      .trim()
      .notEmpty()
      .withMessage("password must be valid")
],
async (req: Request, res: Response)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        throw new RequestValidationError(errors.array());
    }
    const { email, password} = req.body;

    const existingUser = await User.findOne({email});

    if(!existingUser){
        throw new BadRequestError("invalid credentials");
    }
    
    const passwordMatch = await Password.compare(
        existingUser.password,
        password
    );
    if(!passwordMatch){
        throw new BadRequestError("invalid credentials");
    }

    //Generate jwt
    const userJwt = jwt.sign({
        id: existingUser.id,
        email: existingUser.email
      },
      // process.env.JWT_KEY!
      "asdf"
      );
  
      //Stored jwt in session
      req.session = {
        jwt : userJwt
      }
  
      res.status(200).send({existingUser});

});

export {router as signInRouter};