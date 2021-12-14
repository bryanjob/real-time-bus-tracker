/**
 * Purpose: Return Eastern time because MIT is in Eastern time zone
 * @param strTime 
 * @returns formatted time
 */
function getTimestamp(strTime) {
  // sample format 
  // Wed Dec 08 2021 11:30:00 GMT-0500 (Eastern Standard Time)
  let options = {
    weekday: 'short', 
    month: 'short', 
    day: '2-digit', 
    year: 'numeric',
    hourCycle: 'h24',
    hour: '2-digit', 
    minute: '2-digit', 
    second: '2-digit',
    timeZone: 'America/New_York'
  }

  let strTimeZoneShort = new Date(strTime).toLocaleString('en-US', {timeZone: 'America/New_York', timeZoneName: 'short'}).substr(this.length - 3);
  let strTimeZoneLong = (strTimeZoneShort === 'EDT') ? 'GMT-0400 (Eastern Daylight Time)' : 'GMT-0500 (Eastern Standard Time)';
  let formattedTime = new Date(strTime).toLocaleString('en-US', options).replace(/,/g, '') + ' ' + strTimeZoneLong;

  return formattedTime;
}
let timestamp = getTimestamp(new Date());
mapboxgl.accessToken = YOUR_MAPBOX_ACCESS_TOKEN;

const campus = [];
// MIT campus
campus.push({
  "type": "Feature", 
  "geometry": {
    "type": "Point", 
    "coordinates": [-71.093729, 42.359244]
  },
  "properties": {
    "name": "MIT Campus",
    "icon": {
      "iconUrl": "./image/marker-campus.png", 
      "iconSize": [32, 32], 
      "iconAnchor": [-40, 0]
    }
  }
});

// Harvard campus
campus.push({
  "type": "Feature", 
  "geometry": {
    "type": "Point", 
    "coordinates": [-71.118625, 42.374863]
  }, 
  "properties": {
    "name": "Harvard Campus", 
    "icon": {
      "iconUrl": "./image/marker-campus.png",
      "iconSize": [32, 32], 
      "iconAnchor": [40, 0]
    }
  }
});

const lastMitBusStop = [-71.09363, 42.358941];

const map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/streets-v11', 
  center: [-71.104081, 42.365554],
  zoom: 14
});

const addMarker = (el, coordinate, anchor = [0, 0], map) => new mapboxgl.Marker(el).setLngLat(coordinate).setOffset(anchor).addTo(map);

// add project title
document.getElementsByClassName('project-title')[0].innerText = document.title;
document.getElementsByClassName('update-time')[0].innerText = timestamp;

// add campus markers
for (const marker of campus) {
  const el = document.createElement('div');
  el.className = 'marker-campus';
  el.style.backgroundImage = `url(${marker.properties.icon.iconUrl})`;
  el.style.width = `${marker.properties.icon.iconSize[0]}px`;
  el.style.height = `${marker.properties.icon.iconSize[1]}px`;
  el.style.backgroundSize = '100%';
  el.title = marker.properties.name;

  addMarker(el, marker.geometry.coordinates, marker.properties.icon.iconAnchor, map);
}

// add bus stop markers
async function addBusStops() {
  const busStops = await getBusStops();
  for (const marker of busStops) {
    const el = document.createElement('div');
    el.className = 'marker-bus-stop';
    el.style.borderRadius = '50%';
    el.style.width = '10px';
    el.style.height = '10px';
    el.style.backgroundColor = 'green';
    el.style.opacity = '0.5';
    el.title = marker.id;

    addMarker(el, [marker.attributes.longitude, marker.attributes.latitude], [0, 0], map);
  }
}

async function run() {
  const locations = await getBusLocations();
  updateBuses(locations);
  document.getElementsByClassName('update-time')[0].innerText = getTimestamp(new Date());
  console.log(new Date());

  // timer
  setTimeout(run, 15000);
}

/**
 * Purpose: API request to Massachusetts Bay Transportation Authority to get bus locations
 * Resource: 'https://www.mbta.com/developers/v3-api'
 * @param url 'https://api-v3.mbta.com/vehicles?filter[route]=1&include=trip'
 * @return bus locations on MIT-Harvard route
 */
async function getBusLocations() {
  const url = 'https://api-v3.mbta.com/vehicles?filter[route]=1&include=trip';
  const response = await fetch(url);
  const json = await response.json();

  return json.data;
}

async function getBusStops() {
  const url = 'https://api-v3.mbta.com/stops?filter[route]=1';
  const response = await fetch(url);
  const json = await response.json();

  return json.data;
}

let buses = [];
function updateBuses(locations) {
  for (const loc of locations) {
    let coordinate = [loc.attributes.longitude, loc.attributes.latitude];
    let direction = loc.attributes.direction_id;
    let busMarker = `url(${direction ? './image/marker-bus-blue.png' : './image/marker-bus-red.png'})`;
    let occupancy = loc.attributes.occupancy_status ? loc.attributes.occupancy_status.replace(/_AVAILABLE/g, '').replace(/_/g, ' ').toLowerCase() : '';
    let title = loc.attributes.label + (occupancy.length > 0 ? ('  ' + occupancy) : '');
    let anchor = direction ? [0, -10] : [0, -20];
    let seatStatusColor = 'grey';
    switch (loc.attributes.occupancy_status) {
      case 'MANY_SEATS_AVAILABLE':
        seatStatusColor = 'lime';
        break;
      case 'FEW_SEATS_AVAILABLE':
        seatStatusColor = 'orange';
        break;
      case 'FULL':
        seatStatusColor = 'red'
        break;
      default: 
        seatStatusColor = 'grey';
    }
    let busIndex = buses.findIndex(element => element.getElement().id === loc.id);
    if (busIndex > -1) {
      // update bus location
      buses[busIndex].setLngLat(coordinate);
      buses[busIndex].setOffset(anchor);
      buses[busIndex].getElement().title = title;
      buses[busIndex].getElement().style.backgroundImage = busMarker;
      buses[busIndex].getElement().value = direction;
      buses[busIndex].getElement().style.color = seatStatusColor;
      console.log('update bus ', title, '  @ [', loc.attributes.longitude, ', ', loc.attributes.latitude, ']');
    } else {
      // add the bus
      const el = document.createElement('div');
      el.className = 'marker-bus';
      el.style.backgroundImage = busMarker;
      el.style.width = '32px';
      el.style.height = '37px';
      el.style.backgroundSize = '100%';
      el.id = loc.id;
      el.title = title;
      el.value = direction;
      el.style.textAlign = 'right';
      el.innerHTML = '●&nbsp;  ';
      el.style.color = seatStatusColor;
      el.style.textShadow = '-1px 0 white, 0 1px white, 1px 0 white, 0 -1px white';
      buses.push(addMarker(el, coordinate, anchor, map));
      console.log('add bus ', title, '  @ [', loc.attributes.longitude, ', ', loc.attributes.latitude, ']');
    }
  }
  // remove inactive bus markers
  for (let bus = (buses.length - 1); bus >= 0; bus--) {
    let busIndex = locations.findIndex(element => element.id === buses[bus].getElement().id);
    if (busIndex === -1) {
      console.log('remove bus ', buses[bus].getElement().attributes.title);
      buses[bus].remove();
      buses.splice(bus, 1);
    }    
  }
}

addBusStops();
run();

// if (params.bStatic) runStatic();
// else run();
