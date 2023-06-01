'use strict';

// prettier-ignore
// const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const form = document.querySelector('.form');
const containerWorkouts = document.querySelector('.workouts');
const inputType = document.querySelector('.form__input--type');
const inputDistance = document.querySelector('.form__input--distance');
const inputDuration = document.querySelector('.form__input--duration');
const inputCadence = document.querySelector('.form__input--cadence');
const inputElevation = document.querySelector('.form__input--elevation');

let map;
let mapEvent;
let workouts = [];

class Workout{
    date = new Date();
    id = (Date.now() + '').slice(-10);

    constructor(coords, distance, duration){
        this.coords = coords;
        this.distance = distance;
        this.duration = duration;
     }
}


class Running extends Workout{
    type = "Running";
    constructor(coords, distance, duration,cadence){
        super(coords, distance, duration); // from Workout class
        this.cadence = cadence;
        this.calcPace(); //calculate the pace
        this.setDescription(); //start the description for the workout title
    }

    //Methods
    calcPace(){
        //min / km
        this.pace = this.duration / this.distance;
        this.pace = this.pace.toFixed(1);
        return this.pace
    }
    
    setDescription(){ //Running on ___date ___
         this.description = `${this.type} on ${this.date.toDateString()}`;
    }
}


class Cycling extends Workout{
    type = "Cycling"
    constructor(coords, distance, duration, elevationGain){
        super(coords, distance, duration);
        this.elevation  = elevationGain;
        this.calcSpeed();
        this.setDescription();
    }

    calcSpeed(){
        this.speed = this.duration / this.distance;
        this.speed = this.pace.toFixed(1);
        return this.speed
    }
    setDescription(){
        this.description = `${this.type} on ${this.date.toDateString()}`
    }

}

//Testing classes by passing in test parameters
const run1 = new Running([39,-12], 5.2, 24, 178);
const cycling1 = new Cycling([39,-12], 27, 95, 523);
console.log(run1, cycling1) 


navigator.geolocation.getCurrentPosition(
    function (position) {
       // console.log (position);
       console.log (`https://www.google.com/maps/place/Charlottetown+Rural+High+School/@${46.2567842},${-63.1518274},15.5z`);
       const latitude = position.coords.latitude;
       const longitude = position.coords.longitude;
       console.log(latitude, longitude)
       //var map = L.map('map').setView([51.505, -0.09], 13);
       const coords = [latitude, longitude]

       
       map = L.map('map').setView(coords, 13);

       map.on('click', function(mapE){
            mapEvent=mapE; // Task 3.2

            //Task 3.1
            form.classList.remove('hidden');
            inputDistance.focus();
            
       })
       
       L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
       }).addTo(map);

       const data = JSON.parse(localStorage.getItem("workouts", JSON.stringify(workouts)))
       
       //check if there is any data already stored
       if (data){
        workouts = data; //load data into Workouts array
        console.log(data);
       }

    }, 
    function (){
        alert("Could not get the position.");
    },
);

form.addEventListener('submit', function(e){
    e.preventDefault(); // prevent from reloading the page

    const type = inputType.Value
    const distance = Number(inputDistance.value)//convert to number
    const duration = Number(inputDuration.value)
    const lat= mapEvent.latlng.lat;
    const lng= mapEvent.latlng.lng;
    let workout;

    // If workout type running, create running object
    if (type === 'running'){
        const cadence = Number(inputCadence.value);
        //validate from data later

        //create new Running object
        workout = new Running([lat, lng], distance, duration, cadence)
        workouts.push(workout)
        console.log(workouts)
        localStorage.setItem("workouts", JSON.stringify(workouts));
    }
    // if workout type cycling, create cycling object
    if (type === 'cycling'){
        const elevation = +inputElevation.value
        
        //create new Cycling object
        workout = new Cycling([lat, lng], distance, duration, elevation);
        workouts.push(workout)
        console.log(workouts)
        localStorage.setItem("workouts", JSON.stringify(workouts));
    }

     
    
    //Render workout in sidebar for user
    let html;
    
    for (let workout of workouts){
         let lat = workout.coords[0];
         let lng = workout.coords[1];
    } 


    if (type === `running`){
        html = `<li class="workout workout--running" data-id=${workouts.id}>
                 <h2 class="workout__title">${workouts.description}</h2>
                 <div class="workout__details">
                     <span class="workout__icon">🏃‍♂️</span>
                     <span class="workout__value">${workouts.distance}</span>
                     <span class="workout__unit">km</span>
                 </div>
                 <div class="workout__details">
                     <span class="workout__icon">⏱</span>
                     <span class="workout__value">${workouts.duration}</span>
                     <span class="workout__unit">min</span>
                 </div>
                 <div class="workout__details">
                     <span class="workout__icon">⚡️</span>
                     <span class="workout__value">${workouts.pace}</span>
                     <span class="workout__unit">min/km</span>
                 </div>
                 <div class="workout__details">
                     <span class="workout__icon">🦶🏼</span>
                     <span class="workout__value">${workouts.cadence}</span>
                     <span class="workout__unit">spm</span>
                 </div>
               </li>`
               
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
               form.reset()
    }else if (workout.type === `cycling`){
        html += `<li class="workout workout--cycling" data-id=${workouts.id}>
                    <h2 class="workout__title">${workouts.description}</h2>
                    <div class="workout__details">
                       <span class="workout__icon">🚴‍♀️</span>
                       <span class="workout__value">${workouts.distance}</span>
                       <span class="workout__unit">km</span>
                    </div>
                    <div class="workout__details">
                       <span class="workout__icon">⏱</span>
                       <span class="workout__value">${workouts.duration}</span>
                       <span class="workout__unit">min</span>
                    </div>
                    <div class="workout__details">
                       <span class="workout__icon">⚡️</span>
                       <span class="workout__value">${workouts.speed}</span>
                       <span class="workout__unit">km/h</span>
                    </div>
                    <div class="workout__details">
                       <span class="workout__icon">⛰</span>
                       <span class="workout__value">${workouts.elevation}</span>
                       <span class="workout__unit">m</span>
                    </div>
                  </li>`

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
     
    }
    form.insertAdjacentHTML("aftered", html);

    form.reset()
    form.classList.add("hidden");

});


inputType.addEventListener('change', function(){
    inputCadence.closest('.form__row').classList.toggle('form__row--hidden');
    inputElevation.closest('.form__row').classList.toggle('form__row--hidden');
});

containerWorkouts.addEventListener("click", function(e){
    const workoutE1 = e.target.closest(".workout");
    
    if (!workoutE1) return;
    
    const workout = workouts.find(work)

    map.setView(workout.coords, 13,{
        //set the Map view to the location of the workout coordinates
        animate: true,
        pan:{
            duration: 1,
        },
    });
});
