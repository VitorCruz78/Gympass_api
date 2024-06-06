import { PrismaGymsRepository } from "@/repositories/prisma/prisma-gysm-repository"
import { SearchGymUseUseCase } from "../search-gyms"

export function makeSearchGymsUseCase() {
    const gymsRepository = new PrismaGymsRepository()
    const useCase = new SearchGymUseUseCase(gymsRepository)

    return useCase
}