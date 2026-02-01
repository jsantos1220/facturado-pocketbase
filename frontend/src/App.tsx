import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router'
import ProtectedRoute from './routes/ProtectedRoute'
import { Fragment, useEffect } from 'react'
import { privateRoutes, publicRoutes } from './routes/Routes'
import Sidebar from '@components/templates/Sidebar'
import styled, { ThemeProvider } from 'styled-components'
import theme from '@styles/themes'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import useAuthStore from '@context/authContext'

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			retry: 0,
			refetchOnWindowFocus: false,
			refetchOnReconnect: false,
		},
	},
})

function App() {
	//Asigna usuario en localstore a zustand
	const init = useAuthStore(s => s.init)

	useEffect(() => {
		init()
	}, [])

	return (
		<QueryClientProvider client={queryClient}>
			<ThemeProvider theme={theme}>
				<Router>
					<Routes>
						{publicRoutes.map((route, idx) => (
							<Route
								path={route.path}
								element={<Fragment>{route.component}</Fragment>}
								key={idx}
							/>
						))}

						{privateRoutes.map((route, idx) => (
							<Route
								path={route.path}
								element={
									<ProtectedRoute>
										<Container>
											<Fragment>
												<Sidebar />
												{route.component}
											</Fragment>
										</Container>
									</ProtectedRoute>
								}
								key={idx}
							/>
						))}

						<Route path='*' element={<Navigate to='/' replace />} />
					</Routes>
				</Router>
			</ThemeProvider>

			<ReactQueryDevtools initialIsOpen={false} />
		</QueryClientProvider>
	)
}

export default App

const Container = styled.div`
	display: flex;
`
