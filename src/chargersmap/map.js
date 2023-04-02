const loadGoogleMapsApi = require('load-google-maps-api');

class Map {
    map;
    markers = [];
    changetm = null;

    initMap() {
        this.loadGoogleMapsApi().then((googleMaps) => this.createMap(googleMaps));
    }

    loadGoogleMapsApi() {
        return loadGoogleMapsApi({ key: 'AIzaSyCVK4_jn6NzimI5WfEu1NPWOi_15eoZatw' });
    }

    createMap(googleMaps) {
        const mapElement = document.getElementById('map-canvas');
        const map = new googleMaps.Map(mapElement, {
            center: { lat: 50.881722, lng: 4.684175 },
            zoom: 20,
        });

        map.addListener('dragend', () => {
            this.eventHandle();
        });

        map.addListener('zoom_changed', () => {
            this.eventHandle();
        });

        google.maps.event.addListenerOnce(map, 'tilesloaded', () => {
            this.updateMarkers();
        });

        this.map = map;
    }

    updateMarkers() {
        const bounds = this.map.getBounds();

        fetch('https://charger-api.yfrickx.be/api/map/markers', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                NELat: bounds.getNorthEast().lat(),
                NELng: bounds.getNorthEast().lng(),
                SWLat: bounds.getSouthWest().lat(),
                SWLng: bounds.getSouthWest().lng(),
                Zoomlevel: this.map.zoom,
            }),
        }).then((r) => {
            r.json().then((data) => {
                this.removeMarkers();
                this.markers = [];

                for (let i = 0; i < data.results.length; i++) {
                    const result = data.results[i];
                    this.markers.push(this.createMarker(result));
                }
            });
        });
    }

    createMarker(result) {
        const marker = new google.maps.Marker({
            map: this.map,
            position: new google.maps.LatLng(result.latitude, result.longitude),
        });

        let infoWindow = new google.maps.InfoWindow({
            content: '<div class="bg-white rounded-md shadow-md p-2"><h2 class="font-bold mb-2">Marker ' + 1 + '</h2><p class="text-gray-600"><strong>Latitude:</strong> ' + result.latitude + '</p><p class="text-gray-600"><strong>Longitude:</strong> ' + result.longitude + '</p></div>'
        });
        marker.addListener('click', () => {
            infoWindow.open(this.map, marker);
        });
        return marker;
    }

    removeMarkers() {
        for (let i = 0; i < this.markers.length; i++) {
            this.markers[i].setMap(null);
        }
    }

    eventHandle() {
        clearTimeout(this.changetm);
        this.changetm = setTimeout(() => {
            this.updateMarkers();
        }, 1000);
    }
}

export { Map };
