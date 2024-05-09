
mapboxgl.accessToken = mapToken; // this "mapToken" we have saved inside script tag in show.ejs page at the top
const map = new mapboxgl.Map({
    container: 'map', // container ID

    center: listingMapShowPge.geometry.coordinates, // "geometry" is the field we have added inside listingschema,"coordinates" is the subfield of "geometry", "listingMapShowPge" is the variable we have defined inside "script tag" of "show.ejs" page, beacause we cant access "coordinates" directly in "show page" , therfore to show "coordinates" in show.ejs page , we have saved this "listingMapShowPge"  variable.

    zoom: 5 // starting zoom
});



const marker = new mapboxgl.Marker({color:"red"})

.setLngLat(listingMapShowPge.geometry.coordinates) // here we are saving "coordinates" inside "coordinates field" of "geometry" field of "listingschema". And inorder to show our coordinates in show.ejs page, we use "listingMapShowPge" variable.

.setPopup(new mapboxgl.Popup({offset: 25 }).setHTML(
    `<h4>${listingMapShowPge.title}</h4><p>Exact Location will be provided after booking</p>`
))
.addTo(map);