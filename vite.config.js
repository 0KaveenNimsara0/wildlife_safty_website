import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const env = { ...loadEnv(mode, process.cwd(), ''), ...process.env };
  if (env.DEPLOY_BUILD === 'true') {
    for (const key of ['VITE_API_BASE_URL', 'VITE_ML_URL']) {
      if (!env[key]?.startsWith('https://')) throw new Error(`${key} must be an HTTPS URL for deployment`);
    }
  }
  return { plugins: [react()] };
})
