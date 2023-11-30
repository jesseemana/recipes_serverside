import { AnyZodObject } from'zod'
import { NextFunction, Response, Request } from 'express'

const validateInput = (schema: AnyZodObject) => (req: Request, res: Response, next: NextFunction) => {
  try {
    schema.parse({
      body: req.body,
      query: req.query,
      params: req.params,
    })
    next()
  } catch (err: any) {
    res.status(400).send(err.errors)
  }
}

export default validateInput  
