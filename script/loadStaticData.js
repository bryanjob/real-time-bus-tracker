const mapboxpkStr = 
  '504b0e45596a11694a4f4979121953426719507a636953694d' + 
  '65496f496a4a411347596d126a49446769587a6765136d4e76' + 
  '5345787a534377544d6d136a53694e100e4f4f636a43624212' + 
  '524279594a756d6c45796f4d5347';

const mapboxTk = mpbx => {
  const textToChars = text => text.split('').map(c => c.charCodeAt(0));
  const mpbxToChar = code => textToChars(mpbx).reduce((a,b) => a ^ b, code);
  return pk => pk.match(/.{1,2}/g)
    .map(hex => parseInt(hex, 16))
    .map(mpbxToChar)
    .map(charCode => String.fromCharCode(charCode))
    .join('');
}

let mapboxpk = '';
let mapboxtoken = '';
let interval = 5000;
let frames = 240;
const queryString = window.location.search;
const params = {
  bParams: false, 
  bStatic: false
};

if (queryString.length > 0) {
  const urlParams = new URLSearchParams(queryString);
  if (urlParams.get('mapboxpk')) mapboxpk = urlParams.get('mapboxpk');
  if (urlParams.get('mapboxtoken')) mapboxtoken = urlParams.get('mapboxtoken');
  if (urlParams.get('static')) {
    params.bStatic = true;
    params.iStatic = 0;
  }
  params.bParams = true;
} else console.log('++++ no query string');

function getBusLocationsStatic() {
  console.log('++++++ static bus index ', params.iStatic);
  const json = staticData[params.iStatic].response;  

  return  json.data;
}

function runStatic() {
  console.log('++++ run static data');
  const locations = getBusLocationsStatic();
  updateBuses(locations);
  document.getElementsByClassName('update-time')[0].innerText = getTimestamp(staticData[params.iStatic].timestamp);
  if (params.iStatic < frames) {    
    params.iStatic++;
  }
  else console.log('++++++ ', frames, ' frames reached, no more static data');
  console.log(new Date());

  // timer
  setTimeout(runStatic, interval);
}

const YOUR_MAPBOX_ACCESS_TOKEN = (mapboxtoken.length > 0) ? mapboxtoken : mapboxTk(mapboxpk)(mapboxpkStr);