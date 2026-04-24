import { useTranslation } from 'react-i18next'

import { FilterModalFlow } from '@/features/filter-modal/ui/FilterModalFlow'
import { FilterSummary } from '@/features/filter-summary/ui/FilterSummary'

export const HomePage = () => {
	const { t } = useTranslation()

	return (
		<main className="min-h-dvh bg-[radial-gradient(circle_at_top_left,_rgba(18,120,149,0.25),_transparent_32%),linear-gradient(180deg,_#eef6f7_0%,_#f9fbfb_42%,_#f3f6f7_100%)] px-4 py-8 text-slate-900">
			<div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
				<section className="overflow-hidden rounded-[32px] border border-white/70 bg-white/85 p-6 shadow-[0_24px_80px_rgba(15,23,42,0.14)] backdrop-blur md:p-8">
					<div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
						<div className="max-w-2xl space-y-3">
							<p className="text-sm font-medium uppercase tracking-[0.24em] text-cyan-700">
								{t('filter.pageEyebrow')}
							</p>
							<h1 className="text-4xl font-semibold tracking-tight text-slate-900">
								{t('filter.pageTitle')}
							</h1>
							<p className="max-w-xl text-base leading-7 text-slate-600">
								{t('filter.pageDescription')}
							</p>
						</div>
						<FilterModalFlow />
					</div>
				</section>

				<FilterSummary />
			</div>
		</main>
	)
}
