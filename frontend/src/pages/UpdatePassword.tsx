import styled from 'styled-components'
import { SubmitHandler, useForm } from 'react-hook-form'
import supabase from '@lib/supabase'
import { useNavigate } from 'react-router'

type FormData = {
	password: string
	confirmPassword: string
}

export default function UpdatePassword() {
	const navigate = useNavigate()
	const {
		register,
		handleSubmit,
		watch,
		formState: { errors, isSubmitting },
	} = useForm<FormData>({
		defaultValues: {
			password: '',
			confirmPassword: '',
		},
	})

	const onSubmit: SubmitHandler<FormData> = async data => {
		const { error } = await supabase.auth.updateUser({ password: data.password })

		if (!error) navigate('dashboard')
	}

	const password = watch('password')

	return (
		<Container>
			<form onSubmit={handleSubmit(onSubmit)}>
				<div className='form-group'>
					<label htmlFor='password'>New Password</label>
					<input
						type='password'
						{...register('password', {
							required: 'Password is required',
							minLength: {
								value: 8,
								message: 'Password must be at least 8 characters',
							},
						})}
					/>
					{errors.password && <div className='error-message'>{errors.password.message}</div>}
				</div>

				<div className='form-group'>
					<label htmlFor='confirmPassword'>Confirm Password</label>
					<input
						type='password'
						{...register('confirmPassword', {
							required: 'Please confirm your password',
							validate: value => value === password || 'Passwords do not match',
						})}
					/>
					{errors.confirmPassword && (
						<div className='error-message'>{errors.confirmPassword.message}</div>
					)}
				</div>

				<button type='submit' className='btn btn-primary' disabled={isSubmitting}>
					{isSubmitting ? 'Setting Password...' : 'Set Password'}
				</button>
			</form>
		</Container>
	)
}

const Container = styled.div`
	position: relative;
`
