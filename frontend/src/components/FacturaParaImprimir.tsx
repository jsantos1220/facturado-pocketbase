import React from 'react'
import { Document, Page, Text, View, StyleSheet, Image, Font } from '@react-pdf/renderer'
import type { Factura, item } from 'src/types/factura.types'
import logo from './ui/Logo'

// Registrar fuentes personalizadas (opcional)
Font.register({
	family: 'Roboto',
	fonts: [
		{
			src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-light-webfont.ttf',
			fontWeight: 300,
		},
		{
			src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-regular-webfont.ttf',
			fontWeight: 400,
		},
		{
			src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-medium-webfont.ttf',
			fontWeight: 500,
		},
		{
			src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-bold-webfont.ttf',
			fontWeight: 700,
		},
	],
})

// Estilos para el PDF
const styles = StyleSheet.create({
	page: {
		flexDirection: 'column',
		backgroundColor: '#FFFFFF',
		padding: 25,
		paddingTop: 20,
		fontFamily: 'Roboto',
		fontSize: 12,
		lineHeight: 1.4,
	},
	companyInfo: {
		flex: 1,
	},

	sectionTitle: {
		fontSize: 13,
		fontWeight: 500,
		color: '#333333',
		marginBottom: 8,
	},
	clientDetail: {
		fontSize: 11,
		color: '#666666',
		marginBottom: 0,
	},

	tableHeader: {
		flexDirection: 'row',
		paddingTop: 8,
		paddingBottom: 6,
		paddingHorizontal: 8,
		borderTopWidth: 1,
		borderTopColor: '#DEE2E6',
		borderTopStyle: 'solid',
		borderBottomWidth: 1,
		borderBottomColor: '#DEE2E6',
		borderBottomStyle: 'solid',
		marginTop: 10,
	},
	tableRow: {
		flexDirection: 'row',
		paddingVertical: 8,
		paddingHorizontal: 8,
		borderBottomWidth: 1,
		borderBottomColor: '#F1F3F4',
		borderBottomStyle: 'solid',
		minHeight: 40,
	},
	tableCell: {
		fontSize: 10,
		color: '#333333',
		textAlign: 'left',
		marginTop: 5,
	},
	tableCellHeader: {
		fontSize: 12,
		fontWeight: 400,
		color: '#495057',
		textAlign: 'left',
	},
	colIndex: { width: '8%' },
	colDescription: { width: '60%' },
	colAmount: { width: '15%', textAlign: 'center' },
	colQuantity: { width: '10%', textAlign: 'center' },
	colTotal: { width: '15%', textAlign: 'right' },
	itemDescription: {
		fontSize: 12,
		color: '#333333',
		marginTop: 2,
		marginBottom: 2,
		fontWeight: 300,
	},
	itemDetails: {
		fontSize: 11,
		color: '#666666',
		lineHeight: 1.3,
		paddingHorizontal: 6,
		fontWeight: 300,
		marginTop: 2,
	},
	footer: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginTop: 5,
	},
	notesSection: {
		marginRight: 40,
		width: '40%',
	},
	notesTitle: {
		fontSize: 12,
		fontWeight: 500,
		color: '#333333',
		marginBottom: 8,
	},
	notesContent: {
		fontSize: 10,
		color: '#666666',
		lineHeight: 1.4,
		fontWeight: 300,
	},
	totalsSection: {
		minWidth: 200,
	},
	totalRow: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		paddingVertical: 1,
		fontSize: 11,
	},
	totalLabel: {
		color: '#333333',
	},
	totalValue: {
		color: '#333333',
		fontWeight: 400,
	},
	finalTotalRow: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		paddingVertical: 8,
		borderTopWidth: 1,
		borderTopColor: '#DEE2E6',
		borderTopStyle: 'solid',
		marginTop: 5,
	},
	finalTotalLabel: {
		fontSize: 12,
		fontWeight: 700,
		color: '#333333',
	},
	finalTotalValue: {
		fontSize: 12,
		fontWeight: 700,
		color: '#333333',
	},
	separator: {
		height: 1,
		backgroundColor: '#E5E5E5',
		marginVertical: 20,
	},
})

interface Props {
	factura: Factura
	items: item[]
	totales: {
		subtotal: number
		descuento: number
		itbis: number
		total: number
	}
	formatearMoneda: (amount: number) => string
}

