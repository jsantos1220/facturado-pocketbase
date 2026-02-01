import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './styles/main.scss'
import { Buffer } from 'buffer'

// Polyfill para Buffer en el navegador
window.Buffer = Buffer

createRoot(document.getElementById('root')!).render(
	//<StrictMode>
	//</StrictMode>
	<App />,
)
