var map;
var markers = [];
var infoWindow;

function initMap() {
  var styledMapType = new google.maps.StyledMapType(
      [
        {elementType: 'geometry', stylers: [{color: '#ebe3cd'}]},
        {elementType: 'labels.text.fill', stylers: [{color: '#523735'}]},
        {elementType: 'labels.text.stroke', stylers: [{color: '#f5f1e6'}]},
        {
          featureType: 'administrative',
          elementType: 'geometry.stroke',
          stylers: [{color: '#c9b2a6'}]
        },
        {
          featureType: 'administrative.land_parcel',
          elementType: 'geometry.stroke',
          stylers: [{color: '#dcd2be'}]
        },
        {
          featureType: 'administrative.land_parcel',
          elementType: 'labels.text.fill',
          stylers: [{color: '#ae9e90'}]
        },
        {
          featureType: 'landscape.natural',
          elementType: 'geometry',
          stylers: [{color: '#dfd2ae'}]
        },
        {
          featureType: 'poi',
          elementType: 'geometry',
          stylers: [{color: '#dfd2ae'}]
        },
        {
          featureType: 'poi',
          elementType: 'labels.text.fill',
          stylers: [{color: '#93817c'}]
        },
        {
          featureType: 'poi.park',
          elementType: 'geometry.fill',
          stylers: [{color: '#a5b076'}]
        },
        {
          featureType: 'poi.park',
          elementType: 'labels.text.fill',
          stylers: [{color: '#447530'}]
        },
        {
          featureType: 'road',
          elementType: 'geometry',
          stylers: [{color: '#f5f1e6'}]
        },
        {
          featureType: 'road.arterial',
          elementType: 'geometry',
          stylers: [{color: '#fdfcf8'}]
        },
        {
          featureType: 'road.highway',
          elementType: 'geometry',
          stylers: [{color: '#f8c967'}]
        },
        {
          featureType: 'road.highway',
          elementType: 'geometry.stroke',
          stylers: [{color: '#e9bc62'}]
        },
        {
          featureType: 'road.highway.controlled_access',
          elementType: 'geometry',
          stylers: [{color: '#e98d58'}]
        },
        {
          featureType: 'road.highway.controlled_access',
          elementType: 'geometry.stroke',
          stylers: [{color: '#db8555'}]
        },
        {
          featureType: 'road.local',
          elementType: 'labels.text.fill',
          stylers: [{color: '#806b63'}]
        },
        {
          featureType: 'transit.line',
          elementType: 'geometry',
          stylers: [{color: '#dfd2ae'}]
        },
        {
          featureType: 'transit.line',
          elementType: 'labels.text.fill',
          stylers: [{color: '#8f7d77'}]
        },
        {
          featureType: 'transit.line',
          elementType: 'labels.text.stroke',
          stylers: [{color: '#ebe3cd'}]
        },
        {
          featureType: 'transit.station',
          elementType: 'geometry',
          stylers: [{color: '#dfd2ae'}]
        },
        {
          featureType: 'water',
          elementType: 'geometry.fill',
          stylers: [{color: '#b9d3c2'}]
        },
        {
          featureType: 'water',
          elementType: 'labels.text.fill',
          stylers: [{color: '#92998d'}]
        }
      ],
      {name: 'Retro'});

  // Create a map object, and include the MapTypeId to add
  // to the map type control.
  var bogota = {lat: 4.6097100, lng: -74.0817500}
  map = new google.maps.Map(document.getElementById('map'), {
    center: bogota,
    zoom: 14,
    mapTypeControlOptions: {
      mapTypeIds: ['roadmap', 'satellite', 'hybrid', 'terrain',
              'styled_map']
    }
  });

  //Associate the styled map with the MapTypeId and set it to display.
  map.mapTypes.set('styled_map', styledMapType);
  map.setMapTypeId('styled_map');
  infoWindow = new google.maps.InfoWindow();
  searchCases();
}


function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function actionNav() {
  var x = document.getElementById("mySidebar");
  if (x.style.left === "-400px") {
    openNav();
  } else {
    closeNav();
  }
}

function openNav() {
  document.getElementById("mySidebar").style.left = "0";
  document.getElementById("main").style.marginLeft = "400px";
}

function closeNav() {
  document.getElementById("mySidebar").style.left = "-400px";
  document.getElementById("main").style.marginLeft= "0";
}




