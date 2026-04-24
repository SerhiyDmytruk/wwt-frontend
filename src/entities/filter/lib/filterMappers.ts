import { type FilterItem, FilterType } from '@/shared/api/types/Filter'
import type { SearchRequestFilter } from '@/shared/api/types/SearchRequest/SearchRequestFilter'

type DraftSelection = Record<string, string[]>

export const createDraftFromSearchRequest = (
	searchRequest: SearchRequestFilter
): DraftSelection => {
	return searchRequest.reduce<DraftSelection>((draft, filter) => {
		draft[filter.id] = [...filter.optionsIds]

		return draft
	}, {})
}

export const createSearchRequestFromDraft = (
	filterItems: FilterItem[],
	draftSelection: DraftSelection
): SearchRequestFilter => {
	return filterItems.reduce<SearchRequestFilter>((result, filterItem) => {
		const selectedOptions = draftSelection[filterItem.id] ?? []

		if (selectedOptions.length === 0) {
			return result
		}

		const availableOptionIds = new Set(
			filterItem.options.map(option => option.id)
		)
		const normalizedOptions = selectedOptions.filter(optionId =>
			availableOptionIds.has(optionId)
		)

		if (normalizedOptions.length === 0) {
			return result
		}

		result.push({
			id: filterItem.id,
			type: FilterType.OPTION,
			optionsIds: normalizedOptions
		})

		return result
	}, [])
}
