import styled from 'styled-components'
import { useNavigate } from 'react-router'
import { SubmitHandler, useForm } from 'react-hook-form'
import useAuthStore from '@context/authContext'
import { useEffect } from 'react'
import supabase from '@lib/supabase'
import imageLogin from '@assets/login.jpg'
import { Boton, Enlace } from '@components/ui/Botones'
import { Input } from '@components/ui/Inputs'

type FormData = {
	email: string
	password: string
}

export default function Signup() {
	const navigate = useNavigate()
	const { user } = useAuthStore()

	useEffect(() => {
		if (user) {
			navigate('/')
		}
	}, [user, navigate])

	const {
		register,
		handleSubmit,
		setError,
		formState: { errors, isSubmitting },
	} = useForm<FormData>({
		defaultValues: {
			email: '',
			password: '',
		},
	})

	const onSubmit: SubmitHandler<FormData> = async datos => {
		const { email, password } = datos
		const { error } = await supabase.auth.signInWithPassword({ email, password })

		if (error) {
			setError('root', { message: 'Password o contraseña equivocados' })
		}
	}

	return (
		<Container>
			<div className='left'>
				<div className='auth-container'>
					<h1>Logueate en tu cuenta</h1>

					<form onSubmit={handleSubmit(onSubmit)}>
						<div className='form-group'>
							<label htmlFor='email'>Username or email *</label>
							<Input
								{...register('email', {
									required: 'Email is required',
									pattern: {
										value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
										message: 'Please enter a valid email',
									},
								})}
								placeholder='email@email.com'
								//type='email'
							/>
							{errors.email && <div className='error-message'>{errors.email.message}</div>}
						</div>

						<div className='form-group'>
							<label htmlFor='password'>Password</label>

							<Input
								{...register('password', {
									required: 'Password is required',
									minLength: {
										value: 8,
										message: 'Password must be at least 8 characters',
									},
								})}
								type='password'
								placeholder='Password'
							/>

							{errors.password && (
								<div className='error-message'>{errors.password.message}</div>
							)}
						</div>

						<Boton type='submit' className='boton' disabled={isSubmitting}>
							{isSubmitting ? 'Logging in...' : 'Login'}
						</Boton>
						{errors.root && <div className='error-message'>{errors.root.message}</div>}

						<Enlace to='/reset-password'>Forgot password</Enlace>
					</form>
				</div>
			</div>

			<div className='right'>
				<img src={imageLogin} />
			</div>
		</Container>
	)
}

const Container = styled.div`
	display: flex;

	& > div {
		flex: 1;
	}

	h1 {
		font-style: normal;
		font-weight: 600;
		font-size: 42.6px;
		line-height: 120%;
	}

	.left {
		display: flex;
		justify-content: center;
		align-items: center;
		padding: 30px;

		.auth-container {
			max-width: 500px;
			display: flex;
			flex-direction: column;
			gap: 30px;
		}
	}

	.right {
		height: 100vh;
		overflow: hidden;

		@media (max-width: 768px) {
			display: none;
		}

		img {
			object-fit: cover;
			min-height: 100%;
			/*min-width: 100%;*/
		}
	}

	form {
		display: flex;
		flex-direction: column;
		gap: 20px;
	}

	label {
		display: block;
		width: 100%;
	}

	.error-message {
		color: red;
	}
`
