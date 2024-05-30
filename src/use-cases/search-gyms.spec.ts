import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { expect, describe, it, beforeEach, afterEach, vi } from 'vitest'
import { SearchGymUseUseCase } from './search-gyms'

let gymsRepository: InMemoryGymsRepository
let sut: SearchGymUseUseCase

describe('Search Gyms Use Case', () => {
    beforeEach(async () => {
        gymsRepository = new InMemoryGymsRepository()
        sut = new SearchGymUseUseCase(gymsRepository)
    })

    it('should be able to search for gyms', async () => {
        await gymsRepository.create({
            title: 'JavaScript Gym',
            description: null,
            phone: null,
            latitude: -26.2353357,
            longitude: -48.8309477
        })

        await gymsRepository.create({
            title: 'Typescript Gym',
            description: null,
            phone: null,
            latitude: -26.2353357,
            longitude: -48.8309477
        })

        const { gyms } = await sut.execute({
            query: 'JavaScript',
            page: 1
        })

        expect(gyms).toHaveLength(1)
        expect(gyms).toEqual([
            expect.objectContaining({ title: 'JavaScript Gym' }),
        ])
    })

    it('should be able to fetch paginated gyms search', async () => {
        for (let i = 1; i <= 22; i++) {
            await gymsRepository.create({
                title: `JavaScript Gym ${i}`,
                description: null,
                phone: null,
                latitude: -26.2353357,
                longitude: -48.8309477
            })
        }

        const { gyms } = await sut.execute({
            query: 'JavaScript',
            page: 2
        })

        expect(gyms).toHaveLength(2)
        expect(gyms).toEqual([
            expect.objectContaining({ title: 'JavaScript Gym 21' }),
            expect.objectContaining({ title: 'JavaScript Gym 22' }),
        ])
    })
})