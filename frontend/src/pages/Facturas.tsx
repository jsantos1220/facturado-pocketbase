import { Link, useNavigate } from 'react-router'
import styled from 'styled-components'
import {
	ChevronDown,
	ChevronUp,
	Copy,
	Download,
	Expand,
	Plus,
	Search,
	Trash2,
	User,
} from 'lucide-react'
import { Boton2 } from '@components/ui/Botones'
import Pagination from '@mui/material/Pagination'
import { createFactura, duplicateFactura, deleteFactura, getAllFacturas } from '@api/crudFacturas'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import Swal from 'sweetalert2'
import { useEffect, useMemo, useState } from 'react'
import { formatDate, formatMoney } from '@utils/formatoContenido'
import { Factura } from 'src/types/factura.types'

type SortField = 'comprobante' | 'cliente' | 'estatus' | 'created'
type SortOrder = 'asc' | 'desc'

export default function Facturas() {
	//const { user } = useAuthStore()
	const navigate = useNavigate()
	const queryClient = useQueryClient()

	// Estados para paginación
	const [currentPage, setCurrentPage] = useState(1)
	const itemsPerPage = 10

	// Estados para filtros
	const [buscarComprobante, setBuscarComprobante] = useState('')
	const [buscarCliente, setBuscarCliente] = useState('')

	// Estados para ordenamiento
	const [sortField, setSortField] = useState<SortField>('created')
	const [sortOrder, setSortOrder] = useState<SortOrder>('desc')

	const {
		data: todasLasFacturas,
		error: errorQuery,
		isLoading,
	} = useQuery({
		queryKey: ['facturas'],
		queryFn: async () => getAllFacturas(),
	})

	// Crear factura
	const { mutate: crearFactura, isPending } = useMutation({
		mutationFn: async () => {
			return await createFactura()
		},
		onSuccess: data => {
			Swal.fire({
				title: 'Factura creada',
				icon: 'success',
				showConfirmButton: false,
				timer: 1500,
				timerProgressBar: true,
			}).then(() => {
				navigate(`/facturas/${data.id}`)
			})
			queryClient.invalidateQueries({ queryKey: ['facturas'] })
		},
		onError: error => {
			Swal.fire({
				title: 'Error al crear factura',
				text: error.message,
				icon: 'error',
			})
		},
	})

	// Duplicar factura
	const { mutate: duplicarFactura } = useMutation({
		mutationFn: async (factura: Factura) => {
			return await duplicateFactura(factura)
		},
		onSuccess: data => {
			Swal.fire({
				title: 'Factura duplicada',
				icon: 'success',
				showConfirmButton: false,
				timer: 1500,
				timerProgressBar: true,
			}).then(() => {
				navigate(`/facturas/${data.id}`)
			})
			queryClient.invalidateQueries({ queryKey: ['facturas'] })
		},
		onError: error => {
			Swal.fire({
				title: 'Error al crear factura',
				text: error.message,
				icon: 'error',
			})
		},
	})

	// Eliminar factura
	const { mutate: eliminarFactura } = useMutation({
		mutationFn: async (id: string) => await deleteFactura(id),
		onSuccess: () => {
			Swal.fire({
				title: 'Factura eliminada',
				icon: 'success',
				showConfirmButton: false,
				timer: 1500,
				timerProgressBar: true,
			})
			queryClient.invalidateQueries({ queryKey: ['facturas'] })
		},
		onError: error => {
			Swal.fire({
				title: 'Error al eliminar factura',
				text: error.message,
				icon: 'error',
			})
		},
	})

	// Facturas filtradas
	const facturasFiltradas = useMemo(() => {
		if (!todasLasFacturas) return []

		return todasLasFacturas.filter(factura => {
			const matchComprobante =
				factura.comprobante?.toLowerCase().includes(buscarComprobante.toLowerCase()) ?? true
			const matchCliente =
				factura.cliente?.toLowerCase().includes(buscarCliente.toLowerCase()) ?? true

			return matchComprobante && matchCliente
		})
	}, [todasLasFacturas, buscarComprobante, buscarCliente])

	// Facturas ordenadas
	const facturasOrdenadas = useMemo(() => {
		const facturasParaOrdenar = [...facturasFiltradas]

		return facturasParaOrdenar.sort((a, b) => {
			let aValue = ''
			let bValue = ''

			switch (sortField) {
				case 'comprobante':
					aValue = a.comprobante || ''
					bValue = b.comprobante || ''
					break
				case 'cliente':
					aValue = a.cliente || ''
					bValue = b.cliente || ''
					break
				case 'estatus':
					aValue = a.estatus || ''
					bValue = b.estatus || ''
					break
				case 'created':
					aValue = a.created || ''
					bValue = b.created || ''
					break
				default:
					return
			}

			if (sortOrder === 'asc') {
				return aValue.localeCompare(bValue)
			} else {
				return bValue.localeCompare(aValue)
			}
		})
	}, [facturasFiltradas, sortField, sortOrder])

	// Paginación: obtener facturas de la página actual
	const totalPages = Math.ceil(facturasOrdenadas.length / itemsPerPage)
	const facturasPaginadas = useMemo(() => {
		const startIndex = (currentPage - 1) * itemsPerPage
		const endIndex = startIndex + itemsPerPage
		return facturasOrdenadas.slice(startIndex, endIndex)
	}, [facturasOrdenadas, currentPage, itemsPerPage])

	// Función para ordenar
	const handleSort = (field: SortField) => {
		if (sortField === field) {
			setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
		} else {
			setSortField(field)
			setSortOrder('asc')
		}
	}

	// Función para eliminar con confirmación
	const handleDelete = async (id: string, comprobante: string) => {
		const result = await Swal.fire({
			title: '¿Estás seguro?',
			text: `¿Quieres eliminar la factura ${comprobante}? Esta acción no se puede deshacer.`,
			icon: 'warning',
			showCancelButton: true,
			confirmButtonColor: '#d33',
			cancelButtonColor: '#6A998B',
			confirmButtonText: 'Sí, eliminar',
			cancelButtonText: 'Cancelar',
		})

		if (result.isConfirmed) {
			eliminarFactura(id)
		}
	}

	// Componente para header de tabla con ordenamiento
	const SortableHeader = ({
		field,
		children,
	}: {
		field: SortField
		children: React.ReactNode
	}) => (
		<th
			onClick={() => handleSort(field)}
			className={`sortable ${sortField === field ? 'active' : ''}`}
		>
			<div className='header-content'>
				{children}
				<div className='sort-icons'>
					<ChevronUp className={sortField === field && sortOrder === 'asc' ? 'active' : ''} />
					<ChevronDown
						className={sortField === field && sortOrder === 'desc' ? 'active' : ''}
					/>
				</div>
			</div>
		</th>
	)

	// Reset página cuando cambien los filtros
	useEffect(() => {
		setCurrentPage(1)
	}, [buscarComprobante, buscarCliente])

	if (errorQuery) {
		return <p>Ha ocurrido un error</p>
	}

	return (
		<FacturasContainer>
			<div className='header'>
				<h1>Lista de facturas</h1>
				<p>
					Total: <b>{facturasFiltradas.length}</b> factura(s)
				</p>
			</div>

			<div className='white-box'>
				<Boton2 className='crear-factura' onClick={() => crearFactura()} disabled={isPending}>
					<Plus /> {isPending ? 'Creando...' : 'Crear factura'}
				</Boton2>

				<div className='separador'></div>

				<div className='filtros'>
					<div className='contenedor-input'>
						<Search />
						<input
							type='text'
							placeholder='Buscar por comprobante fiscal'
							value={buscarComprobante}
							onChange={e => setBuscarComprobante(e.target.value)}
						/>
					</div>

					<div className='contenedor-input'>
						<User />
						<input
							type='text'
							placeholder='Buscar por nombre de cliente'
							value={buscarCliente}
							onChange={e => setBuscarCliente(e.target.value)}
						/>
					</div>
				</div>

				{isLoading && <LoadingContainer>Cargando facturas...</LoadingContainer>}

				{!isLoading && (
					<TablaContainer>
						<table>
							<thead>
								<tr>
									<SortableHeader field='comprobante'>Comprobante</SortableHeader>
									<SortableHeader field='cliente'>Cliente</SortableHeader>
									<SortableHeader field='created'>Fecha de creación</SortableHeader>
									<th scope='col'>Monto</th>
									<th scope='col'>Término de pago</th>
									<SortableHeader field='estatus'>Estatus</SortableHeader>
									<th scope='col'>Acciones</th>
								</tr>
							</thead>

							<tbody>
								{facturasPaginadas.length === 0 ? (
									<tr>
										<td colSpan={7} style={{ textAlign: 'center', padding: '40px' }}>
											{facturasFiltradas.length === 0 &&
											(buscarComprobante || buscarCliente)
												? 'No se encontraron facturas con esos criterios'
												: 'No hay facturas disponibles'}
										</td>
									</tr>
								) : (
									facturasPaginadas.map(item => (
										<tr key={item.id}>
											<td className='align-left'>
												<Link
													to={`/facturas/${item.id}`}
													className='fw-medium link-primary'
													title='Ver factura'
												>
													<Expand /> {item.comprobante || 'Sin comprobante'}
												</Link>
											</td>
											<td>{item.cliente || 'Sin cliente'}</td>
											<td className='fz-12'>{formatDate(item.created)}</td>
											<td className='fz-12'>{formatMoney(item.total)}</td>
											<td className='fz-12'>{item.termino_pago || 'Sin término'}</td>
											<td className='fz-12'>
												<span className={`estatus ${item.estatus?.toLowerCase()}`}>
													{item.estatus || 'Sin estatus'}
												</span>
											</td>
											<td className='acciones'>
												<button title='Duplicar' onClick={() => duplicarFactura(item)}>
													<Copy />
												</button>
												<button
													title='Descargar PDF'
													onClick={() => console.log('Download ' + item.id)}
												>
													<Download />
												</button>
												<button
													className='delete'
													onClick={() =>
														handleDelete(
															item.id,
															item.comprobante || 'Sin comprobante',
														)
													}
													title='Borrar'
												>
													<Trash2 />
												</button>
											</td>
										</tr>
									))
								)}
							</tbody>
						</table>
					</TablaContainer>
				)}

				{totalPages > 1 && (
					<Pagination
						className='paginacion'
						onChange={(_e, page) => setCurrentPage(page)}
						count={totalPages}
						page={currentPage}
						shape='rounded'
					/>
				)}
			</div>
		</FacturasContainer>
	)
}

