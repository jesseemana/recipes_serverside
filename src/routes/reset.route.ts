import { Router } from 'express'
import passwordController from '../controllers/resetPassword'

const router = Router()

router.route('/').post(passwordController.sendLink)
router.route('/:id/:token').patch(passwordController.resetPassword)

export default router 
