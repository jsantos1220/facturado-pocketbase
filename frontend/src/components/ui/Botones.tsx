import { Link } from 'react-router'
import styled from 'styled-components'

export const Boton = styled.button`
	color: white;
	background-color: ${({ theme }) => theme.primary};
	font-size: ${({ theme }) => theme.text_m};
	padding: 12px 30px;
	border: 1px solid ${({ theme }) => theme.primary};
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 8px;
	border-radius: 4px;

	&:hover {
		background-color: ${({ theme }) => theme.primaryDark};
		cursor: pointer;
	}
`

export const Boton2 = styled(Boton)`
	padding: 8px 20px 8px 12px;
`

export const Enlace = styled(Link)`
	color: ${({ theme }) => theme.primary};
`
