import { type FilterItem, FilterType } from '@/shared/api/types/Filter'

import {
	createDraftFromSearchRequest,
	createSearchRequestFromDraft
} from './filterMappers'

const filterItems: FilterItem[] = [
	{
		id: 'MEAL_OPTIONS',
		name: 'Meal options',
		type: FilterType.OPTION,
		options: [
			{
				id: 'breakfast',
				name: 'Breakfast included'
			},
			{
				id: 'dinner',
				name: 'Dinner included'
			}
		]
	}
]

describe('filterMappers', () => {
	it('creates draft selection from search request', () => {
		expect(
			createDraftFromSearchRequest([
				{
					id: 'MEAL_OPTIONS',
					type: FilterType.OPTION,
					optionsIds: ['breakfast']
				}
			])
		).toEqual({
			MEAL_OPTIONS: ['breakfast']
		})
	})

	it('creates search request from draft and removes unknown options', () => {
		expect(
			createSearchRequestFromDraft(filterItems, {
				MEAL_OPTIONS: ['breakfast', 'unknown-option']
			})
		).toEqual([
			{
				id: 'MEAL_OPTIONS',
				type: FilterType.OPTION,
				optionsIds: ['breakfast']
			}
		])
	})
})
