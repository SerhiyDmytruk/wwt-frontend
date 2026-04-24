import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import { useFilterStore } from '@/entities/filter/model/filterStore'

export const FilterSummary = () => {
	const { t } = useTranslation()
	const appliedFilters = useFilterStore(state => state.appliedFilters)

	const formattedValue = useMemo(
		() => JSON.stringify(appliedFilters, null, 2),
		[appliedFilters]
	)

	return (
		<section className="overflow-hidden rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)] md:p-8">
			<header className="mb-4">
				<h2 className="text-2xl font-semibold tracking-tight text-slate-900">
					{t('filter.summaryTitle')}
				</h2>
				<p className="mt-2 text-sm leading-6 text-slate-600">
					{t('filter.summaryDescription')}
				</p>
			</header>

			<pre className="overflow-x-auto rounded-3xl bg-slate-950 p-5 text-sm leading-6 text-emerald-300">
				{formattedValue}
			</pre>
		</section>
	)
}
