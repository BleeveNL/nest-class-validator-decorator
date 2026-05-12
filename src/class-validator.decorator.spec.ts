import 'reflect-metadata';
import { InternalServerErrorException } from '@nestjs/common';
import { IsNumber, IsString } from 'class-validator';
import { ValidateResponse } from './class-validator.decorator';

class UserDto {
    @IsString()
    name!: string;

    @IsNumber()
    age!: number;
}

class Service {
    @ValidateResponse(UserDto)
    async getUser(data: unknown) {
        return data;
    }

    @ValidateResponse(UserDto)
    async getUsers(data: unknown) {
        return data;
    }
}

const service = new Service();

describe('ValidateResponse', () => {
    describe('single object', () => {
        it('returns deserialized DTO when data is valid', async () => {
            const result = await service.getUser({ name: 'Alice', age: 30 });
            expect(result).toBeInstanceOf(UserDto);
            expect(result).toMatchObject({ name: 'Alice', age: 30 });
        });

        it('throws InternalServerErrorException when a required field is missing', async () => {
            await expect(service.getUser({ age: 30 })).rejects.toThrow(
                InternalServerErrorException
            );
        });

        it('throws InternalServerErrorException when a field has the wrong type', async () => {
            await expect(
                service.getUser({ name: 123, age: 'not-a-number' })
            ).rejects.toThrow(InternalServerErrorException);
        });
    });

    describe('array of objects', () => {
        it('returns an array of deserialized DTOs when all items are valid', async () => {
            const result = await service.getUsers([
                { name: 'Alice', age: 30 },
                { name: 'Bob', age: 25 },
            ]);
            expect(Array.isArray(result)).toBe(true);
            expect(result).toHaveLength(2);
            (result as UserDto[]).forEach((item) =>
                expect(item).toBeInstanceOf(UserDto)
            );
        });

        it('throws InternalServerErrorException when any item in the array is invalid', async () => {
            await expect(
                service.getUsers([
                    { name: 'Alice', age: 30 },
                    { name: 'Bob' },
                ])
            ).rejects.toThrow(InternalServerErrorException);
        });
    });

    describe('null / undefined handling', () => {
        it('returns null without throwing', async () => {
            await expect(service.getUser(null)).resolves.toBeNull();
        });

        it('returns undefined without throwing', async () => {
            await expect(service.getUser(undefined)).resolves.toBeUndefined();
        });
    });
});
