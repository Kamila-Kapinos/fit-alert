import { Component, OnInit } from '@angular/core';
import L, { LatLng, Map } from 'leaflet';
import { MapService } from '../../services/map.service';
import { GeoPoint, Timestamp } from '@angular/fire/firestore';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [],
  templateUrl: './map.component.html',
  styleUrl: './map.component.scss',
})
export class MapComponent implements OnInit {
  private map!: Map;

  constructor(private mapService: MapService) { }

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
    this.map = L.map('map', mapOptions);

    const layer = new L.TileLayer(
      'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      {
        attribution:
          '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      },
    );
    this.map.addLayer(layer);

    this.map.locate({ setView: true, maxZoom: 16 });

    this.map.on('locationfound', this.onLocationFound.bind(this));
    this.map.on('locationerror', this.onLocationError.bind(this));
    this.map.on('click', this.onMapClick.bind(this));

    this.addAllMarkers();
  }

  onLocationFound(e: any) {
    const radius = e.accuracy;

    L.marker(e.latlng)
      .addTo(this.map)
      .bindPopup('You are within ' + radius + ' meters from this point')
      .openPopup();
  }

  onLocationError(e: any) {
    alert(e.message);
  }

  onMapClick(e: any) {
    const info = '<p>Coordinates: ' + e.latlng.toString() + '</p>';
    const button = '<button class="btn btn-dark" id="addActivityBtn">Add activity here</button>';
    const popup = L.popup()
      .setLatLng(e.latlng)
      .setContent(info + button)
      .openOn(this.map);

    const addButton = document.getElementById('addActivityBtn');
    if (addButton) {
      addButton.addEventListener('click', this.saveActivityLocation.bind(this, e.latlng, "activity"));
    }

    // // Tworzenie dropdowna z opcjami aktywności fizycznych
    // const activityDropdown = document.createElement('select');
    // activityDropdown.classList.add('form-control');

    // // Tablica z opcjami aktywności
    // const activities = ['Bieganie', 'Jazda na rowerze', 'Pływanie', 'Joga', 'Wspinaczka'];

    // // Tworzenie opcji dla każdej aktywności
    // activities.forEach(activity => {
    //   const option = document.createElement('option');
    //   option.text = activity;
    //   option.value = activity;
    //   activityDropdown.appendChild(option);
    // });

    // // Dodanie event listenera do dropdowna
    // activityDropdown.addEventListener('change', (event) => {
    //   if (event.target) {
    //     const target = event.target as HTMLSelectElement;
    //     const selectedActivity = target.value;
    //     this.saveActivityLocation.bind(this, e.latlng, selectedActivity);
    //   }
    // });

    // const popupContent = document.createElement('div');
    // popupContent.innerHTML = '<p>Coordinates: ' + e.latlng.toString() + '</p>';
    // popupContent.appendChild(activityDropdown);

    // // Dodanie dropdowna do popupu
    // const popup = new L.Popup()
    //   .setLatLng(e.latlng)
    //   .setContent(popupContent)
    //   .openOn(this.map);

  }

  saveActivityLocation(coordinates: LatLng, activity: string) {
    // console.log(coordinates);
    this.mapService.saveActivity({
      'coordinates': this.convertLatLngToGeoPoint(coordinates),
      'date': Timestamp.now(),
      'name': activity
    })
    console.log('Saved location');
  }

  addMarker(coordinates: LatLng, text: string) {
    L.marker(coordinates)
      .addTo(this.map)
      .bindPopup(text);
  }

  addAllMarkers() {
    let data;
    this.mapService.getActivitiesLocations().then(result => {data = result; result.forEach(
      value => {
        this.addMarker(this.convertGeoPointToLatLng(value['coordinates']), value['name']+" on "+value['date'])
      })})

  }

  convertGeoPointToLatLng(geoPoint: GeoPoint): LatLng {
    const lat = geoPoint.latitude;
    const lng = geoPoint.longitude;
    return new L.LatLng(lat, lng);
  }

  convertLatLngToGeoPoint(latlng: LatLng): GeoPoint {
    const latitude = latlng.lat;
    const longitude = latlng.lng;
    return new GeoPoint(latitude, longitude);
  }
}
