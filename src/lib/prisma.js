import { PrismaClient } from '@prisma/client'

// Instância única do Prisma Client reutilizada em toda a aplicação.
const prisma = new PrismaClient()

export default prisma
