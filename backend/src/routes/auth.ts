
import express, {type Request, type Response} from 'express'
import {body, validationResult } from 'express-validator'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

import prisma from '../libs/db'
import {validateToken} from '../middlewares/auth'

const router = express.Router()

router.post("/register", [
    body("email")
      .trim()
      .notEmpty().withMessage("Email is required.")
      .isEmail().withMessage("Invalid email address format."),
    body("password")
      .notEmpty().withMessage("Password is required.")
      .isLength({min: 6, max: 64}).withMessage("Password must be between 6 and 64 characters long.")
  ], async (req: Request, res: Response) => {

    const errors = validationResult(req)

    if (!errors.isEmpty()) {
      return res.status(400).json({errors: errors.array()})
    }

    const {email, password} = req.body

    try {

      let user = await prisma.user.findUnique({
        where: {
          email
        }
      })

      if (user) {
        return res.status(400).json({error: "User already exists."})
      }

      const hashedPassword = await bcrypt.hash(password, 13)

      user = await prisma.user.create({
        data: {
          email,
          password: hashedPassword
        }
      })

      const token = jwt.sign(
        {userId: user.id}, 
        process.env.JWT_SECRET_KEY as string,
        {expiresIn: "1d"}
      )

      res.cookie(
        "auth_token", 
        token, 
        {
          httpOnly: true, 
          secure: process.env.NODE_ENV === "production", 
          maxAge: 86400000
        }
      )

      return res.status(200).json({success: true})
    }

    catch(err: any) {
      console.error('Error creating user:', err)
      return res.status(500).json({ message: 'Internal server error' })
    }


})


router.post("/sign-in", [
    body("email")
      .notEmpty().withMessage("Email is required.")
      .isEmail().withMessage("Invalid email address format."),
    body("password")
      .notEmpty().withMessage("Password is required.")
  ], async (req: Request, res: Response) => {

     const errors = validationResult(req)

     if (!errors.isEmpty()) {
       return res.status(400).json({errors: errors.array()})
     }

     const {email, password} = req.body

     try {

       const user = await prisma.user.findUnique({
        where: {
          email
        }
       })

       if (!user) {
         return res.status(400).json({error: "Invalid Credentials."})
       }

       const isPasswordMatch = await bcrypt.compare(password, user.password)

       if (!isPasswordMatch) {
         return res.status(400).json({error: "Invalid Credentials."})
       }

       const token = jwt.sign(
        {userId: user.id}, 
        process.env.JWT_SECRET_KEY as string,
        {expiresIn: "1d"}
      )

       res.cookie(
        "auth_token", 
        token, 
        {
          httpOnly: true, 
          secure: process.env.NODE_ENV === "production", 
          maxAge: 86400000
        }
      )

      return res.status(200).json({userId: user.id})

     }

     catch(err: any) {
      console.error('Error signing in user', err)
      return res.status(500).json({ message: 'Internal server error' })
    }
})


router.post("/sign-out", async (req: Request, res: Response) => {
  res.cookie("auth_token", "", {
    httpOnly: true,
    maxAge: 0
  })

  res.send()
})


router.get("/verify-token", validateToken, async (req: Request, res: Response) => {
  res.status(200).json({userId: req.userId})
})


export default router