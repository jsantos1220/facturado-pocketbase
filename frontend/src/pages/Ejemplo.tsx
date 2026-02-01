import styled from 'styled-components'
import { SubmitHandler, useForm } from 'react-hook-form'

export default function Hola() {
	type FormData = {
		name: string
		email: string
		message: string
		gender: string
		country: string
		acceptTerms: boolean
	}

	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm<FormData>({
		defaultValues: {
			name: '',
			email: '',
			message: '',
			gender: '',
			country: '',
			acceptTerms: false,
		},
	})

	const onSubmit: SubmitHandler<FormData> = async data => {
		console.log(data)
		// TODO: manejar envío de datos
	}
	return (
		<Container>
			<form onSubmit={handleSubmit(onSubmit)}>
				<div className='form-group'>
					<label htmlFor='name'>Name</label>
					<input
						{...register('name', { required: 'Name is required' })}
						placeholder='Your name'
					/>
					{errors.name && <span className='error-message'>{errors.name.message}</span>}
				</div>

				<div className='form-group'>
					<label htmlFor='email'>Email</label>
					<input
						{...register('email', {
							required: 'Email is required',
							pattern: {
								value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
								message: 'Enter a valid email',
							},
						})}
						placeholder='email@example.com'
					/>
					{errors.email && <span className='error-message'>{errors.email.message}</span>}
				</div>

				<div className='form-group'>
					<label htmlFor='message'>Message</label>
					<textarea {...register('message')} placeholder='Your message'></textarea>
				</div>

				<div className='form-group'>
					<label>Gender</label>
					<label>
						<input
							type='radio'
							value='male'
							{...register('gender', { required: 'Select a gender' })}
						/>{' '}
						Male
					</label>
					<label>
						<input
							type='radio'
							value='female'
							{...register('gender', { required: 'Select a gender' })}
						/>{' '}
						Female
					</label>
					{errors.gender && <span className='error-message'>{errors.gender.message}</span>}
				</div>

				<div className='form-group'>
					<label htmlFor='country'>Country</label>
					<select {...register('country', { required: 'Select a country' })}>
						<option value=''>Select...</option>
						<option value='us'>United States</option>
						<option value='ca'>Canada</option>
						<option value='mx'>Mexico</option>
					</select>
					{errors.country && <span className='error-message'>{errors.country.message}</span>}
				</div>

				<div className='form-group'>
					<label>
						<input
							type='checkbox'
							{...register('acceptTerms', { required: 'You must accept the terms' })}
						/>
						I accept the terms and conditions
					</label>
					{errors.acceptTerms && (
						<span className='error-message'>{errors.acceptTerms.message}</span>
					)}
				</div>

				<button type='submit' className='btn btn-primary' disabled={isSubmitting}>
					{isSubmitting ? 'Submitting...' : 'Submit'}
				</button>
			</form>
		</Container>
	)
}

const Container = styled.div`
	position: relative;
`
