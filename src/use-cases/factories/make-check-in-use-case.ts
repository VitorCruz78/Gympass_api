import { PrismaGymsRepository } from "@/repositories/prisma/prisma-gysm-repository"
import { CheckinUseCase } from "../check-in"
import { PrismaCheckInsRepository } from "@/repositories/prisma/prisma=check-ins-repository"

export function makeCheckInUseCase() {
    const checkInsRepository = new PrismaCheckInsRepository()
    const gymsRepository = new PrismaGymsRepository()

    const useCase = new CheckinUseCase(checkInsRepository, gymsRepository)

    return useCase
}