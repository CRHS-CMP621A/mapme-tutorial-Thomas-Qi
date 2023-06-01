navigator.geolocation.getCurrentPosition(
    function (position) {
       // console.log (position);
       console.log (`https://www.google.com/maps/place/Charlottetown+Rural+High+School/@${46.2567842},${-63.1518274},15.5z`);
       const latitude = position.coords.latitude;
       const longitude = position.coords.longitude;
       console.log(latitude, longitude)
       const form = document.querySelector('.form');
       const containerWorkouts = document.querySelector('.workouts');
       const inputType = document.querySelector('.form__input--type');
       const inputDistance = document.querySelector('.form__input--distance');
       const inputDuration = document.querySelector('.form__input--duration');
       const inputCadence = document.querySelector('.form__input--cadence');
       const inputElevation = document.querySelector('.form__input--elevation');

       
       //var map = L.map('map').setView([51.505, -0.09], 13);
       const coords = [latitude, longitude]
       var map = L.map('map').setView(coords, 13)
       
       L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
       }).addTo(map);

       L.marker(coords, 13).addTo(map)
          .bindPopup('A pretty CSS popup.<br> Easily customizable.')
          .openPopup();
       
       map.on('click', function(mapEvent){
            const lat= mapEvent.latlng.lat
            const lng= mapEvent.latlng.lng
            console.log(mapEvent)
            L.marker([lat, lng]).addTo(map)
            .bindPopup(L.popup({
                maxWidth:250,
                minWidth:100,
                autoClose:false,
                closeOnClick:false,
                className:'running-popup',
            }))
            .setPopupContent('Workout')
            .openPopup();
            form.classList.remove('hidden');
            inputDistance.focus();
        })

    }, 
    function (){
        alert("Could not get the position.");
    }
);


