import styled from 'styled-components'
import { SubmitHandler, useForm } from 'react-hook-form'
import supabase from '@lib/supabase'
import Swal from 'sweetalert2'
import { useNavigate } from 'react-router'

type FormData = {
	email: string
}

export default function ResetPassword() {
	const navigate = useNavigate()
	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm<FormData>({
		defaultValues: {
			email: '',
		},
	})

	//const onSubmit: SubmitHandler<FormData> = async data => {
	//	const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
	//		redirectTo: `${import.meta.env.VITE_FRONTEND_URL}/update-password`,
	//	})

	//	if (!error) {
	//		Swal.fire({
	//			title: 'Email enviado',
	//			icon: 'success',
	//			draggable: true,
	//			showConfirmButton: false,
	//			timer: 1500,
	//			timerProgressBar: true,
	//		}).then(() => {
	//			navigate('/')
	//		})
	//	}
	//}

	return (
		<Container>
			<form onSubmit={handleSubmit(onSubmit)}>
				<div className='form-group'>
					<label htmlFor='email'>Email *</label>
					<input
						{...register('email', {
							required: 'Email is required',
							pattern: {
								value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
								message: 'Please enter a valid email',
							},
						})}
						placeholder='email@example.com'
					/>
					{errors.email && <div className='error-message'>{errors.email.message}</div>}
				</div>

				<button type='submit' className='btn btn-primary' disabled={isSubmitting}>
					{isSubmitting ? 'Submitting...' : 'Submit'}
				</button>
				{errors.root && <div className='error-message'>{errors.root.message}</div>}
			</form>
		</Container>
	)
}

const Container = styled.div`
	position: relative;
`