var search = document.getElementById("case-search-input");
search.addEventListener("keyup", function(event) {
  event.preventDefault();
  if (event.keyCode === 13){
    searchCases();
  }
});

function searchCases(){
  var foundCases = [];
  var input = document.getElementById("case-search-input").value;
  if(input){
    covid_cases.forEach(function(covid_case){
      var id = covid_case.ID;
      var locality = covid_case.Localidad;
      var date = covid_case.Fecha;
      var age = covid_case.Edad
      var gender = covid_case.Género;
      var cause = covid_case.Causa;
      var place = covid_case.Lugar;
      var state = covid_case["Estado actual"];
      var day = covid_case.Día;
      var month = covid_case.Mes;
      var year = covid_case.Año;
      var now = new Date();
      var case_date = new Date(year, month-1, day);
      const days_ago = parseInt((now - case_date) / (1000 * 60 * 60 * 24), 10);
      var days_ago_text = days_ago.toString() + (days_ago == 1 ? ' día' : ' días');
      var weekday = capitalizeFirstLetter(case_date.toLocaleDateString('es-co',{ weekday: 'long'}));      
      if (id.indexOf(input) > -1 ||
          locality.indexOf(input) > -1 ||
          age.indexOf(input) > -1 ||
          gender.indexOf(input) > -1 ||
          cause.indexOf(input) > -1 ||
          place.indexOf(input) > -1 ||
          state.indexOf(input) > -1 ||
          date.indexOf(input) > -1 ||
          days_ago_text.indexOf(input) > -1 ||
          weekday.indexOf(input) > -1 )
      {
        foundCases.push(covid_case);
      }
    });
  } else {
    foundCases = covid_cases;
  }
  if (!Array.isArray(foundCases) || !foundCases.length) {
    foundCases = covid_cases;
  }
  clearLocations();
  displayCases(foundCases);
  showLocalitiesMarkers(foundCases);
  setOnClickListener();
}

function clearLocations(){
  infoWindow.close();
  for (var i = 0; i < markers.length; i++) {
    markers[i].setMap(null);
  }
  markers.length = 0;
}

function setOnClickListener(){
  var caseElements = document.querySelectorAll('.case-container');
  caseElements.forEach(function(elem, index){
    elem.addEventListener('click',function(){
      google.maps.event.trigger(markers[index], 'click');
    })
  });
}

function displayCases(covid_cases) {
  var covidcasesHtml = "";
  covid_cases.forEach(function(covid_case){
      // console.log(covid_case);
      var id = covid_case.ID;
      var date = covid_case.Fecha;
      var city = covid_case.Ciudad;
      var locality = covid_case.Localidad;
      var age = covid_case.Edad
      var gender = covid_case.Género;
      var cause = covid_case.Causa;
      var place = covid_case.Lugar;
      var state = covid_case["Estado actual"];
      var day = covid_case.Día;
      var month = covid_case.Mes;
      var year = covid_case.Año;
      var lat = covid_case.Latitud;
      var lng = covid_case.Longitud;
      var surface = covid_case.Superficie;
      var population = covid_case.Población;
      var density = covid_case.Densidad;
      var case_days = "block";
      var new_case = "none";
      var now = new Date();
      var case_date = new Date(year, month-1, day);
      const days_ago = parseInt((now - case_date) / (1000 * 60 * 60 * 24), 10);
      var days_ago_text = days_ago.toString() + (days_ago == 1 ? ' día' : ' días');
      if (days_ago == 0){
        case_days = "none";
        new_case = "block";
      }
      var cause_1, cause_2, cause_3, cause_4 = "color: #CCC;";
      switch(cause){
        case "Importado":
          cause_1 = "color: #3399FE;";
          break;
        case "Relacionado":
          cause_2 = "color: #3399FE;";
          break;
        case "En estudio":
          cause_3 = "color: #3399FE;";
          break;
        case "Desconocido":
          cause_4 = "color: #3399FE;";
          break;
        default:
          cause_1, cause_2, cause_3, cause_4 = "color: #CCC;";
      }
      var weekday = capitalizeFirstLetter(case_date.toLocaleDateString('es-co',{ weekday: 'long'}));      
      covidcasesHtml += `
        <div id="case-container" class="case-container">
          <div class="case-container-background">
            <div class="case-id-days">
              <div class="case-id">
                #${id}
              </div>
              <div class="case-days">
                <div class="case-days-ago" style="display:${case_days}">
                  ${days_ago_text}
                </div>
                <div class="case-days-new" style="display:${new_case}">
                  Nuevo
                </div>
              </div>
            </div>
            <div class="case-info">
              <div class="case-locality-state">
                <div class="case-locality">
                  <strong>${locality}</strong>
                </div>
                <div class="case-state">
                  ${state}
                </div>
              </div>
              <div class="case-date-age-gender">
                <div class="case-date">
                  ${day}.${month}.${year} (${weekday})
                </div>
                <div class="case-age">
                  ${age} años
                </div>
                <div class="case-gender">
                  ${gender} 
                </div>
              </div>
              <div class="case-cause">
                <div class="case-cause-1" style="${cause_1}">
                  Importado
                </div>
                <div class="case-cause-2" style="${cause_2}">
                  Relacionado
                </div>
                <div class="case-cause-3" style="${cause_3}">
                  En estudio
                </div>
                <div class="case-cause-4" style="${cause_4}">
                  ?
                </div>
              </div>
            </div>
          </div>
          <script>
            if(${days_ago} == 0){
              $(".case-days").append($('<div class="case-days-ago">${days_ago}</div>'));
            }
            else{
              $(".case-days").append($('<div class="case-days-new">${new_case}</div>'));
            };
          </script>
        </div>
      `
      
      document.querySelector('.cases-list-container').innerHTML = covidcasesHtml
  });
}

