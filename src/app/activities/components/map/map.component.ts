import { Component, OnInit } from '@angular/core';
import L, { LatLng, Map, popup, setOptions } from 'leaflet';
import { MapService } from '../../services/map.service';
import { GeoPoint, Timestamp } from '@angular/fire/firestore';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [],
  templateUrl: './map.component.html',
  styleUrl: './map.component.scss',
})
export class MapComponent implements OnInit {
  private map!: Map;

  constructor(
    private mapService: MapService,
    private datePipe: DatePipe,
  ) {}

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
      center: new LatLng(50.061822, 19.93701),
      zoom: 10,
    };
    this.map = L.map('map', mapOptions);

    const layer = new L.TileLayer(
      'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      {
        attribution:
          '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>' +
          '<a href="https://www.flaticon.com/free-icons/venue" title="venue icons"> | Here icon by IYIKON - Flaticon</a>',
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

    L.marker(e.latlng, {
      icon: L.icon({
        iconUrl: 'assets/media/current-location.png',
        iconSize: [41, 41],
      }),
    })
      .addTo(this.map)
      .bindPopup('You are here')
      .openPopup();
  }

  onLocationError(e: any) {
    alert(e.message);
  }

  onMapClick(e: any) {
    const info =
      '<p>Coordinates: ' + this.formatCoordinatesToDispplay(e.latlng) + '</p>';
    const button =
      '<button class="btn btn-dark" id="activityButton" style="margin: 5px;">Add activity here</button>';
    const bikeButton =
      '<button class="btn btn-outline-dark" id="bikeButton" style="margin: 5px;"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-bicycle" viewBox="0 0 16 16">' +
      '<path d="M4 4.5a.5.5 0 0 1 .5-.5H6a.5.5 0 0 1 0 1v.5h4.14l.386-1.158A.5.5 0 0 1 11 4h1a.5.5 0 0 1 0 1h-.64l-.311.935.807 1.29a3 3 0 1 1-.848.53l-.508-.812-2.076 3.322A.5.5 0 0 1 8 10.5H5.959a3 3 0 1 1-1.815-3.274L5 5.856V5h-.5a.5.5 0 0 1-.5-.5m1.5 2.443-.508.814c.5.444.85 1.054.967 1.743h1.139zM8 9.057 9.598 6.5H6.402zM4.937 9.5a2 2 0 0 0-.487-.877l-.548.877zM3.603 8.092A2 2 0 1 0 4.937 10.5H3a.5.5 0 0 1-.424-.765zm7.947.53a2 2 0 1 0 .848-.53l1.026 1.643a.5.5 0 1 1-.848.53z"/>' +
      '</svg></button>';
    const walkButton =
      '<button class="btn btn-outline-dark" id="walkButton" style="margin: 5px;"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-person-walking" viewBox="0 0 16 16"><path d="M9.5 1.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0M6.44 3.752A.75.75 0 0 1 7 3.5h1.445c.742 0 1.32.643 1.243 1.38l-.43 4.083a1.8 1.8 0 0 1-.088.395l-.318.906.213.242a.8.8 0 0 1 .114.175l2 4.25a.75.75 0 1 1-1.357.638l-1.956-4.154-1.68-1.921A.75.75 0 0 1 6 8.96l.138-2.613-.435.489-.464 2.786a.75.75 0 1 1-1.48-.246l.5-3a.75.75 0 0 1 .18-.375l2-2.25Z"/><path d="M6.25 11.745v-1.418l1.204 1.375.261.524a.8.8 0 0 1-.12.231l-2.5 3.25a.75.75 0 1 1-1.19-.914zm4.22-4.215-.494-.494.205-1.843.006-.067 1.124 1.124h1.44a.75.75 0 0 1 0 1.5H11a.75.75 0 0 1-.531-.22Z"/></svg></button>';
    const gymButton =
      '<button class="btn btn-outline-dark" id="gymButton" style="margin: 5px;">' +
      '<img src="assets/vectors/dumbbells-svgrepo-com.svg">' +
      '</button>';
    const runButton =
      '<button class="btn btn-outline-dark" id="runButton" style="margin: 5px;"><img src="assets/vectors/running-svgrepo-com.svg"></button>';
    const tennisButton =
      '<button class="btn btn-outline-dark" id="tennisButton" style="margin: 5px;"><img src="assets/vectors/tennis-6-svgrepo-com.svg"></button>';

    const popup = L.popup()
      .setLatLng(e.latlng)
      .setContent(
        info +
          // button +
          bikeButton +
          walkButton +
          gymButton +
          runButton +
          tennisButton,
      )
      .openOn(this.map);

    this.addActivity(e.latlng, 'bike');
    this.addActivity(e.latlng, 'walk');
    this.addActivity(e.latlng, 'gym');
    this.addActivity(e.latlng, 'run');
    this.addActivity(e.latlng, 'tennis');
  }
  addActivity(coordinates: LatLng, activity: string) {
    const addActivityButton = document.getElementById(activity + 'Button');
    if (addActivityButton) {
      addActivityButton.addEventListener(
        'click',
        this.saveActivityLocation.bind(this, coordinates, activity),
      );
    }
  }

  saveActivityLocation(coordinates: LatLng, activity: string) {
    this.mapService.saveActivity({
      coordinates: this.convertLatLngToGeoPoint(coordinates),
      date: Timestamp.now(),
      name: activity,
    });
    console.log('Saved location');
  }

  addMarker(coordinates: LatLng, text: string) {
    L.marker(coordinates).addTo(this.map).bindPopup(text);
  }

  addAllMarkers() {
    let data;
    this.mapService.getActivitiesLocations().then((result) => {
      data = result;
      result.forEach((value) => {
        this.addMarker(
          this.convertGeoPointToLatLng(value['coordinates']),
          value['name'] + ' on ' + this.formatDateFromTimestamp(value['date']),
        );
      });
    });
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

  formatCoordinatesToDispplay(latlng: LatLng) {
    let latitude = latlng.lat;
    let longitude = latlng.lng;
    let formattedCoordinates =
      '[' + latitude.toFixed(2) + '° N, ' + longitude.toFixed(2) + '° E]';
    return formattedCoordinates;
  }

  formatDateFromTimestamp(timestamp: Timestamp) {
    const milliseconds = timestamp.toMillis();
    const date = new Date(milliseconds);
    let formattedDate = this.datePipe.transform(date, "MMMM d, y 'at' HH:mm");
    return formattedDate;
  }
}
