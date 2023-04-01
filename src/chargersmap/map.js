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
        let mapElement = document.getElementById('map-canvas');
        let map = new googleMaps.Map(mapElement, {
            center: {lat: 50.881722, lng: 4.684175},
            zoom: 20
        });

        map.addListener("dragend", () => {
            this.event_handle();
        });

        map.addListener("zoom_changed", () => {
            this.event_handle();
        });

        window.addListener("load", () => {
            this.updateMarkers();
        });

        this.map = map;
    }

    updateMarkers() {
        let bounds = this.map.getBounds()

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
                "Zoomlevel": this.map.zoom
            })
        }).then(r => {
            r.json().then(data => {
                this.removeMarkers()
                this.markers = []
                for (var i = 0; i < data.results.length; i++) {
                    let result = data.results[i]

                    const marker = new google.maps.Marker({
                        map: this.map,
                        position: new google.maps.LatLng( result.latitude, result.longitude),
                    });

                    this.markers.push(marker);
                }
            })
        })
    }

    removeMarkers() {
        for (let i = 0; i < this.markers.length; i++) {
            this.markers[i].setMap(null);
        }
    }

    event_handle(){
        clearTimeout(this.changetm);
        this.changetm = setTimeout(() => {
            this.updateMarkers();
        }, 1000);
    }
}

export {
    Map
};