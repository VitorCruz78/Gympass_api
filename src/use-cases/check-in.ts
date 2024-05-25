import { CheckIn } from "@prisma/client";
import { CheckInsRepository } from "@/repositories/check-ins-repository";
import { GymsRepository } from "@/repositories/gym-repository";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";

interface CheckinUseCaseRequest {
    userId: string
    gymId: string
    userLatitude: number
    userLongitude: number
}

interface CheckinUseCaseResponse {
    checkIn: CheckIn
}

export class CheckinUseCase {
    constructor(
        private checkinsRepository: CheckInsRepository,
        private gymsRepository: GymsRepository
    ){}

    async execute({ userId, gymId }: CheckinUseCaseRequest): Promise<CheckinUseCaseResponse> {
        const gym = await this.gymsRepository.findById(gymId)

        if (!gym) {
            throw new ResourceNotFoundError()
        }

        // calculate distance between user and gym

        const checkInOnSameDay = await this.checkinsRepository.findByUserIdOnDate(
            userId,
            new Date()
        )

        if (checkInOnSameDay) {
            throw new Error()
        }

        const checkIn = await this.checkinsRepository.create({
           gym_id: gymId,
           user_id: userId 
        })

        return {
            checkIn,
        }
    }
}
