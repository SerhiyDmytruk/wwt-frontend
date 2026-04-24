import { type FilterItem, FilterType } from '@/shared/api/types/Filter'
import filterData from '@/shared/temp/filterData.json'

const isRecord = (value: unknown): value is Record<string, unknown> => {
	return typeof value === 'object' && value !== null
}

const isFilterOption = (
	value: unknown
): value is { id: string; name: string } => {
	if (!isRecord(value)) {
		return false
	}

	return typeof value.id === 'string' && typeof value.name === 'string'
}

const isFilterItem = (value: unknown): value is FilterItem => {
	if (!isRecord(value) || value.type !== FilterType.OPTION) {
		return false
	}

	return (
		typeof value.id === 'string' &&
		typeof value.name === 'string' &&
		Array.isArray(value.options) &&
		value.options.every(isFilterOption)
	)
}

export const getFilterItems = async (): Promise<FilterItem[]> => {
	if (!Array.isArray(filterData.filterItems)) {
		throw new Error('Invalid filter data format')
	}

	if (!filterData.filterItems.every(isFilterItem)) {
		throw new Error('Unsupported filter item received')
	}

	return filterData.filterItems as FilterItem[]
}
