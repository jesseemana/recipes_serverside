import { Router } from 'express'
import { findSessionsHandler, deleteAllSessionsHandler } from '../controllers/sessions.controller'
import requireuser from '../middleware/require-user'

const router = Router()

router.route('/')
    .get(requireuser, findSessionsHandler)
    .delete(requireuser, deleteAllSessionsHandler)

export default router
