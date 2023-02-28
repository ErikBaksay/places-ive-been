import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.sass']
})
export class MapComponent implements OnInit {

  constructor() { }

  map?: L.Map;
  latitude: number = 0;
  longitude: number = 0;
  userLocationMarker?: L.Marker;
  userLocationAccuracy: number = 0;
  userLocationAccuracyCircle?: L.Circle;

  ngOnInit(): void {
    this.startWatchingLocation();
    this.displayMap(this.latitude, this.longitude);
  }

  displayMap(longitude: number, latitude: number){

    this.map = L.map('map').setView([latitude, longitude], 13);
    console.log('set map coords to', this.latitude, this.longitude);
    
    

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(this.map);
  }

  startWatchingLocation(){
    if (navigator.geolocation) {
      navigator.geolocation.watchPosition(
        (position) => {
          this.latitude = position.coords.latitude;
          this.longitude = position.coords.longitude;
          this.userLocationAccuracy = position.coords.accuracy;
          this.updateUserLocationDisplay()
          console.log('Current position', this.latitude, this.longitude);
        },
        (error) => {
          console.log('Error getting position:', error);
        }
      );
    } else {
      console.log('Geolocation is not supported by this browser.');
    }
  }

  updateUserLocationDisplay(){
    this.updateUserLocationOnMap();
    this.updateUserLocationMarker();
    this.updateUserLocationAccuracy();
  }

  updateUserLocationOnMap(){
    this.map!.panTo(new L.LatLng(this.latitude, this.longitude));
  }

  updateUserLocationMarker(){
    if(!this.map){
      return;
    }
    if(this.userLocationMarker){
      this.map?.removeLayer(this.userLocationMarker);
    }
    this.userLocationMarker = L.marker([this.latitude, this.longitude]).addTo(this.map);
  }

  updateUserLocationAccuracy(){
    if(!this.map){
      return;
    }
    if(this.userLocationAccuracyCircle){
      this.map?.removeLayer(this.userLocationAccuracyCircle);
    }
    this.userLocationAccuracyCircle = L.circle([this.latitude, this.longitude],{radius: this.userLocationAccuracy}).addTo(this.map);
    this.map.fitBounds(this.userLocationAccuracyCircle.getBounds())
  }

}
