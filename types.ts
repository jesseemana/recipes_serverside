export type SMTP = {
  user: string
  pass: string
  port: string
  host: string
  secure: boolean
}

export type Database = {
  connect: () => void
  disconnect: () => void
}
