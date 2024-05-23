import { CheckIn } from "@prisma/client";
import { CheckInsRepository } from "@/repositories/check-ins-repository";

interface CheckinUseCaseRequest {
    userId: string
    gymId: string
}

interface CheckinUseCaseResponse {
    checkIn: CheckIn
}

export class CheckinUseCase {
    constructor(
        private checkinsRepository: CheckInsRepository
    ){}

    async execute({ userId, gymId }: CheckinUseCaseRequest): Promise<CheckinUseCaseResponse> {
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
