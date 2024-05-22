import { CheckIn } from "@prisma/client";
import { InvalidCredentialsError } from "./errors/invalid-credentials-error";
import { compare } from "bcryptjs";
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

        const checkIn = await this.checkinsRepository.create({
           gym_id: gymId,
           user_id: userId 
        })

        return {
            checkIn,
        }
    }
}
