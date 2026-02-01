import Dashboard from '@pages/Dashboard'
import Factura from '@pages/Factura'
import Facturas from '@pages/Facturas'
import Login from '@pages/Login'
import ResetPassword from '@pages/ResetPassword'
import Signup from '@pages/Signup'
import UpdatePassword from '@pages/UpdatePassword'

export const publicRoutes = [
	{ path: '/login', component: <Login /> },
	{ path: '/signup', component: <Signup /> },
	{ path: '/reset-password', component: <ResetPassword /> },
]

export const privateRoutes = [
	{ path: '/', component: <Facturas /> },
	{ path: '/facturas/:factura_id', component: <Factura /> },
	{ path: '/dashboard', component: <Dashboard /> },
	{ path: '/update-password', component: <UpdatePassword /> },
]
