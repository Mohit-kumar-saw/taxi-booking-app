import { PrismaClient } from '@prisma/client'

const prismadb = global as any

const client = () => {
  if (!prismadb.prisma) {
    prismadb.prisma = new PrismaClient()
  }
  return prismadb.prisma
}

export default client()
