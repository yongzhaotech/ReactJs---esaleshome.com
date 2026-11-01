import React, { useEffect, useRef, useState } from 'react';

export interface DropdownOption<K extends string = string> {
	key: K;
	label: string;
}

interface DropdownProps<K extends string> {
	title: string;
	id: string;
	options: DropdownOption<K>[];
	onSelect: (key: K) => void;
	pullRight?: boolean;
}

const Dropdown = <K extends string,>({ title, id, options, onSelect, pullRight = false }: DropdownProps<K>) => {
	const [open, setOpen] = useState(false);
	const dropdownRef = useRef<HTMLDivElement>(null);
	const buttonRef = useRef<HTMLButtonElement>(null);

	useEffect(() => {
		if (!open) {
			return;
		}

		const closeOnOutsideClick = (event: MouseEvent) => {
			if (event.target instanceof Node && !dropdownRef.current?.contains(event.target)) {
				setOpen(false);
			}
		};
		document.addEventListener('mousedown', closeOnOutsideClick);
		return () => document.removeEventListener('mousedown', closeOnOutsideClick);
	}, [open]);

	const closeOnEscape = (event: React.KeyboardEvent<HTMLDivElement>) => {
		if (event.key === 'Escape') {
			setOpen(false);
			buttonRef.current?.focus();
		}
	};

	return (
		<div
			ref={dropdownRef}
			className={`dropdown${open ? ' open' : ''}`}
			onKeyDown={closeOnEscape}
		>
			<button
				ref={buttonRef}
				type="button"
				className="btn btn-default btn-sm dropdown-toggle"
				id={id}
				aria-haspopup="true"
				aria-expanded={open}
				onClick={() => setOpen(!open)}
			>
				{title}
			</button>
			<ul className={`dropdown-menu${pullRight ? ' dropdown-menu-right' : ''}`} role="menu" aria-labelledby={id}>
				{options.map(option => (
					<li key={option.key} role="presentation">
						<button
							type="button"
							className="dropdown-menu-button"
							role="menuitem"
							onClick={() => {
								onSelect(option.key);
								setOpen(false);
							}}
						>
							{option.label}
						</button>
					</li>
				))}
			</ul>
		</div>
	);
};

export default Dropdown;
