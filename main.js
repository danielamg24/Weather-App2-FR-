
const getWeatherOf = async function(position){

  // Try...catch regroupe des instructions à exécuter et définit une réponse si l'une
  // de ces instructions provoque une exception  
  try{
    const { latitude, longitude } = position.coords
    // 'await' => On est en attente d'une réponse pour continuer
    res = await fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=minutely&units=metric&lang=fr&appid=63a254c550ecf376a6058cfb2b6edaa1`)

    try{
      resLocalisation = await fetch(`https://api-adresse.data.gouv.fr/reverse/?lon=${longitude}&lat=${latitude}`)

      const userLocate = await resLocalisation.json()
      // On ajouter à notre application le contenu de la ville dans class 'locate'
      document.querySelector(".locate").textContent = userLocate.features[0].properties.city

    }catch(error){
      console.error("Erreur dans le getWeather()", error)
    }
    // On récupére les données en json
    const data = await res.json();

    //On envoie les données dans la fonction updateUI
    updateUI(data)
    
  }catch(error){
    console.error("Erreur dans le getWeather()", error)
  }
}

const updateUI = function(data){
  console.log(data)
  // Math.round() retourne la valeur d'un nombre arrondi à l'entier le plus proche
   document.querySelector('h2').textContent = Math.round(data.current.temp) +'°C'
   //On affiche la date
   document.querySelector('.date').textContent = getViewDate(data.current.dt)

  //On affiche une image
   document.getElementById('imagePrincipale').src = getIcon(data.current.weather[0].icon)

   //On affiche les heures de la météo
   const hours = document.querySelector(".hours")

   for(let h = 1; h <=24; h++ ){
    const tmp = `
        <p class="HourCurrentDay">${getViewTime(data.hourly[h].dt)} </p>
        <img src="${getIcon(data.hourly[h].weather[0].icon)}" />
        <p class="TmpCurrentDay">${Math.round(data.hourly[h].temp)}°C</p>`
    
        var figure = document.createElement('figure')
        figure.innerHTML = tmp
        hours.appendChild(figure)
   } 

   const days = document.querySelector(".days")

   for(let d = 1; d <= data.daily.length; d++){
    
    if(data.daily[d]){
      const tmp = `
      <span class="dayDays" >${getViewDate(data.daily[d].dt)}</span>
      <img src="img/thermo.svg"/>
      <span>${Math.round(data.daily[d].temp.day)}°C </span>
      <img class="icon" src="${getIcon(data.daily[d].weather[0].icon)}"/>
    `
      var figure = document.createElement('figure')
      figure.innerHTML = tmp
      days.appendChild(figure)

    }
    
   }

}

// On récupére l'heure
function getViewTime(timestamp){
  let date = new Date(timestamp * 1000)
  let res = date.getHours()
  return res
}

//On formate la date en français
function getViewDate(timestamp){
  let date = new Date(timestamp * 1000)
  
  let options = {
    weekday: "long",
    month: "long",
    day: "2-digit",
    year: 'numeric'
  }
  let res = date.toLocaleDateString("fr-FR", options)
  return res
}

const getIcon = (code) => {
  switch (code) {
    case ("01d"):
    case ("01n"):
      return "img/01.svg";
      break;

    case ("02d"):
    case ("02n"):
      return "img/02.svg";
      break;

    case ("03d"):
    case ("03n"):
    case ("04n"):
    case ("04d"): 
      return "img/03.svg";
      break;

    case ("09d"):
    case ("09n"):
      return "img/09.svg";
      break;

    case ("10d"):
    case ("10n"):
      return "img/10.svg";
      break;

    case ("11d"):
    case ("11n"):
      return "img/11.svg";
      break;

    case ("13d"):
    case ("13n"):
      return "img/13.svg";
      break;

    case ("50n"):
    case ("50d"):
      return "img/50.svg";
      break;

  }
};


//On va récupérer la géolocalisation de l'endroit ou on se trouve
navigator.geolocation.getCurrentPosition(getWeatherOf)