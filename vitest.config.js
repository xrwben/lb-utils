import { defineConfig } from 'vitest/config'

export default defineConfig({
    test: {
        include: ['**/*.{test,spec}.?(c|m)[jt]s?(x)'],
        globals: true,
        environment: 'node',
        coverage: {
            enabled: true,
            reporter: ['text', 'json', 'html'],
            provider: 'istanbul' // or 'v8'
        }
    }
})
