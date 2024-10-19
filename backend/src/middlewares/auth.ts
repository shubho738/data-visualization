
import {type Request, type Response, type NextFunction} from 'express'
import jwt, {type JwtPayload} from 'jsonwebtoken'

declare global {
  namespace Express {
    interface Request {
      userId: string;
    }
  }
}

export const validateToken = async (req: Request, res: Response, next: NextFunction) => {

  const token = req.cookies["auth_token"]

  if (!token) {
    return res.status(401).json({error: "Unauthorized: Token missing"})
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY as string)
    req.userId = (decoded as JwtPayload).userId
    next()
  }

  catch(err) {
    res.status(401).json({error: "Unauthorized"})
  }

}