function showLocalitiesMarkers(covid_cases){
  var bounds = new google.maps.LatLngBounds();
  covid_cases.forEach(function(covid_case, index){
    if(covid_case.Localidad == "Sin Dato" || covid_case.Localidad == "Fuera de Bogotá"){
      var latlng = new google.maps.LatLng(
        lat = 4.6097100,
        lng = -74.0817500);
        var name = "Desconocido";
    }
    else{
      var latlng = new google.maps.LatLng(
        lat = covid_case.Latitud,
        lng = covid_case.Longitud);
      var name = covid_case.Localidad;
    }
    var day = covid_case.Día;
    var month = covid_case.Mes;
    var year = covid_case.Año;
    var case_date = new Date(year, month-1, day);
    var weekday = capitalizeFirstLetter(case_date.toLocaleDateString('es-co',{ weekday: 'long'}));      
    var place = covid_case.Lugar;
    var age = covid_case.Edad
    var id = covid_case.ID;
    bounds.extend(latlng);
    // console.log(name);
    createMarker(latlng, id, name, weekday, day, month, year, place, age, index);
  })
  map.fitBounds(bounds);
}

function createMarker(latlng, id, name, weekday, day, month, year, place, age, index) {
  var html =`
		<div class="case-info-window">
      <div class="case-info-id">
        #${id}
      </div>
      <div class="case-info-name">
        <strong>${name}</strong>
      </div>
      <div class="case-info-date">
        ${day}.${month}.${year} (${weekday})
      </div>
      <div class="case-info-place">
        ${place}
      </div>
		</div>
  `
  var marker = new google.maps.Marker({
    map: map,
    position: latlng,
    // label: `${index+1}`
  });
  google.maps.event.addListener(marker, 'click', function() {
    infoWindow.setContent(html);
    infoWindow.open(map, marker);
    jQuery('.gm-style').removeClass('gm-style');
  });
  markers.push(marker);
}

  // if (navigator.geolocation) {
  //   navigator.geolocation.getCurrentPosition(function(position) {
  //     var pos = {
  //       lat: position.coords.latitude,
  //       lng: position.coords.longitude
  //     };

  //     infoWindow.setPosition(pos);
  //     infoWindow.setContent('Location found.');
  //     infoWindow.open(map);
  //     map.setCenter(pos);
  //   }, function() {
  //     handleLocationError(true, infoWindow, map.getCenter());
  //   });
  // } else {
  //   // Browser doesn't support Geolocation
  //   handleLocationError(false, infoWindow, map.getCenter());
  // }
  // function handleLocationError(browserHasGeolocation, infoWindow, pos) {
  //   infoWindow.setPosition(pos);
  //   infoWindow.setContent(browserHasGeolocation ?
  //                         'Error: The Geolocation service failed.' :
  //                         'Error: Your browser doesn\'t support geolocation.');
  //   infoWindow.open(map);
  // }