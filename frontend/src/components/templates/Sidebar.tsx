import styled from 'styled-components'
import useAuthStore from '@context/authContext'
import { Link } from 'react-router'
import { Boton } from '@components/ui/Botones'
import { ArrowLeftFromLine, FileText } from 'lucide-react'

export default function Sidebar() {
	const { user, logout } = useAuthStore()

	return (
		<SidebarContainer>
			<nav className='sidebar'>
				<div className='top'>
					<div className='header'>
						<h2>Future Documents</h2>
					</div>

					<Link to='/' className='enlace'>
						<FileText /> Facturas
					</Link>
				</div>

				{user && (
					<Boton onClick={logout}>
						<ArrowLeftFromLine />
						Cerrar sesión
					</Boton>
				)}
			</nav>
		</SidebarContainer>
	)
}

const SidebarContainer = styled.div`
	background-color: ${({ theme }) => theme.primary};
	color: white;
	padding: 20px;
	min-height: 100vh;
	display: flex;

	flex-shrink: 0;

	a {
		color: white;
		text-decoration: none;
	}

	h2 {
		font-weight: 500;
		font-size: ${({ theme }) => theme.text_m};
		border-bottom: 1px solid rgba(255, 255, 255, 0.6);
		margin: 0 -20px;
		padding: 1px 20px 14px 20px;
		margin-bottom: 20px;
	}

	button {
		justify-content: flex-start;
		padding: 12px;
	}

	.enlace {
		display: flex;
		justify-content: flex-start;
		align-items: center;
		gap: 8px;
		padding: 8px 12px;

		&:hover {
			cursor: pointer;
			background-color: ${({ theme }) => theme.secondary};
		}

		svg {
			height: 22px;
		}
	}

	.sidebar {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		height: 100%;
	}
`
