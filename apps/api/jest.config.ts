export default {
    displayName: 'api',
    preset: '../../jest.preset.js',
    testEnvironment: 'node',
    transform: {
        '^.+\\.[tj]s$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.spec.json' }],
    },
    moduleFileExtensions: ['ts', 'js', 'html'],
    coverageDirectory: '../../coverage/apps/api',
    moduleNameMapper: {
        '^@prisma/client$': '<rootDir>/src/__mocks__/@prisma/client.ts',
        '^@db/output/generated/prisma$': '<rootDir>/src/__mocks__/@db/output/generated/prisma.ts',
    },
    collectCoverageFrom: [
        '<rootDir>/src/**/*.controller.ts',
        '<rootDir>/src/**/*.service.ts',
        '!<rootDir>/src/prisma/prisma.service.ts',
        '!**/*.spec.ts',
    ],
    coverageThreshold: {
        global: {
            statements: 85,
            branches: 60,
            functions: 80,
            lines: 85,
        },
    },
};
