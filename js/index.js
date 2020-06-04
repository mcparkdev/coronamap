var map;
var markers = [];
var infoWindow;

function initMap() {
  var bogota = {lat: 4.6097100, lng: -74.0817500}
  map = new google.maps.Map(document.getElementById('map'), {
    center: bogota,
    zoom: 14
  }),
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
  // infoWindow = new google.maps.InfoWindow();
  displayCases()
  // showStoresMarkers()
}

function getLatLngByZipcode(zipcode) 
{
   if (zipcode == "NA"){
     return("Unavailable")
   }
   else{
    var geocoder = new google.maps.Geocoder();
    var address = zipcode;
    geocoder.geocode({ 'address': address }, function (results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
            var latitude = results[0].geometry.location.lat();
            var longitude = results[0].geometry.location.lng();
            alert("Latitude: " + latitude + "\nLongitude: " + longitude);
        } else {
            alert("Request failed.")
        }
    });
    return [latitude, longitude];
   }
}

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function displayCases() {
  var covidcasesHtml = "";
  covid_cases.forEach(function(covid_case){
      // console.log(covid_case);
      var ID = covid_case.ID;
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
      var zip1 = covid_case.zip1;
      var zip2 = covid_case.zip2;
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
      // console.log(getLatLngByZipcode(zip1))
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
        <div class="case-container">
          <div class="case-id-days">
            <div class="case-id">
              #${ID}
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
                ${locality}
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
        }ss
        else{
          $(".case-days").append($('<div class="case-days-new">${new_case}</div>'));
        };
      </script>
      `
      
      document.querySelector('.cases-list-container').innerHTML = covidcasesHtml
  });
}

function showStoresMarkers(){
  var bounds = new google.maps.LatLngBounds();
  covid_cases.forEach(function(covid_case){
    var latlng = new google.maps.LatLng(
      getLatLngByZipcode(covid_case.zip1)
    )
    var ID = covid_case.ID;
    var address = store.address.streetAddressLine1;
    bounds.extend(latlng);
    createMarker(latlng, name, address)
  })
  map.fitBounds(bounds);
}

function createMarker(latlng, name, address) {
  var html = "<b>" + name + "</b> <br/>" + address;
  var marker = new google.maps.Marker({
    map: map,
    position: latlng
  });
  google.maps.event.addListener(marker, 'mouseover', function() {
    infoWindow.setContent(html);
    infoWindow.open(map, marker);
  });
  markers.push(marker);
}
