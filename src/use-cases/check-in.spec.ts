import { expect, describe, it, beforeEach, afterEach, vi } from 'vitest'
import { InMemoryCheckInRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { CheckinUseCase } from './check-in'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { Decimal } from '@prisma/client/runtime/library'

let checkInsRepository: InMemoryCheckInRepository
let gymsRepository: InMemoryGymsRepository
let sut: CheckinUseCase

describe('Check-In Use Case', () => {
    beforeEach(() => {
        checkInsRepository = new InMemoryCheckInRepository()
        gymsRepository = new InMemoryGymsRepository()
        sut = new CheckinUseCase(checkInsRepository, gymsRepository)

        gymsRepository.items.push({
            id: 'gym-01',
            title: 'Javascript Gym',
            description: '',
            phone: '',
            latitude: new Decimal(-26.2353357),
            longitude: new Decimal(-48.8309477)
        })

        vi.useFakeTimers()
    })

    afterEach(() => {
        vi.useRealTimers()
    })

    it('should be able to check in', async () => {
        const { checkIn } = await sut.execute({
            gymId: 'gym-01',
            userId: 'user-01',
            userLatitude: -26.2353357,
            userLongitude: -48.8309477
        })

        expect(checkIn.id).toEqual(expect.any(String))
    })

    it('should not be able to check in twice in the same day', async () => {
        vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0))

        await sut.execute({
            gymId: 'gym-01',
            userId: 'user-01',
            userLatitude: -26.2353357,
            userLongitude: -48.8309477
        })

        await expect(() => sut.execute({
            gymId: 'gym-01',
            userId: 'user-01',
            userLatitude: -26.2353357,
            userLongitude: -48.8309477
        })).rejects.toBeInstanceOf(Error)
    })

    it('should not be able to check in twice in the same day', async () => {
        vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0))

        await sut.execute({
            gymId: 'gym-01',
            userId: 'user-01',
            userLatitude: -26.2353357,
            userLongitude: -48.8309477
        })

        await expect(() => sut.execute({
            gymId: 'gym-01',
            userId: 'user-01',
            userLatitude: -26.2353357,
            userLongitude: -48.8309477
        })).rejects.toBeInstanceOf(Error)
    })

    it('should be able to check in twice but in different days', async () => {
        vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0))

        await sut.execute({
            gymId: 'gym-01',
            userId: 'user-01',
            userLatitude: -26.2353357,
            userLongitude: -48.8309477
        })

        vi.setSystemTime(new Date(2022, 0, 21, 8, 0, 0))

        const { checkIn } = await sut.execute({
            gymId: 'gym-01',
            userId: 'user-01',
            userLatitude: -26.2353357,
            userLongitude: -48.8309477
        })

        expect(checkIn.id).toEqual(expect.any(String))
    })

    it('should not be able to check in on distant gym', async () => {
        gymsRepository.items.push({
            id: 'gym-02',
            title: 'Javascript Gym',
            description: '',
            phone: '',
            latitude: new Decimal(-26.21449),
            longitude: new Decimal(-48.8185042)
        })
        
        await expect(() =>
        sut.execute({
            gymId: 'gym-02',
            userId: 'user-01',
            userLatitude: -26.2353357,
            userLongitude: -48.8309477
        })).rejects.toBeInstanceOf(Error)
    })
})