const FacturasContainer = styled.div`
	display: flex;
	flex: 1;
	flex-direction: column;
	background-color: ${({ theme }) => theme.background};
	overflow-x: hidden;
	overflow-y: auto;
	max-height: 100vh;

	.header {
		background-color: white;
		width: 100%;
		padding: 20px 30px;
		border-bottom: 1px solid ${({ theme }) => theme.border};
	}

	h1 {
		font-weight: 500;
		font-size: 28px;
	}

	.white-box {
		margin: 20px;
		background-color: white;
		padding: 20px 0;
		border: 1px solid ${({ theme }) => theme.border};
		border-radius: 4px;
	}

	.crear-factura {
		margin-left: 20px;
	}

	.separador {
		height: 1px;
		border-top: 1px dashed ${({ theme }) => theme.border};
		display: block;
		margin: 20px 0;
	}

	.filtros {
		display: flex;
		margin: 20px;
		gap: 20px;

		.contenedor-input {
			display: flex;
			flex: 1;
			border: 1px solid ${({ theme }) => theme.border};
			padding: 8px;
			color: #9599ad;
			border-radius: 4px;

			svg {
				color: #9599ad;
			}

			input {
				color: #9599ad;
				border: 0;
				margin-left: 6px;
				height: 100%;
				width: 100%;

				&:focus {
					outline: none;
					border: none;
				}

				&::placeholder {
					color: #c0c4d1;
					opacity: 1;
				}
			}
		}
	}

	.paginacion {
		display: flex;
		justify-content: flex-end;
		padding: 20px 15px 0 0;
		border-top: 1px solid ${({ theme }) => theme.border};

		button {
			font-family: ${({ theme }) => theme.fontFamily};
			font-weight: 400;
			border: 1px solid ${({ theme }) => theme.border};
			color: ${({ theme }) => theme.primary};

			&.Mui-selected {
				background-color: ${({ theme }) => theme.primary};
				color: white;
			}
		}
	}
`

