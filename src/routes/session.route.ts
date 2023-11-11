import { Router } from 'express'
import { findSessionsHandler, deleteAllSessionsHandler } from '../controllers/sessions.controller'

const router = Router()

router.route('/')
    .get(findSessionsHandler)
    .delete(deleteAllSessionsHandler)

export default router
