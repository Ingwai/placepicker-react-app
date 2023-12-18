import { useRef, useState, useEffect, useCallback } from 'react';

import Places from './components/Places.jsx';
import { AVAILABLE_PLACES } from './data.js';
import Modal from './components/Modal.jsx';
import DeleteConfirmation from './components/DeleteConfirmation.jsx';
import logoImg from './assets/logo.png';
import { sortPlacesByDistance } from './loc.js';

// pobieranie danych z localStorage działa synchronicznie więc nie potrzebujemy wrzucać ego kodu w useEffect i możemy go wyciągnąć poza funkcje komponentu bo dane początkowe z localStorage są pobierane tylko raz
const storedIds = JSON.parse(localStorage.getItem('selectedPlaces')) || [];
const storedPlaces = storedIds.map(id => AVAILABLE_PLACES.find(place => place.id === id));

function App() {
	const selectedPlace = useRef();
	const [modalIsOpen, setModalIsOpen] = useState(false);
	const [availablePlaces, setAvailablePlaces] = useState([]);
	const [pickedPlaces, setPickedPlaces] = useState(storedPlaces);

	// useEffect zostaje wykonany dopiero po całkowitym załadowaniu się/ wykonaniu funkcji componentu, nie powinno się nadużywać useEffext służy on do synchronizacji danym między innymi
	useEffect(() => {
		navigator.geolocation.getCurrentPosition(position => {
			const sortedPlaces = sortPlacesByDistance(AVAILABLE_PLACES, position.coords.latitude, position.coords.longitude);
			setAvailablePlaces(sortedPlaces);
		});
	}, []);

	function handleStartRemovePlace(id) {
		setModalIsOpen(true);
		selectedPlace.current = id;
	}

	function handleStopRemovePlace() {
		setModalIsOpen(false);
	}

	function handleSelectPlace(id) {
		setPickedPlaces(prevPickedPlaces => {
			if (prevPickedPlaces.some(place => place.id === id)) {
				return prevPickedPlaces;
			}
			const place = AVAILABLE_PLACES.find(place => place.id === id);
			return [place, ...prevPickedPlaces];
		});

		// zapisywanie w storage odbywa się wtedy gdy wykonywana jest funkcja handleSelectPlace jest to przykład efektu ubocznego który nie wymaga użycia useEffect
		const storedIds = JSON.parse(localStorage.getItem('selectedPlaces')) || [];

		if (storedIds.indexOf(id) === -1) {
			localStorage.setItem('selectedPlaces', JSON.stringify([id, ...storedIds]));
		}
	}

	// otaczamy funkcje useCallback żeby działała tylko wtedy gdy coś się zmieni jeśli nie to useCallback nie pozwoli jej się wykonać
	const handleRemovePlace = useCallback(() => {
		setPickedPlaces(prevPickedPlaces => prevPickedPlaces.filter(place => place.id !== selectedPlace.current));
		setModalIsOpen(false);

		const storedIds = JSON.parse(localStorage.getItem('selectedPlaces')) || [];
		localStorage.setItem('selectedPlaces', JSON.stringify(storedIds.filter(id => id !== selectedPlace.current)));
	}, []);

	return (
		<>
			<Modal open={modalIsOpen} onClose={handleStopRemovePlace}>
				<DeleteConfirmation onCancel={handleStopRemovePlace} onConfirm={handleRemovePlace} />
			</Modal>

			<header>
				<img src={logoImg} alt='Stylized globe' />
				<h1>PlacePicker</h1>
				<p>Create your personal collection of places you would like to visit or you have visited.</p>
			</header>
			<main>
				<Places
					title="I'd like to visit ..."
					fallbackText={'Select the places you would like to visit below.'}
					places={pickedPlaces}
					onSelectPlace={handleStartRemovePlace}
				/>
				<Places
					title='Available Places'
					places={availablePlaces}
					onSelectPlace={handleSelectPlace}
					fallbackText='Sorting places by distance...'
				/>
			</main>
		</>
	);
}

export default App;
