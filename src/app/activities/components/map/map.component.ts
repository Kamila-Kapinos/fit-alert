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
  // map!: Leaflet.Map;
  // markers: Leaflet.Marker[] = [];
  // options = {
  //   layers: [
  //     Leaflet.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  //       attribution:
  //         '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  //     }),
  //   ],
  //   zoom: 16,
  //   center: { lat: 28.626137, lng: 79.821603 },
  // };

  constructor() {}

  ngOnInit(): void {
    const mapOptions = {
      center: [17.385044, 78.486671] as L.LatLngTuple,
      zoom: 10,
    };
    const map = L.map('map', mapOptions);

    const layer = new L.TileLayer(
      'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    );
    map.addLayer(layer);

    map.locate({ setView: true, maxZoom: 16 });

    function onLocationFound(e: any) {
      const radius = e.accuracy;

      L.marker(e.latlng)
        .addTo(map)
        .bindPopup('You are within ' + radius + ' meters from this point')
        .openPopup();

      L.circle(e.latlng, radius).addTo(map);
    }

    map.on('locationfound', onLocationFound);

    function onLocationError(e: any) {
      alert(e.message);
    }

    map.on('locationerror', onLocationError);
  }
}
