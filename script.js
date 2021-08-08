'use strict';

// prettier-ignore


class Workout {
    date=new Date()
    id=(Date.now()+'').slice(-10)
    
    constructor(coords,distance,duration){
        this.coords=coords //[lat,lng]
        this.distance=distance //in km
        this.duration=duration //in min
        
    }
    _setDescription(){
        const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        this.description= `${this.type[0].toUpperCase()}${this.type.slice(1)} on ${months[this.date.getMonth()]} ${this.date.getDate()}`;

    }
}

class Running extends Workout{
    type='running'
    constructor(coords,distance,duration,cadence){
        super(coords,distance,duration)
        this.cadence=cadence
        this.calcPace()
        this._setDescription()
    }
    calcPace(){
        //min/km
        this.pace=this.duration/this.distance
        return this.pace
    }
}
class Cycling extends Workout{
    type='cycling'

    constructor(coords,distance,duration,elevationGain){
        super(coords,distance,duration)
        this.elevationGain=elevationGain
        this.calcSpeed()
        this._setDescription()
    }
    calcSpeed(){
        //km/h
        this.speed=this.distance/(this.duration/60)
        return this.speed
    }
}
    // const run1=new Running([39,-12],5.2,24,178)
    // const cycling1=new Cycling([39,-12],5.2,24,523) 
    // console.log(run1,cycling1); ctr-ö
    
////////////////////////////////////////
//APPLICATION ARCHITECTURE

const form = document.querySelector('.form');
const containerWorkouts = document.querySelector('.workouts');
const inputType = document.querySelector('.form__input--type');
const inputDistance = document.querySelector('.form__input--distance');
const inputDuration = document.querySelector('.form__input--duration');
const inputCadence = document.querySelector('.form__input--cadence');
const inputElevation = document.querySelector('.form__input--elevation');

class App {
    #map
    #mapEvent
    #workouts=[]

    constructor(){
        this._getPosition()
        form.addEventListener('submit',this._newWorkout.bind(this))//eklemezsek, thisi formdan alır!!!
        inputType.addEventListener('change',this._toggleElevationField);
    }

    _getPosition(){
        //geologation api: 2 paramtere alır; success,err
        if(navigator.geolocation)navigator.geolocation.getCurrentPosition(this._loadMap.bind(this),//bind etmezse sayfa thisi undefined olur.
        function(){alert('Could not get your position');}
        );
    }
    _loadMap(position){
        console.log(position)
            const {latitude,longitude}=position.coords;
            //L->leafletten geliyor
            const coords=[latitude,longitude]
            this.#map = L.map('map').setView(coords, 13);//2. parametre zoom miktarını belirler. 
            //html sayfasında map adında id'ye sahip objeye atama yapacaktır.
                        //default theme:https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png
                        //hot theme: https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png             
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: "Powered By Omer Atayilmaz"
            }).addTo(this.#map);
            this.#map.on('click',this._showForm.bind(this))
    }
    _showForm(mapE){
        this.#mapEvent=mapE;
        form.classList.remove('hidden');
        inputDistance.focus(); //buna focuslanır.
    }

    _hideForm() {
        // Empty inputs
        inputDistance.value = inputDuration.value = inputCadence.value = inputElevation.value =
          '';
    
        form.style.display = 'none';
        form.classList.add('hidden');
        setTimeout(() => (form.style.display = 'grid'), 1000);
      }

    _toggleElevationField(){
        inputElevation.closest('.form__row').classList.toggle('form__row--hidden')
        inputCadence.closest('.form__row').classList.toggle('form__row--hidden')
    }
    _newWorkout(e) {
        const validInputs = (...inputs) =>
          inputs.every(inp => Number.isFinite(inp));
        const allPositive = (...inputs) => inputs.every(inp => inp > 0);
    
        e.preventDefault();
    
        // Get data from form
        const type = inputType.value;
        const distance = +inputDistance.value;
        const duration = +inputDuration.value;
        const { lat, lng } = this.#mapEvent.latlng;
        let workout;
    
        // If workout running, create running object
        if (type === 'running') {
          const cadence = +inputCadence.value;
    
          // Check if data is valid
          if (
            // !Number.isFinite(distance) ||
            // !Number.isFinite(duration) ||
            // !Number.isFinite(cadence)
            !validInputs(distance, duration, cadence) ||
            !allPositive(distance, duration, cadence)
          )
            return alert('Inputs have to be positive numbers!');
    
          workout = new Running([lat, lng], distance, duration, cadence);
        }
    
        // If workout cycling, create cycling object
        if (type === 'cycling') {
          const elevation = +inputElevation.value;
    
          if (
            !validInputs(distance, duration, elevation) ||
            !allPositive(distance, duration)
          )
            return alert('Inputs have to be positive numbers!');
    
          workout = new Cycling([lat, lng], distance, duration, elevation);
        }
    
        // Add new object to workout array
        this.#workouts.push(workout);
    
        // Render workout on map as marker
        this._renderWorkoutMarker(workout);
    
        // Render workout on list
        this._renderWorkout(workout);
    
        // Hide form + clear input fields
        this._hideForm();
    
        // Set local storage to all workouts
       // this._setLocalStorage();
      }

    _renderWorkoutMarker(workout) {
        L.marker(workout.coords)
          .addTo(this.#map)
          .bindPopup(
            L.popup({
              maxWidth: 250,
              minWidth: 100,
              autoClose: false,
              closeOnClick: false,
              className: `${workout.type}-popup`,
            })
          )
          .setPopupContent(
            `${workout.type === 'running' ? '🏃‍♂️' : '🚴‍♀️'} ${workout.description}`
          )
          .openPopup();
    }
    
    _renderWorkout(workout){
        let html=`
        <li class="workout workout--${workout.type}" data-id="${workout.id}">
          <h2 class="workout__title">${workout.description}</h2>
          <div class="workout__details">
            <span class="workout__icon">${workout.type==='running'?'🏃‍♂️':'🚴‍♀️'}</span>
            <span class="workout__value">${workout.distance}</span>
            <span class="workout__unit">km</span>
          </div>
          <div class="workout__details">
            <span class="workout__icon">⏱</span>
            <span class="workout__value">${workout.duration}</span>
            <span class="workout__unit">min</span>
          </div>
        
        `
        if(workout.type==='running'){
            html +=`
                    <div class="workout__details">
                    <span class="workout__icon">⚡️</span>
                    <span class="workout__value">${workout.pace.toFixed(1)}</span>
                    <span class="workout__unit">min/km</span>
                </div>
                <div class="workout__details">
                    <span class="workout__icon">🦶🏼</span>
                    <span class="workout__value">${workout.cadence}</span>
                    <span class="workout__unit">spm</span>
                </div>
                </li>
            `;
        }
    }
}
const app=new App();










/* Words
accuracy:hassasiyet(ölçümdeki)
altitude:rakım,yükseklik
latitude:enlem
longtitude:boylam
timestamp:zaman bilgisi
CDN:Content Delivery Network
tiles:döşeme,karolar
indeed:gerçekten,gerçekten de, hakikaten
beside:yanında,üstelik,diğer taraftan
pace:tempo,yürüyüş
straightforward:basit,açık
*/
