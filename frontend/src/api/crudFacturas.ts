import useAuthStore from '@context/authContext'
import pb from '@lib/pocketbase'
import { Factura } from 'src/types/factura.types'

//Obtener factura por ID
export async function getFacturaById(id: string) {
	try {
		const record = await pb.collection('facturas').getOne(id)

		return record
	} catch (error) {
		console.log(error)
		throw error
	}
}

//Obtener las facturas para el front
export async function getAllFacturas() {
	try {
		const records = await pb.collection('facturas').getFullList({
			sort: 'created',
			filter: 'en_papelera != true',
			//TODO: esto hay que limitarlo si lo va a usar mas gente
			//fields:
			//	'id, comprobante, cliente, fecha, total, termino_pago, estatus, en_papelera, created',
		})

		return records
	} catch (error) {
		//console.log(error)
		throw error
	}
}

//Obtener las facturas para el front
export async function getDeletedFacturas() {
	try {
		const records = await pb.collection('facturas').getFullList({
			sort: 'created',
			filter: 'en_papelera = true',
			//TODO: esto hay que limitarlo si lo va a usar mas gente
			//fields:
			//	'id, comprobante, cliente, fecha, total, termino_pago, estatus, en_papelera, created',
		})

		return records
	} catch (error) {
		//console.log(error)
		throw error
	}
}

//Crear nueva factura
export async function createFactura() {
	const user = useAuthStore.getState().user

	try {
		const data = {
			usuario: user.id,
			cliente: 'Nuevo Cliente',
			rnc: '',
			comprobante: 'Sin comprobante',
			total: 0,
			estatus: 'pendiente',
			descuento: 0,
			fecha_pago: '',
			itbis: 0,
			en_papelera: false,
		}

		const record = await pb.collection('facturas').create(data)

		return record
	} catch (error) {
		console.log(error)
		throw error
	}
}

//Crear nueva factura
export async function duplicateFactura(factura: Partial<Factura>) {
	const user = useAuthStore.getState().user

	try {
		const data = {
			usuario: user.id,
			cliente: factura.cliente || '',
			rnc: factura.rnc || '',
			comprobante: factura.comprobante || '',
			estatus: factura.estatus || 'pendiente',
			descuento: factura.descuento || 0,
			fecha_pago: factura.fecha_pago || '',
			itbis: factura.fecha_pago || 0,
			items: factura.items || '',
			sub_total: factura.sub_total || 0,
			nota: factura.nota || '',
			moneda: factura.moneda || 'RD$',
			total: 0,
			lleva_itbis: factura.lleva_itbis || true,
			en_papelera: factura.en_papelera || false,
		}

		const record = await pb.collection('facturas').create(data)

		return record
	} catch (error) {
		console.log(error)
		throw error
	}
}

//Actualizar factura por ID
export async function actualizarFactura(facturaId: string, factura: Partial<Factura>) {
	const user = useAuthStore.getState().user

	try {
		const data = {
			usuario: user.id,
			cliente: factura.cliente,
			rnc: factura.rnc,
			comprobante: factura.comprobante,
			fecha_factura: factura.fecha_factura,
			termino_pago: factura.termino_pago,
			items: factura.items, // Los items como STRING
			sub_total: factura.sub_total,
			descuento: factura.descuento,
			itbis: factura.itbis,
			total: factura.total,
			nota: factura.nota,
			moneda: factura.moneda,
			estatus: factura.estatus,
			lleva_itbis: factura.lleva_itbis,
			en_papelera: factura.en_papelera,
		}

		const records = await pb.collection('facturas').update(facturaId, data)

		return records
	} catch (error) {
		//console.log(error)
		throw error
	}
}

//Ocultar la factura factura por ID
export async function ocultarFactura(id: string) {
	try {
		const data = {
			en_papelera: true,
		}

		const records = await pb.collection('facturas').update(id, data)

		return records
	} catch (error) {
		//console.log(error)
		throw error
	}
}

//Restaurar la factura factura por ID
export async function restaurarFactura(id: string) {
	try {
		const data = {
			en_papelera: false,
		}

		const records = await pb.collection('facturas').update(id, data)

		return records
	} catch (error) {
		//console.log(error)
		throw error
	}
}

//Eliminar factura por ID
export async function deleteFactura(id: string) {
	try {
		await pb.collection('facturas').delete(id)

		return { success: true, message: 'Factura eliminada correctamente' }
	} catch (error) {
		//console.log(error)
		throw error
	}
}
