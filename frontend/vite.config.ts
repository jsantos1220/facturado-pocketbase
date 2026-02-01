import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
	plugins: [react()],
	resolve: {
		alias: {
			'@api': path.resolve(__dirname, './src/api'),
			'@images': path.resolve(__dirname, './src/images'),
			'@assets': path.resolve(__dirname, './src/assets'),
			'@components': path.resolve(__dirname, './src/components'),
			'@context': path.resolve(__dirname, './src/context'),
			'@lib': path.resolve(__dirname, './src/lib'),
			'@pages': path.resolve(__dirname, './src/pages'),
			'@styles': path.resolve(__dirname, './src/styles'),
			'@utils': path.resolve(__dirname, './src/utils'),
		},
	},
	build: {
		minify: true,
		rollupOptions: {
			//input: {
			//   index: 'src/index.js',
			//   adminJs: 'src/js/admin.js',
			//   bootstrapJS: 'src/js/bootstrap.js',
			//   estilos: 'src/css/estilos.scss',
			//   adminCss: 'src/css/admin.scss',
			//   bootstrapCSS: 'src/css/bootstrap.css',
			//},
			//output: {
			//	entryFileNames: `assets/[name].js`,
			//	chunkFileNames: `assets/[name].js`,
			//	assetFileNames: `assets/[name].[ext]`,
			//},
		},
	},
	define: {
		// Polyfill global para Buffer
		global: 'globalThis',
	},
	optimizeDeps: {
		esbuildOptions: {
			define: {
				global: 'globalThis',
			},
		},
	},
})
