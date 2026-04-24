import type { ButtonHTMLAttributes, PropsWithChildren } from 'react'

import { cn } from '@/shared/lib/cn'

interface ButtonProps
	extends PropsWithChildren,
		ButtonHTMLAttributes<HTMLButtonElement> {
	variant?: 'primary' | 'secondary'
}

export const Button = ({
	children,
	className,
	variant = 'primary',
	type = 'button',
	...props
}: ButtonProps) => {
	return (
		<button
			type={type}
			className={cn(
				'inline-flex min-h-16 w-[184px] items-center justify-center rounded-xl border px-5 text-base font-semibold transition focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60',
				variant === 'primary'
					? 'border-orange-500 bg-orange-500 text-white hover:border-orange-600 hover:bg-orange-600 '
					: 'border-slate-300 bg-white text-slate-700 hover:border-slate-400 hover:bg-slate-50',
				className
			)}
			{...props}
		>
			{children}
		</button>
	)
}
