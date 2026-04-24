import {
	type PropsWithChildren,
	type KeyboardEvent as ReactKeyboardEvent,
	useId
} from 'react'
import { createPortal } from 'react-dom'
import { useTranslation } from 'react-i18next'

import { cn } from '@/shared/lib/cn'

const getFocusableElements = (container: HTMLElement) => {
	return Array.from(
		container.querySelectorAll<HTMLElement>(
			'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
		)
	).filter(element => !element.hasAttribute('disabled'))
}

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
	const titleId = useId()

	const handleKeyDown = (event: ReactKeyboardEvent<HTMLElement>) => {
		if (event.key === 'Escape') {
			onClose()

			return
		}

		if (event.key !== 'Tab') {
			return
		}

		const dialogElement = event.currentTarget
		const focusableElements = getFocusableElements(dialogElement)
		if (focusableElements.length === 0) {
			event.preventDefault()
			dialogElement.focus()

			return
		}

		const firstFocusableElement = focusableElements[0]
		const lastFocusableElement = focusableElements[focusableElements.length - 1]

		if (event.shiftKey && document.activeElement === firstFocusableElement) {
			event.preventDefault()
			lastFocusableElement.focus()
		}

		if (!event.shiftKey && document.activeElement === lastFocusableElement) {
			event.preventDefault()
			firstFocusableElement.focus()
		}
	}

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
				ref={dialogElement => {
					if (!dialogElement) {
						return
					}

					const [firstFocusableElement] = getFocusableElements(dialogElement)
					;(firstFocusableElement ?? dialogElement).focus()
				}}
				role="dialog"
				aria-modal="true"
				aria-labelledby={titleId}
				tabIndex={-1}
				className={cn(
					'relative flex w-full flex-col overflow-hidden rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_32px_90px_rgba(15,23,42,0.26)] md:p-7',
					className
				)}
				onClick={event => {
					event.stopPropagation()
				}}
				onKeyDown={handleKeyDown}
			>
				<header className="mb-4 pb-4 text-center">
					<h2
						id={titleId}
						className="type-modal-title"
					>
						{title}
					</h2>
					<button
						type="button"
						onClick={onClose}
						aria-label={t('filter.close')}
						className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-full leading-none text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
					>
						<span
							aria-hidden="true"
							className="text-xl"
						>
							&times;
						</span>
					</button>
				</header>
				{children}
			</section>
		</div>,
		document.body
	)
}
