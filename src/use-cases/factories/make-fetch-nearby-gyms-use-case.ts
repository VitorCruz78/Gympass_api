import { PrismaGymsRepository } from "@/repositories/prisma/prisma-gysm-repository"
import { FecthNearbyGymsUseUseCase } from "../fetch-nearby-gyms"

export function makeFetchNearbyGymsUseCase() {
    const gymsRepository = new PrismaGymsRepository()
    const useCase = new FecthNearbyGymsUseUseCase(gymsRepository)

    return useCase
}