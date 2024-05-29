import { CheckIn } from "@prisma/client";
import { CheckInsRepository } from "@/repositories/check-ins-repository";
import { GymsRepository } from "@/repositories/gym-repository";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";
import { getDistanceBetweenCoordinates } from "@/utils/get-distance-between-coordinates";
import { MaxNumberOfCheckInsError } from "./errors/max-nunber-of-check-ins-error";
import { MaxDistanceError } from "./errors/max-distance-error";

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

    async execute({ userId, gymId , userLatitude, userLongitude}: CheckinUseCaseRequest): Promise<CheckinUseCaseResponse> {
        const gym = await this.gymsRepository.findById(gymId)

        if (!gym) {
            throw new ResourceNotFoundError()
        }

        const distance = getDistanceBetweenCoordinates(
            { latitude: userLatitude, longitude: userLongitude }, 
            { latitude: gym.latitude.toNumber(), longitude: gym.longitude.toNumber() }
        )

        const MAX_DISTANCE_IN_KILOMETERS = 0.1

        if (distance > MAX_DISTANCE_IN_KILOMETERS) {
            throw new MaxDistanceError()
        }

        const checkInOnSameDay = await this.checkinsRepository.findByUserIdOnDate(
            userId,
            new Date()
        )

        if (checkInOnSameDay) {
            throw new MaxNumberOfCheckInsError()
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
