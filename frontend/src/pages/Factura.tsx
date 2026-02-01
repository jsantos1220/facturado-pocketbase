import { useParams } from 'react-router'
import {
	actualizarFactura,
	getFacturaById,
	ocultarFactura,
	restaurarFactura,
} from '@api/crudFacturas'
import styled from 'styled-components'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import logo from '@assets/logo-jsd.jpg'
import Flatpickr from 'react-flatpickr'
import { useMemo, useState } from 'react'
import 'flatpickr/dist/themes/material_blue.css'
import { Spanish } from 'flatpickr/dist/l10n/es.js'
import { Download, FileDown, FileText, Plus, Trash2 } from 'lucide-react'
import type { Factura, item } from 'src/types/factura.types'
import { Estatus, Moneda } from '../types/factura.types'
import { v4 as uuid } from 'uuid'
import Swal from 'sweetalert2'
import { useControlSave } from '@components/hooks/useControlSave'
import { PDFDownloadLink, PDFViewer } from '@react-pdf/renderer'
import { FacturaParaImprimir } from '@components/FacturaParaImprimir'
import { ErrorBoundary } from '@utils/ErrorBoundary'

export default function Factura() {
	const { factura_id } = useParams()
	const [facturaActualizada, setFacturaActualizada] = useState<Factura | null>(null)
	const [items, setItems] = useState<item[]>([])
	const [moneda, setMoneda] = useState<Moneda>(Moneda.Peso)
	const [llevaItbis, setLlevaItbis] = useState(true)
	const [mostrarPDF, setMostrarPDF] = useState(false)
	const queryClient = useQueryClient()

	//console.log(facturaActualizada?.comprobante)
	//console.log(facturaActualizada?.rnc)

	const itbis = llevaItbis ? 0.18 : 0

	const {
		data: factura,
		error,
		isLoading,
	} = useQuery({
		queryKey: ['facturas', factura_id],
		queryFn: async () => {
			if (!factura_id) {
				throw new Error('ID de factura no proporcionado')
			}
			const resultado = await getFacturaById(factura_id)

			// ✅ Parsear items con validación
			let itemsActuales: item[] = []

			try {
				//Evitar que si los items estan vacios de error el parse
				if (typeof resultado.items === 'string') {
					itemsActuales = JSON.parse(resultado.items)
				} else if (Array.isArray(resultado.items)) {
					// Ya es un array
					itemsActuales = resultado.items
				}
			} catch (error) {
				//console.error('Error al parsear items:', error)
				// Usar array vacío si falla el parse
				itemsActuales = []
			}

			//Crear la factura con el tipo correcto
			const facturaConvertida: Factura = {
				...resultado,
				items: itemsActuales,
				estatus: resultado.estatus as Estatus,
				moneda: resultado.moneda as Moneda,
			}

			setFacturaActualizada(facturaConvertida)
			setItems(itemsActuales)
			setMoneda(facturaConvertida.moneda ?? Moneda.Peso)
			setLlevaItbis(facturaConvertida.lleva_itbis ?? false)

			return facturaConvertida
		},
		enabled: !!factura_id,
	})

	const { mutate: guardarFactura, isPending } = useMutation({
		mutationFn: async () => {
			if (!factura_id || !facturaActualizada) return

			const itemsInText = JSON.stringify(items)

			// ✅ Calcular totales solo al guardar
			const facturaConTotales = {
				...facturaActualizada,
				items: itemsInText,
				sub_total: totales.subtotal,
				itbis: totales.itbis,
				total: totales.total,
			}

			return await actualizarFactura(factura_id, facturaConTotales)
		},
		onSuccess: () => {
			//console.log(data)
			Swal.fire({
				title: 'Factura actualizada',
				icon: 'success',
				showConfirmButton: false,
				timer: 1500,
				timerProgressBar: true,
			}).then(() => {
				//navigate(`/facturas/${data.id}`);
			})
			queryClient.invalidateQueries({ queryKey: ['facturas', factura_id] })
		},
		onError: error => {
			Swal.fire({
				title: 'Error al actualizar la factura',
				text: error.message,
				icon: 'error',
			})
		},
	})

	const { mutate: eliminarFactura } = useMutation({
		mutationFn: async () => {
			if (!factura_id || !facturaActualizada) return
			return await ocultarFactura(factura_id)
		},
		onSuccess: data => {
			console.log(data)

			Swal.fire({
				title: 'Factura eliminada',
				icon: 'success',
				showConfirmButton: false,
				timer: 1000,
				timerProgressBar: true,
			}).then(() => {
				//navigate(`/facturas/${data.id}`);
			})
			queryClient.invalidateQueries({ queryKey: ['facturas', factura_id] })
		},
		onError: error => {
			Swal.fire({
				title: 'Error al actualizar la factura',
				text: error.message,
				icon: 'error',
			})
		},
	})

	const { mutate: restaurarFacturas } = useMutation({
		mutationFn: async () => {
			if (!factura_id || !facturaActualizada) return
			return await restaurarFactura(factura_id)
		},
		onSuccess: data => {
			console.log(data)

			Swal.fire({
				title: 'Factura restaurada',
				icon: 'success',
				showConfirmButton: false,
				timer: 1000,
				timerProgressBar: true,
			}).then(() => {
				//navigate(`/facturas/${data.id}`);
			})
			queryClient.invalidateQueries({ queryKey: ['facturas', factura_id] })
		},
		onError: error => {
			Swal.fire({
				title: 'Error al actualizar la factura',
				text: error.message,
				icon: 'error',
			})
		},
	})

	function agregarItem() {
		const newItem = {
			id: uuid(),
			detalle: '',
			parrafo: '',
			monto: 0,
			cantidad: 1,
			importe: 0,
		}

		setItems(items => {
			return [...items, newItem]
		})
	}

	//Función helper para actualizar items
	const updateItem = (itemId: string, updates: Partial<item>) => {
		setItems(prevItems =>
			prevItems?.map(item => (item.id === itemId ? { ...item, ...updates } : item)),
		)
	}

	//Función helper para eliminar item
	const removeItem = (itemId: string) => {
		setItems(prevItems => prevItems.filter(item => item.id !== itemId))
	}

	//Función para calcular importe automáticamente
	const updateCalculate = (itemId: string, field: keyof item, value: any) => {
		setItems(prevItems =>
			prevItems.map(item => {
				if (item.id === itemId) {
					const updatedItem = { ...item, [field]: value }

					// Calcular importe automáticamente
					if (field === 'monto' || field === 'cantidad') {
						updatedItem.importe = updatedItem.monto * updatedItem.cantidad
					}

					return updatedItem
				}
				return item
			}),
		)
	}

	//Función para actualizar campos de la factura
	const updateFactura = (field: keyof Factura, value: any) => {
		setFacturaActualizada(prev => {
			if (!prev) return null
			return { ...prev, [field]: value != '' ? value : '' }
		})
	}

	//Función para formatear moneda
	const formatearMoneda = (amount: number) => {
		return `${moneda} ${amount.toLocaleString('es-DO', {
			minimumFractionDigits: 2,
			maximumFractionDigits: 2,
		})}`
	}

	const totales = useMemo(() => {
		const subtotal = items.reduce((sum, item) => sum + (item.importe || 0), 0)
		const descuento = facturaActualizada?.descuento || 0
		const subtotalConDescuento = subtotal - descuento
		const itbisCalculado = subtotalConDescuento * itbis
		const total = subtotalConDescuento + itbisCalculado

		return {
			subtotal,
			descuento,
			itbis: itbisCalculado,
			total,
		}
	}, [items, facturaActualizada?.descuento, llevaItbis])

	//Guardar con control + s
	useControlSave(guardarFactura)

	function mostrarFactura() {
		if (!facturaActualizada) return
		setMostrarPDF(!mostrarPDF)
	}

	if (error) {
		return <ErrorContainer>Ocurrió un error al cargar la factura</ErrorContainer>
	}

	return (
		<Container>
			{isLoading && <LoadingContainer>Cargando factura...</LoadingContainer>}

			<div className='header'>
				<h1>{factura?.cliente || 'Nueva Factura'}</h1>
			</div>

			<div className='dos-columnas'>
				<div className='left'>
					<div className='white-box factura-editable'>
						<div className='cabecera'>
							<div className='branding'>
								<img src={logo} alt='JSD Graphics' />

								<div className='company-info'>
									<h2>JSD Graphics</h2>
									<p>
										<b>Tel:</b> 809-697-1996
									</p>
									<p>
										<b>Email:</b> info@jsd.com.do
									</p>
									<p>
										<b>Dirección:</b> Ave. República de colombia, Ciudad Real
									</p>
									<p>
										<b>RNC:</b> 131704093
									</p>
								</div>
							</div>

							<div className='fecha'>
								<p>Fecha & Moneda</p>

								<Flatpickr
									id='fecha-factura'
									className='form-control'
									placeholder='Seleccionar fecha'
									required={true}
									onChange={e => {
										setFacturaActualizada(prev => {
											if (!prev) return null
											return { ...prev, fecha_factura: e[0].toISOString() }
										})
									}}
									options={{
										dateFormat: 'd/m/Y',
										altInput: true,
										altFormat: 'd/m/Y',
										locale: Spanish,
										defaultDate: facturaActualizada?.fecha_factura
											? new Date(facturaActualizada.fecha_factura)
											: new Date(),
									}}
								/>

								<select
									className='form-control moneda-select'
									value={facturaActualizada?.moneda}
									onChange={e => {
										setFacturaActualizada(prev => {
											if (!prev) return null
											return { ...prev, moneda: e.target.value as Moneda }
										})
									}}
								>
									<option value=''>Selecciona la moneda</option>
									<option value={Moneda.Peso}>🇩🇴 Pesos (RD$)</option>
									<option value={Moneda.Dolar}>🇺🇸 Dólares (US$)</option>
								</select>
							</div>
						</div>

						<div className='separador'></div>

						<div className='informacion-general'>
							<h2>Factura</h2>

							<div className='contenido-general'>
								<div className='izquierda'>
									<p>Información de cliente</p>

									<input
										id='cliente'
										type='text'
										className='form-control'
										placeholder='Nombre'
										required={true}
										value={facturaActualizada?.cliente || ''}
										onChange={e => updateFactura('cliente', e.target.value)}
									/>

									<input
										id='RNC'
										type='text'
										className='form-control'
										placeholder='RNC'
										value={facturaActualizada?.rnc || ''}
										onChange={e => updateFactura('rnc', e.target.value)}
									/>

									<input
										id='comprobante'
										type='text'
										className='form-control'
										placeholder='Comprobante fiscal'
										value={facturaActualizada?.comprobante || ''}
										onChange={e => {
											updateFactura('comprobante', e.target.value)
										}}
									/>
								</div>

								<div className='derecha'>
									<p>Condición de pago</p>

									<select
										id='termino-pago'
										className='form-control'
										value={facturaActualizada?.termino_pago || ''}
										onChange={e => updateFactura('termino_pago', e.target.value)}
									>
										<option value=''>Condición de pago</option>
										<option value='De contado'>De contado</option>
										<option value='Pago único'>Pago único</option>
										<option value='50/50'>50/50</option>
									</select>
								</div>
							</div>
						</div>

						<div className='separador'></div>

						<div className='items-section'>
							<div className='items-table'>
								<div className='table-header'>
									<div>#</div>
									<div>Detalle del servicio</div>
									<div>Monto</div>
									<div>Cantidad</div>
									<div>Importe</div>
								</div>

								{items.length > 0 &&
									items.map((item, index) => (
										<div className='table-row' key={item.id}>
											<span className='index'>{index + 1}</span>
											<div className='detalle'>
												<input
													type='text'
													placeholder='Nombre del servicio'
													required={true}
													value={item.detalle ?? ''}
													onChange={e =>
														updateItem(item.id, { detalle: e.target.value })
													}
												/>
												<textarea
													name='Detalle del servicio'
													placeholder='Detalle del servicio'
													value={item.parrafo ?? ''}
													onChange={e =>
														updateItem(item.id, { parrafo: e.target.value })
													}
												></textarea>
											</div>
											<input
												name='Monto'
												type='number'
												placeholder='$0.00'
												value={item.monto ?? ''}
												onChange={e =>
													updateCalculate(item.id, 'monto', +e.target.value)
												}
											/>
											<input
												name='Cantidad'
												type='number'
												placeholder='0.00'
												step='1'
												value={item.cantidad ?? ''}
												onChange={e =>
													updateCalculate(item.id, 'cantidad', +e.target.value)
												}
											/>
											<input
												name='Importe'
												type='number'
												placeholder='0.00'
												value={item.importe || 0}
												readOnly
												className='readonly'
											/>
											<button
												type='button'
												className='btn-remove'
												onClick={() => removeItem(item.id)}
											>
												<Trash2 />
											</button>
										</div>
									))}
							</div>

							<button type='button' className='btn-add-item' onClick={agregarItem}>
								<Plus /> Agregar servicio
							</button>
						</div>

						<div className='separador'></div>

						<div className='totales'>
							<div className='izquierda'>
								<p>Nota*</p>
								<textarea
									name='nota'
									placeholder='Notas adicionales'
									value={facturaActualizada?.nota || ''}
									onChange={e => updateFactura('nota', e.target.value)}
								></textarea>
							</div>

							<div className='totales-grid'>
								<div className='total-row'>
									<span>Subtotal:</span>
									<span>{formatearMoneda(totales.subtotal)}</span>
								</div>
								<div className='total-row'>
									<span>Descuento:</span>
									<input
										type='number'
										placeholder='0.00'
										className='descuento'
										value={facturaActualizada?.descuento || ''}
										onChange={e => updateFactura('descuento', +e.target.value)}
									/>
								</div>
								<div className='total-row'>
									<span className='lleva-itbis'>
										<input
											type='checkbox'
											name='lleva-itbis'
											id='lleva-itbis'
											checked={facturaActualizada?.lleva_itbis || false}
											onChange={e => {
												const nuevoValor = e.target.checked
												setLlevaItbis(nuevoValor)
												updateFactura('lleva_itbis', nuevoValor)
											}}
										/>
										<label htmlFor='lleva-itbis'>ITBIS (18%):</label>
									</span>
									<span>{formatearMoneda(totales.itbis)}</span>
								</div>
								<div className='total-row total-final'>
									<span>Total:</span>
									<span>{formatearMoneda(totales.total)}</span>
								</div>
							</div>
						</div>

						<div className='separador'></div>

						<div className='acciones-form'>
							<button
								type='submit'
								className='btn-primary'
								onClick={() => guardarFactura()}
								disabled={isPending}
							>
								<FileDown /> Guardar Factura
							</button>
						</div>
					</div>

					{!facturaActualizada?.en_papelera && (
						<div className='white-box zona-peligrosa'>
							<h3>Zona de Peligro</h3>
							<p>Esta opción va a enviar la factura a la papeleta</p>

							<button
								className='btn-danger'
								onClick={() => {
									if (window.confirm('Estas seguro')) {
										eliminarFactura()
									}
								}}
							>
								Enviar a la papelera
							</button>
						</div>
					)}
				</div>

				{/* SIDEBAR */}
				<div className='right'>
					<div className='white-box metadata'>
						<div className='metadata-item'>
							<strong>ID:</strong>
							<span>{facturaActualizada?.id || 'Nuevo'}</span>
						</div>

						<div className='metadata-item'>
							<strong>Estatus de pago:</strong>
							<span className={`status `}>
								<select
									name='condicion-pago'
									value={facturaActualizada?.estatus || ''}
									onChange={e => {
										setFacturaActualizada(prev => {
											if (!prev) return null
											return { ...prev, estatus: e.target.value as Estatus }
										})
									}}
								>
									<option value=''>Seleccionar estado</option>
									<option value={Estatus.Pendiente}>Pendiente</option>
									<option value={Estatus.Pago}>Pago</option>
									<option value={Estatus.Rechazado}>Rechazado</option>
								</select>
							</span>
						</div>

						<div className='metadata-item'>
							<strong>Creado:</strong>
							<span>
								{facturaActualizada?.created_at
									? new Date(facturaActualizada.created_at).toLocaleDateString('es-DO')
									: 'Hoy'}
							</span>
						</div>

						<div className='metadata-item'>
							<strong>Última modificación:</strong>
							<span>
								{facturaActualizada?.update_at
									? new Date(facturaActualizada.update_at).toLocaleDateString('es-DO')
									: 'Nunca'}
							</span>
						</div>

						<div className='metadata-item'>
							<strong>Visibilidad:</strong>
							<span className={`status`}>
								{!facturaActualizada?.en_papelera ? (
									'Disponible'
								) : (
									<span className='danger'>En la papelera</span>
								)}
							</span>
						</div>

						<button
							type='submit'
							className='btn-pdf'
							onClick={() => guardarFactura()}
							disabled={isPending}
						>
							<FileDown /> Guardar Factura
						</button>

						{facturaActualizada?.en_papelera && (
							<button
								type='submit'
								className='btn-pdf lined'
								onClick={() => {
									if (window.confirm('¿Estas seguro de restaurar esta factura?')) {
										restaurarFacturas()
									}
								}}
								disabled={isPending}
							>
								<FileDown /> Restaurar la factura
							</button>
						)}
					</div>

					<div className='white-box pdf'>
						{facturaActualizada && mostrarPDF && (
							<PDFViewer width='100%' height='600px' key={Date.now()}>
								<FacturaParaImprimir
									factura={facturaActualizada}
									items={items}
									totales={totales}
									formatearMoneda={formatearMoneda}
								/>
							</PDFViewer>
						)}
						<button className='btn-pdf' onClick={mostrarFactura}>
							<FileText /> {!mostrarPDF ? 'Mostrar factura' : 'Ocultar factura'}
						</button>

						<ErrorBoundary fallback={<p>Something went wrong</p>}>
							{facturaActualizada && (
								<PDFDownloadLink
									key={Date.now()}
									document={
										<FacturaParaImprimir
											factura={facturaActualizada}
											items={items}
											totales={totales}
											formatearMoneda={formatearMoneda}
										/>
									}
									fileName={`${facturaActualizada.cliente || 'nueva'}-${Date.now()}.pdf`}
									className='btn-pdf secondary'
								>
									{({ loading }) => {
										return loading ? (
											<>
												<Download /> Generando PDF...
											</>
										) : (
											<>
												<Download /> Descargar factura
											</>
										)
									}}
								</PDFDownloadLink>
							)}
						</ErrorBoundary>
					</div>
				</div>
			</div>
		</Container>
	)
}

