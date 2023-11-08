import { Router } from 'express'
import { sendLinkHandler, resetPasswordHandler } from '../controllers/reset-auth.controller'

const router = Router()

router.route('/').post(sendLinkHandler)
router.route('/:id/:token').patch(resetPasswordHandler)

export default router 
