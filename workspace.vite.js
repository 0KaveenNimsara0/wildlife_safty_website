import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'node:url';
const workspace = fileURLToPath(new URL('.', import.meta.url));
export function appConfig(kind, appRoot) {
 return defineConfig(({ mode }) => {
  const env = { ...loadEnv(mode, workspace, ''), ...loadEnv(mode, appRoot, ''), ...process.env, VITE_APP_KIND: kind };
  if (env.DEPLOY_BUILD === 'true') for (const key of ['VITE_API_BASE_URL','VITE_MAIN_APP_URL','VITE_ADMIN_APP_URL', ...(kind === 'main' ? ['VITE_ML_URL'] : [])]) {
   if (!env[key]?.startsWith('https://')) throw new Error(`${key} must be an HTTPS deployment URL`);
  }
  return { root: appRoot, plugins: [react()], publicDir: workspace + 'public',
   define: Object.fromEntries(Object.entries(env).filter(([key]) => key.startsWith('VITE_')).map(([key,value]) => [`import.meta.env.${key}`,JSON.stringify(value)])),
   server: { port: kind === 'admin' ? 5174 : 5173, strictPort: true, fs: { allow: [workspace] } },
   build: { outDir: 'dist', emptyOutDir: true, manifest: true } };
 });
}
