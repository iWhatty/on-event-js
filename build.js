// build.js
import { build } from 'esbuild'
import { mkdir, copyFile } from 'fs/promises'
import { dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

async function run() {
  try {
    // Ensure dist folder exists
    await mkdir('dist', { recursive: true })

    // Build JS bundle
    await build({
      entryPoints: ['src/on-events.js'],
      outfile: 'dist/on-events.min.js',
      bundle: true,
      splitting: false,
      legalComments: 'none',
      minify: true,
      format: 'esm',
      target: ['es2020'],
      sourcemap: 'external',
      platform: 'browser',
      banner: {
        js: `// On-Events - A tiny DOM event utility with sugar.`
      }
    })

    // Copy type definitions
    await copyFile(
      'src/on-events.d.ts',
      'dist/on-events.d.ts'
    )

    console.log('✅ Build complete')
  } catch (err) {
    console.error('❌ Build failed:', err)
    process.exit(1)
  }
}

run()