const TablaContainer = styled.div`
	overflow-x: auto;
	width: 100%;
	max-height: calc(100vh - 350px);

	table {
		width: 100%;
		min-width: 1000px;
		border-collapse: collapse;
		text-align: left;

		thead {
			position: sticky;
			top: 0;
			z-index: 10;
		}

		.align-left a {
			justify-content: flex-start;
			padding-left: 12px;
		}

		th {
			background-color: ${({ theme }) => theme.backgroundLight};
			border-bottom: 1px solid ${({ theme }) => theme.border};
			padding: 12px 8px;
			font-size: 15px;
			font-weight: 500;
			color: ${({ theme }) => theme.text2};

			&:first-child {
				padding-left: 20px;
			}

			&.sortable {
				cursor: pointer;
				user-select: none;

				&:hover {
					background-color: ${({ theme }) => theme.border};
				}

				/*&.active {
					background-color: ${({ theme }) => theme.primary}20;
				}*/

				.header-content {
					display: flex;
					justify-content: space-between;
					align-items: center;
				}

				.sort-icons {
					display: flex;
					flex-direction: column;
					gap: -4px;

					svg {
						height: 12px;
						width: 12px;
						color: ${({ theme }) => theme.text2};

						&.active {
							color: ${({ theme }) => theme.primary};
						}
					}
				}
			}
		}

		td {
			border-bottom: 1px solid ${({ theme }) => theme.border};
			padding: 12px 8px;
			font-size: 14px;

			&:first-child {
				padding-left: 10px;
			}
		}

		tr:last-child td {
			border-bottom: none;
		}
	}

	svg {
		height: 18px;
		color: ${({ theme }) => theme.primary};

		&:hover {
			color: ${({ theme }) => theme.primaryDark};
		}
	}

	a {
		color: ${({ theme }) => theme.primary};
		display: flex;
		justify-content: center;
		align-items: center;
		gap: 4px;
	}

	.fz-12 {
		font-size: 13px;
		color: ${({ theme }) => theme.text2};
	}

	.acciones {
		display: flex;
		gap: 8px;
	}

	button {
		background-color: rgba(0, 0, 0, 0);
		border: none;
		cursor: pointer;
	}

	.delete {
		svg {
			color: ${({ theme }) => theme.danger};

			&:hover {
				color: ${({ theme }) => theme.dangerDark};
			}
		}
	}
`

const LoadingContainer = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
	height: 200px;
	font-size: 18px;
	color: ${({ theme }) => theme.text2};
`
