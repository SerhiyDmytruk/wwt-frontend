import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'

import { useFilterStore } from '@/entities/filter/model/filterStore'
import '@/shared/i18n'

import { FilterModalFlow } from './FilterModalFlow'

const renderWithProviders = () => {
	const queryClient = new QueryClient({
		defaultOptions: {
			queries: {
				retry: false
			}
		}
	})

	return render(
		<QueryClientProvider client={queryClient}>
			<FilterModalFlow />
		</QueryClientProvider>
	)
}

describe('FilterModalFlow', () => {
	beforeEach(() => {
		useFilterStore.setState({
			appliedFilters: [],
			setAppliedFilters: useFilterStore.getState().setAppliedFilters
		})
	})

	it('keeps previously applied filters when user chooses old filter', async () => {
		renderWithProviders()

		fireEvent.click(screen.getByRole('button', { name: 'Open filters' }))

		const breakfastOption = await screen.findByRole('checkbox', {
			name: /Breakfast included/i
		})
		fireEvent.click(breakfastOption)
		fireEvent.click(screen.getByRole('button', { name: 'Apply' }))

		await screen.findByText('Do you want to apply new filter')
		fireEvent.click(screen.getByRole('button', { name: 'Use old filter' }))

		await waitFor(() => {
			expect(screen.queryByText('Do you want to apply new filter')).toBeNull()
		})
		expect(useFilterStore.getState().appliedFilters).toEqual([])
	})

	it('applies draft selection after confirmation', async () => {
		renderWithProviders()

		fireEvent.click(screen.getByRole('button', { name: 'Open filters' }))

		const breakfastOption = await screen.findByRole('checkbox', {
			name: /Breakfast included/i
		})
		fireEvent.click(breakfastOption)
		fireEvent.click(screen.getByRole('button', { name: 'Apply' }))
		fireEvent.click(screen.getByRole('button', { name: 'Apply new filter' }))

		await waitFor(() => {
			expect(useFilterStore.getState().appliedFilters).toEqual([
				{
					id: 'MEAL_OPTIONS',
					type: 'OPTION',
					optionsIds: ['breakfast']
				}
			])
		})
	})
})
