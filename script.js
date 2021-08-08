'use strict';

// prettier-ignore
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

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
    _toggleElevationField(){
        inputElevation.closest('.form__row').classList.toggle('form__row--hidden')
        inputCadence.closest('.form__row').classList.toggle('form__row--hidden')
    }
    _newWorkout(e){
         //Display
            console.log(this);
        e.preventDefault();
        form.classList.add('hidden');
        //clear input fields
        inputDistance.value=inputDuration.value=inputCadence.value=inputElevation.value ='';

        const {lng,lat}=this.#mapEvent.latlng;
        L.marker([lat,lng]).addTo(this.#map).bindPopup(L.popup({
            maxWidth:300,
            minWidth:100,
            autoClose:false,
            closeOnClick:false,
            className:'running-popup'  
        }))
        .setPopupContent('<h4>Workout⚡</h4>')
        .openPopup();  
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

*/
