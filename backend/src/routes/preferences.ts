
import { Router, Request, Response } from 'express'

import { validateToken } from '../middlewares/auth'

const router = Router()


router.post('/', validateToken, (req: Request, res: Response) => {
  const { filters, dateRange } = req.body


  const preferences = {
    filters,
    dateRange,
  }

  
  res.cookie('preferences', JSON.stringify(preferences), {
    maxAge: 604800000, 
    httpOnly: true,
  })

  return res.status(200).json({ message: 'Preferences saved successfully' })
})


router.get('/', validateToken, (req: Request, res: Response) => {
  const preferencesCookie = req.cookies.preferences

  if (!preferencesCookie) {
    return res.status(404).json({ message: 'Preferences not found' })
  }


  const preferences = JSON.parse(preferencesCookie)

  return res.status(200).json({ preferences })
})


router.delete('/', validateToken, (req: Request, res: Response) => {
  
  res.clearCookie('preferences')

  return res.status(200).json({ message: 'Preferences deleted successfully' })
})

export default router
