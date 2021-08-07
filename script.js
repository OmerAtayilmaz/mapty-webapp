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

let map,mapEvent;

//geologation api: 2 paramtere alır; success,err
if(navigator.geolocation)navigator.geolocation.getCurrentPosition(function(position){
    console.log(position)
    const {latitude,longitude}=position.coords;
    //L->leafletten geliyor
    const coords=[latitude,longitude]
     map = L.map('map').setView(coords, 13);//2. parametre zoom miktarını belirler. 
    //html sayfasında map adında id'ye sahip objeye atama yapacaktır.
                //default theme:https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png
                //hot theme: https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png
                
    L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
        attribution: "Powered By Omer Atayilmaz"
    }).addTo(map);

    map.on('click',function(mapE){
        mapEvent=mapE;
 
        form.classList.remove('hidden');
        inputDistance.focus(); //buna focuslanır.
       
    }) 
},function(){
alert('Could not get your position');
});

form.addEventListener('submit',function(e){
    //Display
    e.preventDefault();
    form.classList.add('hidden');
    //clear input fields
    inputDistance.value=inputDuration.value=inputCadence.value=inputElevation.value ='';

    const {lng,lat}=mapEvent.latlng;
    L.marker([lat,lng]).addTo(map).bindPopup(L.popup({
           maxWidth:300,
           minWidth:100,
           autoClose:false,
           closeOnClick:false,
           className:'running-popup'  
       }))
   .setPopupContent('<h4>Workout⚡</h4>')
   .openPopup();  
})


inputType.addEventListener('change',()=>{
    inputElevation.closest('.form__row').classList.toggle('form__row--hidden')
    inputCadence.closest('.form__row').classList.toggle('form__row--hidden')
})
/* Words
accuracy:hassasiyet(ölçümdeki)
altitude:rakım,yükseklik
latitude:enlem
longtitude:boylam
timestamp:zaman bilgisi
CDN:Content Delivery Network
tiles:döşeme,karolar
indeed:gerçekten,gerçekten de, hakikaten
*/
