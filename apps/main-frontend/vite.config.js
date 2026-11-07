import { appConfig } from '../../workspace.vite.js';
import { fileURLToPath } from 'node:url';
export default appConfig('main',fileURLToPath(new URL('.',import.meta.url)));