export const FacturaParaImprimir: React.FC<Props> = ({
	factura,
	items,
	totales,
	formatearMoneda,
}) => {
	const formatearFecha = (fecha: string | null) => {
		if (!fecha) fecha = new Date().toISOString()

		const fechaObj = new Date(fecha)

		// Verificar que la fecha es válida
		if (isNaN(fechaObj.getTime())) {
			return new Date().toLocaleDateString('es-DO')
		}

		const dia = fechaObj.getDate()
		const meses = [
			'Enero',
			'Febrero',
			'Marzo',
			'Abril',
			'Mayo',
			'Junio',
			'Julio',
			'Agosto',
			'Septiembre',
			'Octubre',
			'Noviembre',
			'Diciembre',
		]
		const mes = meses[fechaObj.getMonth()]
		const año = fechaObj.getFullYear()

		return `${dia} / ${mes} / ${año}`
	}

	return (
		<Document>
			<Page size='LETTER' style={styles.page}>
				{/* Header */}
				<View
					style={{
						flexDirection: 'row',
						justifyContent: 'space-between',
						marginBottom: 10,
						paddingBottom: 15,
						borderBottomWidth: 1,
						borderBottomColor: '#E9EBEC',
						borderBottomStyle: 'solid',
					}}
				>
					{/* Branding */}
					<View style={{ flexDirection: 'row', alignItems: 'flex-start', flex: 1 }}>
						<Image
							style={{
								width: 60,
								height: 94,
								marginRight: 20,
							}}
							src={logo}
						/>
						<View>
							<Text
								style={{
									fontSize: 24,
									fontWeight: 300,
									marginBottom: 18,
									color: '#757575',
								}}
							>
								JSD Graphics
							</Text>
							<Text style={{ fontSize: 11, color: '#666666', fontWeight: 300 }}>
								<Text style={{ fontWeight: 500 }}>Tel: </Text>809-697-1996
							</Text>
							<Text style={{ fontSize: 11, color: '#666666', fontWeight: 300 }}>
								<Text style={{ fontWeight: 500 }}>Email: </Text> info@jsd.com.do
							</Text>
							<Text style={{ fontSize: 11, color: '#666666', fontWeight: 300 }}>
								<Text style={{ fontWeight: 500 }}>Dirección: </Text> Ave. República de
								colombia, Ciudad Real
							</Text>
							<Text style={{ fontSize: 11, color: '#666666', fontWeight: 300 }}>
								<Text style={{ fontWeight: 500 }}>RNC: </Text> 131704093
							</Text>
						</View>
					</View>

					{/* Fecha */}
					<View style={{ alignItems: 'flex-end', minWidth: 150 }}>
						<Text
							style={{ fontSize: 12, color: '#757575', fontWeight: 300, textAlign: 'right' }}
						>
							{formatearFecha(factura.fecha_factura)}
						</Text>
					</View>
				</View>

				{/* FACTURA */}
				<Text style={{ fontSize: 24, fontWeight: 300, color: '#757575', marginBottom: 25 }}>
					Factura
				</Text>

				{/* Client Information */}
				<View
					style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 }}
				>
					{/* Izquierda */}
					<View style={{ flex: 1 }}>
						<Text style={styles.clientDetail}>
							<Text style={{ fontWeight: 500 }}>Cliente: </Text>
							<Text style={{ fontWeight: 300 }}>{factura.cliente || 'N/A'}</Text>
						</Text>

						{factura.rnc && (
							<Text style={styles.clientDetail}>
								<Text style={{ fontWeight: 500 }}>RNC: </Text>
								<Text style={{ fontWeight: 300 }}>{factura.rnc}</Text>
							</Text>
						)}

						{factura.comprobante && (
							<Text style={styles.clientDetail}>
								<Text style={{ fontWeight: 500 }}>NCF : </Text>
								<Text style={{ fontWeight: 300 }}>{factura.comprobante}</Text>
							</Text>
						)}
					</View>

					{factura.termino_pago && (
						<View style={{ flex: 1, alignItems: 'flex-end' }}>
							<Text style={styles.sectionTitle}>Condiciones de pago</Text>
							<Text style={styles.clientDetail}>{factura.termino_pago}</Text>
						</View>
					)}
				</View>

				{/* Items Table */}
				<View style={{ marginBottom: 20 }}>
					<View style={styles.tableHeader}>
						{/*<Text style={[styles.tableCellHeader, styles.colIndex]}>#</Text>*/}
						<Text style={[styles.tableCellHeader, styles.colDescription]}>Descripción</Text>
						<Text style={[styles.tableCellHeader, styles.colAmount]}>Monto</Text>
						<Text style={[styles.tableCellHeader, styles.colQuantity]}>Cantidad</Text>
						<Text style={[styles.tableCellHeader, styles.colTotal]}>Importe</Text>
					</View>

					{items.map(item => (
						<View key={item.id} style={styles.tableRow}>
							{/*<Text style={[styles.tableCell, styles.colIndex]}>{index + 1}</Text>*/}
							<View style={[styles.colDescription]}>
								<Text style={styles.itemDescription}>
									{item.detalle || 'Sin descripción'}
								</Text>
								{item.parrafo && <Text style={styles.itemDetails}>{item.parrafo}</Text>}
							</View>
							<Text style={[styles.tableCell, styles.colAmount]}>
								{formatearMoneda(item.monto || 0)}
							</Text>
							<Text style={[styles.tableCell, styles.colQuantity]}>
								{item.cantidad || 0}
							</Text>
							<Text style={[styles.tableCell, styles.colTotal]}>
								{formatearMoneda(item.importe || 0)}
							</Text>
						</View>
					))}
				</View>

				{/*<View style={styles.separator} />*/}

				{/* Footer */}
				<View style={styles.footer}>
					{factura.nota ? (
						<View style={styles.notesSection}>
							<Text style={styles.notesTitle}>Notas:</Text>
							<Text style={styles.notesContent}>
								{factura.nota || 'Sin notas adicionales'}
							</Text>
						</View>
					) : (
						<View></View>
					)}

					<View style={styles.totalsSection}>
						<View style={styles.totalRow}>
							<Text style={styles.totalLabel}>Subtotal:</Text>
							<Text style={styles.totalValue}>{formatearMoneda(totales.subtotal)}</Text>
						</View>

						{factura.descuento != 0 && (
							<View style={styles.totalRow}>
								<Text style={styles.totalLabel}>Descuento:</Text>
								<Text style={styles.totalValue}>
									{formatearMoneda(factura.descuento || 0)}
								</Text>
							</View>
						)}
						<View style={styles.totalRow}>
							<Text style={styles.totalLabel}>ITBIS (18%):</Text>
							<Text style={styles.totalValue}>{formatearMoneda(totales.itbis)}</Text>
						</View>
						<View style={styles.finalTotalRow}>
							<Text style={styles.finalTotalLabel}>Total:</Text>
							<Text style={styles.finalTotalValue}>{formatearMoneda(totales.total)}</Text>
						</View>
					</View>
				</View>
			</Page>
		</Document>
	)
}
