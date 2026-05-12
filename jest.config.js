/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
    testEnvironment: 'node',
    roots: ['<rootDir>/src'],
    transform: {
        '^.+\\.tsx?$': [
            'ts-jest',
            {
                tsconfig: {
                    experimentalDecorators: true,
                    emitDecoratorMetadata: true,
                    esModuleInterop: true,
                },
            },
        ],
    },
};
