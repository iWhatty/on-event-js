// vitest.config.js
import { defineConfig } from 'vitest/config'

export default defineConfig({
    test: {
        environment: 'jsdom',
        globals: true,
        include: ['Testing/**/*.test.js']
    }
})