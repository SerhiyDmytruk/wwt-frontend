import { useTranslation } from 'react-i18next'

import type { FilterItem } from '@/shared/api/types/Filter'

interface FilterFormProps {
	filterItems: FilterItem[]
	draftSelection: Record<string, string[]>
	onToggleOption: (filterId: string, optionId: string) => void
}

export const FilterForm = ({
	filterItems,
	draftSelection,
	onToggleOption
}: FilterFormProps) => {
	const { t } = useTranslation()

	return (
		<form className="space-y-6 pt-6 border-t-2 border-slate-200">
			{filterItems.map(filterItem => {
				const selectedOptions = draftSelection[filterItem.id] ?? []

				return (
					<fieldset
						key={filterItem.id}
						className="border-b-2 border-slate-200 pb-6 last:border-b-0 last:pb-0"
					>
						<legend className="type-section-title">{filterItem.name}</legend>
						{filterItem.description ? (
							<p className="mt-2 text-sm leading-6 text-slate-500">
								{filterItem.description}
							</p>
						) : null}
						<div className="mt-4 grid gap-x-6 gap-y-4 md:grid-cols-2 xl:grid-cols-3">
							{filterItem.options.map(option => {
								const inputId = `${filterItem.id}-${option.id}`

								return (
									<label
										key={option.id}
										htmlFor={inputId}
										className="flex cursor-pointer items-start gap-3 rounded-2xl border border-transparent px-1 py-1 transition hover:border-slate-200 hover:bg-slate-50"
									>
										<input
											id={inputId}
											type="checkbox"
											checked={selectedOptions.includes(option.id)}
											onChange={() => onToggleOption(filterItem.id, option.id)}
											className="mt-1 h-4 w-4 rounded border-slate-300 text-orange-500 focus:ring-orange-500"
										/>
										<span className="space-y-1">
											<span className="type-option-title block">
												{option.name}
											</span>
											{option.description ? (
												<span className="block text-xs leading-5 text-slate-500">
													{option.description}
												</span>
											) : (
												<span className="block text-xs leading-5 text-slate-400">
													{t('filter.noDescription')}
												</span>
											)}
										</span>
									</label>
								)
							})}
						</div>
					</fieldset>
				)
			})}
		</form>
	)
}
