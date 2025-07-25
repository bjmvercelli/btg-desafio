const esbuild = require('esbuild');

const isDev = process.env.NODE_ENV === 'development';

esbuild.build({
  entryPoints: ['src/index.ts'],
  bundle: true,
  platform: 'node',
  target: 'node18',
  outfile: 'dist/index.js',
  external: [
    'express',
    'cors',
    'helmet',
    'dotenv',
    'path',
    'fs',
    'sqlite3',
    'uuid',
    'winston',
    'joi',
    'swagger-jsdoc',
    'swagger-ui-express'
  ],
  sourcemap: isDev,
  minify: !isDev,
  format: 'cjs',
  logLevel: 'info',
}).catch(() => process.exit(1)); 