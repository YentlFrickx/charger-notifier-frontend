const loadGoogleMapsApi = require('load-google-maps-api');
import { MarkerClusterer } from "@googlemaps/markerclusterer";
import '../cookie.js'


class Map {
    map;
    markers = [];
    changetm = null;
    openInfoWindow = null;
    markerCluster = null;

    initMap() {
        this.loadGoogleMapsApi().then((googleMaps) => this.createMap(googleMaps));
    }

    loadGoogleMapsApi() {
        return loadGoogleMapsApi({ key: 'AIzaSyCVK4_jn6NzimI5WfEu1NPWOi_15eoZatw' });
    }

    createMap(googleMaps) {
        const myStyles =[
            {
                featureType: "poi",
                elementType: "labels",
                stylers: [
                    { visibility: "off" }
                ]
            }
        ];
        const mapElement = document.getElementById('map-canvas');
        const map = new googleMaps.Map(mapElement, {
            center: { lat: 50.881722, lng: 4.684175 },
            zoom: 15,
            styles: myStyles,
        });

        this.markerCluster = new MarkerClusterer({
            map: map,
            markers: this.markers }
        );

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

        fetch('https://charger-api.yfrickx.be/api/map/locations', {
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

                for (let i = 0; i < data.length; i++) {
                    const result = data[i];
                    this.markerCluster.addMarker(this.createMarker(result))
                    // this.markers.push(this.createMarker(result));
                }
            });
        });
    }

    createMarker(result) {
        const marker = new google.maps.Marker({
            map: this.map,
            position: new google.maps.LatLng(result.Latitude, result.Longitude),
        });

        const infoContent = `
        <div class="bg-white rounded-md shadow-md p-2">
            <h2 class="font-bold mb-2">${result.Address}</h2>
            <button onclick="window.myFunction()">Click me</button>'
        </div>
        `;

        let infoWindow = new google.maps.InfoWindow({
            content: infoContent
        });

        marker.addListener('click', () => {
            if (this.openInfoWindow) {
                this.openInfoWindow.close();
            }
            infoWindow.open(this.map, marker);
            this.openInfoWindow = infoWindow;
        });
        return marker;
    }

    removeMarkers() {
        if(this.markerCluster) {
            this.markerCluster.clearMarkers();
        }
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

    myFunction() {
        console.log('Clicked!')
    }
}

function myFunction() {
    console.log('Clicked!')
}

window.myFunction = myFunction;

export { Map };
