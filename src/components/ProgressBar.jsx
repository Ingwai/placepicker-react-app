import React, { useEffect, useState } from 'react';

const TIMER = 4000;

const ProgressBar = ({ TIMER }) => {
	const [remainingTime, setRemainingTime] = useState(TIMER);
	useEffect(() => {
		const interval = setInterval(() => {
			setRemainingTime(prevTime => prevTime - 20);
		}, 20);

		return () => {
			clearInterval(interval);
		};
	}, []);

	return <progress value={remainingTime} max={TIMER} />;
};

export default ProgressBar;
