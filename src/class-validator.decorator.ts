import { InternalServerErrorException } from "@nestjs/common";
import { ClassConstructor, plainToInstance } from "class-transformer";
import { validate } from "class-validator";

/**
 *  Usage:
 *  Add the 'ValidateResponse' decorator above a method and pass a DTO class as argument.
 *  The validation decorator will throw an internal error if the data is unexpected, otherwise it will return a deserialized version of the DTO.
 *  For example: @ValidateResponse(CatDto)
 */

async function validateAll(deserializedData: object[]) {
    /** Validate all items and collect errors */
    return (
        await Promise.all(
            deserializedData.map(async (item) => {
                return await validate(item);
            })
        )
    ).filter((errors) => errors.length);
}

export function ValidateResponse<T extends object>(
    schema: ClassConstructor<T>
) {
    return (
        target: object,
        propertyKey: string,
        descriptor: PropertyDescriptor
    ) => {
        const method = descriptor.value;

        descriptor.value = async (...args) => {
            const methodResponse = await method.call(this, ...args);

            // Deserialize returned JSON
            const deserializedData: object | object[] = plainToInstance(
                schema,
                methodResponse
            );

            // Always pass the DTO JSON as an array to the 'validateAll' function.
            const errors = await validateAll(
                Array.isArray(deserializedData)
                    ? deserializedData
                    : [deserializedData]
            );

            // If validation errors are present, throw an exception and add the validation errors as message.
            if (errors.length) {
                throw new InternalServerErrorException(errors);
            }

            return deserializedData;
        };
    };
}
