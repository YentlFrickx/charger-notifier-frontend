// Google map

var map;
var changetm = null;
let markers = [];

function initMap() {
    var location = {lat: 50.881722, lng: 4.684175};
    map = new google.maps.Map(document.getElementById('map-canvas'), {
        zoom: 20,
        center: location,
        scrollwheel: true
    });

    google.maps.event.addDomListener(window, 'load', updateMarkers);


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
            removeMarkers()
            markers = []
            for (var i = 0; i < data.results.length; i++) {
                result = data.results[i]

                const marker = new google.maps.Marker({
                    map: map,
                    position: new google.maps.LatLng( result.latitude, result.longitude),
                });

                markers.push(marker);
            }
        })
    })
}

function removeMarkers() {
    for (let i = 0; i < markers.length; i++) {
        markers[i].setMap(null);
    }
}
