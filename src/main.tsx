import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import { QueryClientProvider } from '@tanstack/react-query'

import { queryClient } from '@/query'

import './main.css'
import { HomePage } from './pages/home/ui/HomePage'
import './shared/i18n'

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<QueryClientProvider client={queryClient}>
			<HomePage />
		</QueryClientProvider>
	</StrictMode>
)
