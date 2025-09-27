const API_KEY = MAPTILER_API_KEY;

var map = new maplibregl.Map({
  container: 'map', // container id
  style: `https://api.maptiler.com/maps/streets-v2/style.json?key=${API_KEY}`, // style URL
  center: listing.geometry.coordinates, // starting position [lng, lat]
  zoom: 10 // starting zoom
});

const el = document.createElement('div');
el.className = 'marker';
el.style.backgroundImage = `url(https://img.icons8.com/?size=30&id=86527&format=png&color=FF0000)`;
el.style.width = `${30}px`;
el.style.height = `${30}px`;

let marker = new maplibregl.Marker({color : "#FF0000", element: el})
  .setLngLat(listing.geometry.coordinates)
  .setPopup(new maplibregl.Popup({
    closeOnMove : true,
    className : "marker-popup",
    subpixelPositioning : true
  }).setHTML(`<h4>${listing.title}</h4><p>Exact location will be provided after booking</p>`)) // add popup
  .addTo(map);

