// Google map

var map;
var changetm = null;
let markers = [];

function initMap() {
    var location = {lat: 50.6401661, lng: 4.6666977};
    map = new google.maps.Map(document.getElementById('map-canvas'), {
        zoom: 8,
        center: location,
        scrollwheel: true
    });

    map.addListener("dragend", () => {
        event_handle()
    });

    map.addListener("zoom_changed", () => {
        event_handle()
    });

}

function event_handle(){
    clearTimeout(changetm);
    changetm = setTimeout("updateMarkers()", 1000);
}


function updateMarkers() {
    bounds = map.getBounds()
    fetch(`https://charger-api.yfrickx.be/api/map/markers`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "NELat": bounds.getNorthEast().lat(),
            "NELng": bounds.getNorthEast().lng(),
            "SWLat": bounds.getSouthWest().lat(),
            "SWLng": bounds.getSouthWest().lng(),
            "Zoomlevel": map.zoom
        })
    }).then(r => {
        r.json().then(data => {
            markers = []
            for (var i = 0; i < data.results.length; i++) {
                result = data.results[i]
                const pos = {lat: result.latitude, lng: result.longitude};
                console.log(pos)
                const marker = new google.maps.Marker({
                    pos,
                    map,
                });

                markers.push(marker);
                console.log("created marker")
            }
            // setMapOnAll(map)
        })
    })
}

// Sets the map on all markers in the array.
function setMapOnAll(map) {
    for (let i = 0; i < markers.length; i++) {
        markers[i].setMap(map);
    }
}