import { Request, Response } from 'express'
import { deleteAllSessions, findAllSessions } from '../services/auth.service'

export async function findSessionsHandler(req: Request, res: Response) {
  const allsessions = await findAllSessions()

  res.status(200).send(allsessions)
}

export async function deleteAllSessionsHandler(req: Request, res: Response) {
  await deleteAllSessions()

  res.status(200).send('Sessions deleted')
}