const Container = styled.div`
	display: flex;
	flex: 1;
	flex-direction: column;
	background-color: ${({ theme }) => theme.background};
	overflow-x: hidden;
	overflow-y: auto;
	max-height: 100vh;

	input.readonly {
		background-color: #f8f9fa !important;
		color: #6c757d !important;
		cursor: not-allowed;
	}

	.factura-editable {
		min-width: 750px;
	}

	.separador {
		height: 1px;
		border-top: 1px dashed ${({ theme }) => theme.border};
		display: block;
		margin: 20px 0;
	}

	.header {
		background-color: white;
		width: 100%;
		padding: 20px 30px;
		border-bottom: 1px solid ${({ theme }) => theme.border};

		h1 {
			font-weight: 500;
			font-size: 28px;
			margin: 0;
			color: ${({ theme }) => theme.text};
		}
	}

	p {
		margin-bottom: 0 !important;
	}

	input,
	select,
	textarea {
		border: 0px;
		background-color: #f3f6f9;
		width: 100%;
		padding: 10px 14px;
		color: #878a99;
	}

	.dos-columnas {
		display: grid;
		grid-template-columns: 2fr 1fr;
		gap: 20px;
		padding: 20px;
		min-height: calc(100vh - 100px);

		@media (max-width: 1024px) {
			grid-template-columns: 1fr;
		}
	}

	.left,
	.right {
		display: flex;
		flex-direction: column;
	}

	.izquierda {
		width: 100%;
		max-width: 400px;
	}

	.white-box {
		background-color: white;
		padding: 20px;
		border: 1px solid ${({ theme }) => theme.border};
		border-radius: 4px;
		margin-bottom: 20px;

		&.factura-editable {
			flex: 1;
		}

		&.zona-peligrosa {
			/*border-color: ${({ theme }) => theme.danger};*/

			h3 {
				color: ${({ theme }) => theme.grey};
				font-weight: 400;
				margin: 0 0 10px 0;
			}

			p {
				color: ${({ theme }) => theme.text2};
				margin-bottom: 15px;
			}

			.btn-danger {
				background-color: white;
				color: ${({ theme }) => theme.danger};
				border: 1px solid ${({ theme }) => theme.danger};
				padding: 8px 16px;
				border-radius: 4px;
				cursor: pointer;
				font-size: 14px;
				margin-top: 8px;

				&:hover {
					background-color: ${({ theme }) => theme.danger};
					color: white;
				}
			}
		}

		h3 {
			margin: 0 0 15px 0;
			font-size: 18px;
			font-weight: 500;
			color: #666666;
		}

		p {
			margin: 5px 0;
			color: ${({ theme }) => theme.text2};
			font-size: 14px;
		}
	}

	.cabecera {
		display: flex;
		gap: 20px;
		justify-content: space-between;

		.branding {
			display: flex;
			gap: 20px;

			img {
				width: 80px;
				height: 120px;
				object-fit: contain;
				border-radius: 4px;
			}

			.company-info {
				flex: 1;

				h2 {
					color: #666;
					font-size: 24px;
					font-weight: 300;
					margin-bottom: 5px;
				}

				p {
					font-size: 13px;
					color: ${({ theme }) => theme.text2};
					margin: 2px;
				}
			}
		}

		.fecha {
			display: flex;
			flex-direction: column;
			gap: 6px;

			label {
				font-size: 14px;
			}

			input {
				min-width: 270px;
			}
		}
	}

	.informacion-general {
		display: flex;
		flex-direction: column;
		gap: 10px;
		justify-content: space-between;

		h2 {
			font-weight: 300;
			color: #666;
			font-size: 28px;
		}

		.contenido-general {
			display: flex;
			justify-content: space-between;
			gap: 20px;

			.izquierda {
				display: flex;
				flex-direction: column;
				width: 100%;
				gap: 6px;
			}

			.derecha {
				display: flex;
				flex-direction: column;
				gap: 6px;

				label {
					font-size: 14px;
				}

				select {
					min-width: 270px;
					padding: 8px 14px;
				}
			}
		}
	}

	.items-section {
		margin-bottom: 30px;

		h3 {
			margin-bottom: 15px;
			color: #666666;
		}

		.items-table {
			border-radius: 4px;
			overflow: hidden;

			.table-header {
				background-color: ${({ theme }) => theme.backgroundLight};
				display: grid;
				grid-template-columns: 16px 1fr 100px 100px 100px 40px;
				gap: 12px;
				padding: 12px;
				font-weight: 500;
				border-bottom: 1px solid ${({ theme }) => theme.border};
				font-size: 14px;
				color: ${({ theme }) => theme.text2};
			}

			.table-row {
				display: grid;
				grid-template-columns: 16px 1fr 100px 100px 100px 40px;
				gap: 12px;
				padding: 12px;
				align-items: flex-start;
				border-bottom: 1px dashed ${({ theme }) => theme.border};

				textarea {
					margin-top: 8px;
				}

				.btn-remove {
					background-color: ${({ theme }) => theme.dangerBg};
					color: ${({ theme }) => theme.danger};
					border: none;
					border-radius: 4px;
					width: 100%;
					height: 34px;
					cursor: pointer;
					display: flex;
					align-items: center;
					justify-content: center;

					&:hover {
						background-color: ${({ theme }) => theme.danger};
						color: white;
					}

					svg {
						height: 18px;
					}
				}
			}
		}

		.btn-add-item {
			display: flex;
			gap: 6px;
			margin-top: 15px;
			background-color: ${({ theme }) => theme.secondary};
			color: white;
			border: none;
			padding: 8px 18px 8px 10px;
			border-radius: 4px;
			cursor: pointer;
			font-size: 14px;
			align-content: center;
			justify-items: center;
			align-items: center;

			svg {
				height: 22px;
			}

			&:hover {
				background-color: ${({ theme }) => theme.primary};
			}
		}
	}

	.totales {
		margin-bottom: 40px;
		display: flex;
		justify-content: space-between;
		gap: 20px;

		.izquierda {
			display: flex;
			flex-direction: column;
			gap: 8px;

			textarea {
				width: 100%;
			}
		}

		.totales-grid {
			width: 100%;
			max-width: 280px;
			display: flex;
			flex-direction: column;
			gap: 6px;
			font-size: 16px;

			.total-row {
				display: flex;
				justify-content: space-between;
				font-weight: 400;

				&.total-final {
					font-weight: 600;
					font-size: 16px;
					/*border-bottom: 1px solid ${({ theme }) => theme.border};*/
					padding-bottom: 6px;
				}
			}

			.descuento {
				width: 90px;
			}
		}
	}

	.acciones-form {
		display: flex;
		gap: 15px;
		justify-content: flex-start;

		.btn-primary,
		.btn-secondary {
			display: flex;
			gap: 6px;
			margin-top: 15px;
			background-color: ${({ theme }) => theme.secondary};
			color: white;
			border: none;
			padding: 8px 18px 8px 10px;
			border-radius: 4px;
			cursor: pointer;
			font-size: 14px;
			align-content: center;
			justify-items: center;
			align-items: center;

			svg {
				height: 22px;
			}

			&:hover {
				background-color: ${({ theme }) => theme.primary};
			}
		}

		.btn-primary {
			background-color: ${({ theme }) => theme.primary};
			color: white;

			&:hover {
				opacity: 0.9;
			}
		}

		.btn-secondary {
			background-color: ${({ theme }) => theme.secondary};
			border: 1px solid ${({ theme }) => theme.secondary};
			color: white;

			&:hover {
				background-color: ${({ theme }) => theme.primary};
			}
		}
	}

	.metadata {
		.metadata-item {
			display: flex;
			justify-content: space-between;
			align-items: center;
			margin-bottom: 12px;
			padding-bottom: 8px;
			border-bottom: 1px solid ${({ theme }) => theme.border};

			&:last-child {
				margin-bottom: 0px;
				padding-bottom: 0px;
				border-bottom: 0px;
			}

			strong {
				color: ${({ theme }) => theme.text};
				font-size: 14px;
			}

			span {
				color: ${({ theme }) => theme.text2};
				font-size: 14px;

				&.status {
					padding: 4px 8px;
					border-radius: 12px;
					font-size: 12px;
					font-weight: 500;

					&.pendiente {
						background-color: #fff3cd;
						color: #856404;
					}

					&.pagado {
						background-color: #d4edda;
						color: #155724;
					}

					&.borrador {
						background-color: #e2e3e5;
						color: #383d41;
					}
				}
			}
		}
	}

	.pdf {
		text-align: center;
		display: flex;
		flex-direction: column;
		gap: 10px;
	}

	.btn-pdf {
		background-color: ${({ theme }) => theme.primary};
		color: white;
		border: none;
		padding: 12px 20px;
		border-radius: 4px;
		cursor: pointer;
		font-size: 14px;
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 6px;

		&.secondary {
			background-color: ${({ theme }) => theme.secondary};
			text-decoration: none;
		}

		&.lined {
			background-color: white;
			border: 1px solid ${({ theme }) => theme.text2};
			margin-top: 8px;
			color: ${({ theme }) => theme.text2};

			&:hover {
				background-color: ${({ theme }) => theme.text2};
				color: white;
			}
		}

		svg {
			height: 20px;
		}

		&:hover {
			opacity: 0.9;
		}
	}

	.lleva-itbis {
		display: flex;
		gap: 8px;

		input {
			width: 15px;
			accent-color: ${({ theme }) => theme.primary};
		}
	}

	.danger {
		color: ${({ theme }) => theme.danger} !important;
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

const ErrorContainer = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
	height: 400px;
	font-size: 18px;
	color: ${({ theme }) => theme.danger};
	background-color: ${({ theme }) => theme.dangerBg};
	margin: 20px;
	border-radius: 4px;
`
