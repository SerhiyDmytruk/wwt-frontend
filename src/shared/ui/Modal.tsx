import { type PropsWithChildren, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { useTranslation } from 'react-i18next'

import { cn } from '@/shared/lib/cn'

interface ModalProps extends PropsWithChildren {
	isOpen: boolean
	onClose: () => void
	title: string
	className?: string
}

export const Modal = ({
	children,
	className,
	isOpen,
	onClose,
	title
}: ModalProps) => {
	const { t } = useTranslation()

	useEffect(() => {
		if (!isOpen) {
			return
		}

		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key === 'Escape') {
				onClose()
			}
		}

		document.body.style.overflow = 'hidden'
		window.addEventListener('keydown', handleKeyDown)

		return () => {
			document.body.style.overflow = ''
			window.removeEventListener('keydown', handleKeyDown)
		}
	}, [isOpen, onClose])

	if (!isOpen) {
		return null
	}

	return createPortal(
		<div
			className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4 backdrop-blur-sm"
			role="presentation"
			onClick={onClose}
		>
			<section
				role="dialog"
				aria-modal="true"
				aria-label={title}
				className={cn(
					'relative flex w-full flex-col overflow-hidden rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_32px_90px_rgba(15,23,42,0.26)] md:p-7',
					className
				)}
				onClick={event => {
					event.stopPropagation()
				}}
			>
				<header className="mb-4 border-b border-slate-200 pb-4 text-center">
					<h2 className="text-[1.75rem] font-semibold tracking-tight text-slate-900">
						{title}
					</h2>
					<button
						type="button"
						onClick={onClose}
						aria-label={t('filter.close')}
						className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-full text-xl leading-none text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
					>
						<span aria-hidden="true">&times;</span>
					</button>
				</header>
				{children}
			</section>
		</div>,
		document.body
	)
}
