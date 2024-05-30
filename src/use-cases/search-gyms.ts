import { Gym } from "@prisma/client";
import { GymsRepository } from "@/repositories/gym-repository";

interface SearchGymUseCaseRequest {
    query: string
    page: number
}

interface SearchGymUseCaseResponse {
    gyms: Gym[]
}

export class SearchGymUseUseCase {
    constructor(
        private gymsRepository: GymsRepository
    ){}

    async execute({ query, page }: SearchGymUseCaseRequest): Promise<SearchGymUseCaseResponse> {
        const gyms = await this.gymsRepository.searchMany(query,page)

        return {
            gyms   
        }
    }
}
