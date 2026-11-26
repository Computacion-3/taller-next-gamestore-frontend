import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    // Frontend (npm run dev / npm run start usan el puerto 3001).
    baseUrl: 'http://localhost:3001',
    specPattern: 'cypress/e2e/**/*.cy.ts',
    supportFile: 'cypress/support/e2e.ts',
    video: false,
    defaultCommandTimeout: 8000,
    expose: {
      // Backend NestJS. Para otro entorno: --expose apiUrl=https://mi-backend.com
      apiUrl: 'http://localhost:3000',
    },
  },
});
