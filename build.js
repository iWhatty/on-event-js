// build.js
import { build } from 'esbuild';

build({
  entryPoints: ['src/on-event.js'],       // Your main entry point
  outfile: 'dist/on-event.min.js', // Output destination
  bundle: true,
  minify: true,
  format: 'esm',
  target: ['es2020'],
  sourcemap: true,
  platform: 'browser',
  banner: {
    js: `// On-Event - A tiny DOM event utility with sugar.`
  }
}).then(() => {
  console.log('✅ Build complete');
}).catch((err) => {
  console.error('❌ Build failed:', err);
  process.exit(1);
});
