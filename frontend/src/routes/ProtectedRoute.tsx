import { Navigate } from 'react-router'
import useAuthStore from '@context/authContext'
import { PropsWithChildren } from 'react'

export default function ProtectedRoute({ children }: PropsWithChildren) {
	const { isAuth, loading } = useAuthStore()

	//para manejar los casos por tipo de usuario
	const role = useAuthStore(s => s.user?.role)
	if (role === 'admin') {
	}

	if (loading) return null
	if (!isAuth) return <Navigate to='/login' />

	return <div className='contenido-protegido'>{children}</div>
}
