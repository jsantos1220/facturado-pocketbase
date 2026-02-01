// Formatear dinero
export const formatMoney = (amount: number | null) => {
	if (!amount) return 'RD$ 0.00'
	return `RD$ ${amount.toLocaleString('es-DO', {
		minimumFractionDigits: 2,
		maximumFractionDigits: 2,
	})}`
}

// Formatear fecha
export const formatDate = (dateString: string | null) => {
	if (!dateString) return 'Sin fecha'

	return new Date(dateString).toLocaleDateString('es-DO', {
		day: '2-digit',
		month: 'short',
		year: 'numeric',
	})
}
