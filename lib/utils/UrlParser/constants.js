exports.URL_REGEXP = /^https?:\/\/(www\.)?google(.*)\/maps\/((?<queryType>(place|dir|search))\/(?<query>.*)\/)?@(?<position>[0-9\.\,a-z]+)(\/data=(?<data>(.*)))?/
// exports.URL_REGEXP = /^https?:\/\/(www\.)?google(.*)\/maps\/((?<queryType>(place|dir|search))\/(?<query>.*)\/)?@(?<position>[0-9\.\,a-z]+)(\/data=(?<data>(.*)))?/

exports.MAPTYPES = {
  MAP: 0,
  STREET_VIEW: 1,
  PHOTO: 2,
  SATELLITE: 3,
  0: 'MAP',
  1: 'STREET_VIEW',
  2: 'PHOTO',
  3: 'SATELLITE',
}

exports.ERROR_TYPES = {
  REMAIND: 'REMAIND',
  FIELDNAME: 'FIELDNAME',
  ENUMSTR: 'ENUMSTR',
}

exports.DEFAULT_ZOOM = 10
exports.DEFAULT_METERS = 10000

const s = {
  4: 5892527,
  5: 2946264,
  6: 1473132,
  7: 736566,
  8: 368283,
  9: 184141,
  10: 92071,
  11: 46035,
  // 11: 24306
  // 11: 26202
  // 11: 68075,
}

function calculateZoom(WidthPixel, Ratio, Lat, Length) {
  // from a segment Length (km),
  // with size ratio of the segment expected on a map (70%),
  // with a map WidthPixel width in pixels (100px),
  // and a latitude (45°) we can get the best Zoom
  // assume earth is a perfect ball with radius : 6,378,137m and
  //      circumference at the equator = 40,075,016.7 m
  // The full world on google map is available in tiles of 256 px;
  // it has a ratio of 156543.03392 (px/m).
  // For Z = 0;
  // pixel scale at the Lat_level is ( 156543,03392 * cos ( PI * (Lat/180) ))
  // The map scale increases at the rate of square root of Z.
  //
  // Length = Length * 1000 //Length is in Km
  var k = WidthPixel * 156543.03392 * Math.cos((Lat * Math.PI) / 180) //k = circumference of the world at the Lat_level, for Z=0
  var myZoom = Math.round(Math.log((Ratio * k) / (Length * 100)) / Math.LN2)
  myZoom = myZoom - 1 // Z starts from 0 instead of 1
  //console.log("calculateZoom: width "+WidthPixel+" Ratio "+Ratio+" Lat "+Lat+" length "+Length+" (m) calculated zoom "+ myZoom);

  // not used but it could be useful for some: Part of the world size at the Lat
  const MapDim = k / Math.pow(2, myZoom)
  // console.log("calculateZoom: size of the map at the Lat: "+MapDim + " meters.");
  // console.log("calculateZoom: world circumference at the Lat: " +k+ " meters.");
  return myZoom
}

const res = {}

for (let z in s) {
  const r = (156543.03392 * Math.cos((50.4554998 * Math.PI) / 180)) / Math.pow(2, Number(z))
  console.log(Number(z), s[z], r, s[z] / r, calculateZoom(s[z] / r, r, 50.4554998, r))
}
// Px = 156543.03392 * Math.cos(latLng.lat() * Math.PI / 180) / Math.pow(2, zoom)

console.log(calculateZoom(500, 24306, 50.4555, 400))