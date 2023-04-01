// Google map
import './index.html'
import '../style.css';
import {Map} from './map.js';


const map = new Map();

document.addEventListener("DOMContentLoaded", function() {
    map.initMap()
});

