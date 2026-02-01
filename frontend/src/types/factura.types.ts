import { Json } from './database.types'

export type Factura = {
	cliente?: string | null
	rnc?: string | null
	comprobante?: string | null
	created_at?: string | null
	descuento?: number | null
	estatus?: Estatus | null
	fecha_factura?: string | null
	fecha_pago?: string | null
	id?: string | null
	itbis?: number | null
	items?: item[] | Json | null
	sub_total?: number | null
	termino_pago?: string | null
	total?: number | null
	update_at?: Date | string | null
	user_id?: string | null
	nota?: string | null
	en_papelera?: boolean | null
	lleva_itbis?: boolean | null
	moneda?: Moneda
}

export type item = {
	id: string
	index?: number
	detalle?: string
	parrafo?: string
	monto: number
	cantidad: number
	importe: number
}

export enum Estatus {
	Pendiente = 'pendiente',
	Pago = 'pago',
	Rechazado = 'rechazado',
}

export enum Moneda {
	Peso = 'RD$',
	Dolar = 'US$',
}
