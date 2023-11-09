import { Router } from 'express'
import { sendLinkHandler, resetPasswordHandler } from '../controllers/reset-auth.controller'
import validateInput from '../middleware/validateInput'
import { resetAuthSchema } from '../schema/reset.schema'

const router = Router()

router.post('/', sendLinkHandler)
router.patch('/:id/:token', validateInput(resetAuthSchema), resetPasswordHandler)

export default router 
