import express, { type Request, type Response } from 'express'

import prisma from '../libs/db'
import { validateToken } from '../middlewares/auth'

const router = express.Router()

router.get('/', validateToken, async (req: Request, res: Response) => {
  const { startDate, endDate, age, gender } = req.query

  if (!startDate || !endDate) {
    return res.status(400).json({ message: 'Start date and end date are required' })
  }

  try {
  
    const parsedStartDate = new Date(startDate as string)
    const parsedEndDate = new Date(endDate as string)

    if (isNaN(parsedStartDate.getTime()) || isNaN(parsedEndDate.getTime())) {
      return res.status(400).json({ message: 'Invalid date format' })
    }

    const data = await prisma.data.findMany({
      where: {
        date: {
          gte: parsedStartDate,
          lte: parsedEndDate,
        },
        age: age ? String(age) : undefined,
        gender: gender ? String(gender) : undefined,
      },
    })

    return res.json(data)
  } 
  
  catch (err) {
    console.error('Error fetching data:', err)
    return res.status(500).json({ message: 'Internal server error' })
  }
})

export default router
