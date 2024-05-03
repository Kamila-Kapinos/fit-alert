import { Component, Input } from '@angular/core';
import L, { circle, latLng, marker, polygon, tileLayer } from 'leaflet';
import * as Leaflet from 'leaflet';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [],
  templateUrl: './map.component.html',
  styleUrl: './map.component.scss',
})
export class MapComponent {
  constructor() {}

  ngOnInit(): void {
    const customIcon = L.icon({
      iconUrl: 'assets/media/marker-icon-2x.png',
      shadowUrl: 'assets/media/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      tooltipAnchor: [16, -28],
      shadowSize: [41, 41],
    });

    L.Marker.prototype.setIcon(customIcon);

    const mapOptions = {
      center: [17.385044, 78.486671] as L.LatLngTuple,
      zoom: 10,
    };
    const map = L.map('map', mapOptions);

    const layer = new L.TileLayer(
      'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      {
        attribution:
          '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      },
    );
    map.addLayer(layer);

    map.locate({ setView: true, maxZoom: 16 });

    function onLocationFound(e: any) {
      const radius = e.accuracy;

      L.marker(e.latlng)
        .addTo(map)
        .bindPopup('You are within ' + radius + ' meters from this point')
        .openPopup();

      // L.circle(e.latlng, radius).addTo(map);
    }

    map.on('locationfound', onLocationFound);

    function onLocationError(e: any) {
      alert(e.message);
    }

    map.on('locationerror', onLocationError);

    let popup = L.popup();

    function onMapClick(e: any) {
      popup
        .setLatLng(e.latlng)
        .setContent('Add activity at ' + e.latlng.toString())
        .openOn(map);

      saveActivityLocation();
    }

    map.on('click', onMapClick);
  }
}
function saveActivityLocation() {
  console.log('Saved location');
}
