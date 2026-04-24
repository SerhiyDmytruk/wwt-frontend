import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { useQuery } from '@tanstack/react-query'

import { getFilterItems } from '@/entities/filter/api/getFilterItems'
import {
	createDraftFromSearchRequest,
	createSearchRequestFromDraft
} from '@/entities/filter/lib/filterMappers'
import { useFilterStore } from '@/entities/filter/model/filterStore'
import { FilterForm } from '@/entities/filter/ui/FilterForm'
import type { FilterItem } from '@/shared/api/types/Filter'
import { filterQueryKeys } from '@/shared/config/queryKeys'
import { Button } from '@/shared/ui/Button'
import { Modal } from '@/shared/ui/Modal'

type DraftSelection = Record<string, string[]>
type ModalStep = 'filters' | 'confirm' | null

const createEmptyDraft = () => ({}) as DraftSelection

export const FilterModalFlow = () => {
	const { t } = useTranslation()
	const appliedFilters = useFilterStore(state => state.appliedFilters)
	const setAppliedFilters = useFilterStore(state => state.setAppliedFilters)
	const [modalStep, setModalStep] = useState<ModalStep>(null)
	const [draftSelection, setDraftSelection] =
		useState<DraftSelection>(createEmptyDraft)

	const { data, isLoading, isError } = useQuery({
		queryKey: filterQueryKeys.all,
		queryFn: getFilterItems,
		staleTime: Number.POSITIVE_INFINITY
	})

	const filterItems: FilterItem[] = data ?? []
	const isModalOpen = modalStep !== null
	const isConfirmStep = modalStep === 'confirm'

	const openModal = () => {
		setDraftSelection(createDraftFromSearchRequest(appliedFilters))
		setModalStep('filters')
	}

	const closeModal = () => {
		setModalStep(null)
	}

	const openConfirmation = () => {
		setModalStep('confirm')
	}

	const returnToFilters = () => {
		setModalStep('filters')
	}

	const handleDraftChange = (filterId: string, optionId: string) => {
		setDraftSelection(currentDraft => {
			const currentOptions = currentDraft[filterId] ?? []
			const isSelected = currentOptions.includes(optionId)
			const nextOptions = isSelected
				? currentOptions.filter(id => id !== optionId)
				: [...currentOptions, optionId]

			if (nextOptions.length === 0) {
				const nextDraft = { ...currentDraft }
				delete nextDraft[filterId]

				return nextDraft
			}

			return {
				...currentDraft,
				[filterId]: nextOptions
			}
		})
	}

	const clearDraft = () => {
		setDraftSelection(createEmptyDraft())
	}

	const confirmApply = () => {
		setAppliedFilters(createSearchRequestFromDraft(filterItems, draftSelection))
		closeModal()
	}

	const handleModalClose = () => {
		if (isConfirmStep) {
			returnToFilters()

			return
		}

		closeModal()
	}

	return (
		<>
			<Button onClick={openModal}>{t('filter.openButton')}</Button>

			<Modal
				isOpen={isModalOpen}
				onClose={handleModalClose}
				title={t(isConfirmStep ? 'filter.confirmTitle' : 'filter.modalTitle')}
				className={isConfirmStep ? 'max-w-2xl' : 'max-h-[90dvh] max-w-5xl'}
			>
				{isConfirmStep ? (
					<div className="space-y-8 px-2 py-4 text-center">
						<p className="text-lg text-slate-700">
							{t('filter.confirmDescription')}
						</p>
						<div className="flex flex-col justify-center gap-3 sm:flex-row">
							<Button
								variant="secondary"
								onClick={closeModal}
							>
								{t('filter.useOldFilter')}
							</Button>
							<Button onClick={confirmApply}>
								{t('filter.applyNewFilter')}
							</Button>
						</div>
					</div>
				) : (
					<div className="flex min-h-[50dvh] flex-col">
						<div className="flex-1 overflow-y-auto pr-1">
							{isLoading ? (
								<p className="py-16 text-center text-sm text-slate-500">
									{t('filter.loading')}
								</p>
							) : null}

							{isError ? (
								<section className="rounded-3xl border border-rose-200 bg-rose-50 p-6 text-center">
									<h2 className="text-lg font-semibold text-rose-700">
										{t('filter.errorTitle')}
									</h2>
									<p className="mt-2 text-sm text-rose-600">
										{t('filter.errorDescription')}
									</p>
								</section>
							) : null}

							{!isLoading && !isError ? (
								<FilterForm
									filterItems={filterItems}
									draftSelection={draftSelection}
									onToggleOption={handleDraftChange}
								/>
							) : null}
						</div>

						<footer className="mt-6 flex flex-col-reverse gap-3 border-t border-slate-200 pt-4 sm:flex-row sm:items-center sm:justify-center">
							<Button
								onClick={openConfirmation}
								disabled={isLoading || isError}
							>
								{t('filter.apply')}
							</Button>

							<button
								type="button"
								onClick={clearDraft}
								className="text-sm font-medium text-cyan-700 transition hover:text-cyan-800 absolute right-10"
							>
								{t('filter.clearAll')}
							</button>
						</footer>
					</div>
				)}
			</Modal>
		</>
	)
}
