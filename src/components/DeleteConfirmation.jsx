import { useEffect } from 'react';
import ProgressBar from './ProgressBar';

const TIMER = 4000;

export default function DeleteConfirmation({ onConfirm, onCancel }) {
	useEffect(() => {
		const timer = setTimeout(() => {
			onCancel();
		}, TIMER);

		// wstawiamy funkcję czyszczącą aby wyłączyć setTimeout przed następnym uruchomieniem
		return () => {
			clearTimeout(timer);
		};
	}, [onCancel]);
	// gdy wstawiamy funkcję jako zależność trzeba uważać bo może ona się gdzieś wywoływać i będzie uruchamiała cały czas useEfenct i spowodóje petle niekończaca dlatego dobrze jest w tedy użyc haka useCallback

	return (
		<div id='delete-confirmation'>
			<h2>Are you sure?</h2>
			<p>Do you really want to remove this place?</p>
			<div id='confirmation-actions'>
				<button onClick={onCancel} className='button-text'>
					No
				</button>
				<button onClick={onConfirm} className='button'>
					Yes
				</button>
			</div>
			{/* aby uniknąć ciągłych renderowań co 10milisekund progessbar zostały osobnym komponentem wtedy ten komponent się nie	renderuje tak często. */}
			<ProgressBar TIMER={TIMER} />
		</div>
	);
}
