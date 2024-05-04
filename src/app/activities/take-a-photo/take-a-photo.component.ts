import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { PhotoService } from '../services/photo.service';

@Component({
  selector: 'app-take-a-photo',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './take-a-photo.component.html',
  styleUrl: './take-a-photo.component.scss',
})
export class TakeAPhotoComponent {
  //implements AfterViewInit{

  @ViewChild('video') public video: ElementRef = new ElementRef('video');
  @ViewChild('canvas') public canvas: ElementRef = new ElementRef('canvas');

  Width: number = 480;
  Height: number = 480;

  windowWidth: number = window.screen.width;
  windowHeight: number = window.screen.height;

  hasError: boolean = false;
  initCamera: boolean = false;
  camera: boolean = false;
  isCaptured: boolean = false;
  photos: string[]= [];
  onlinePhotos:string[]=[];
  constructor(public photoService: PhotoService) {}
  onInit() {}
  takeAPhoto() {}

  // async ngAfterViewInit() {
  //   await this.setupDevice();
  // }

  async setupDevice() {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });

        if (stream) {
          this.video.nativeElement.srcObject = stream;
          this.video.nativeElement.play();
          this.hasError = false;
          this.initCamera = true;
        } else {
          this.hasError = true;
        }
      } catch (error) {
        this.hasError = true;
        console.log(error);
      }
    }
  }
  async showCamera() {
    this.camera = true;
    if (!this.initCamera) {
      await this.setupDevice();
    }
    this.video.nativeElement.play();
  }
  hideCamera() {
    this.camera = false;
    this.isCaptured = false;
    //this.video.nativeElement.pause();
  }

  takePhoto() {
    this.drawImageToCanvas(this.video.nativeElement);
    this.photos.push(this.canvas.nativeElement.toDataURL('image/png'));
    console.log(this.canvas.nativeElement.toDataURL('image/png'));
    this.isCaptured = true;
  }
  async retakePhoto() {
    this.isCaptured = false;
    if (!this.initCamera) {
      await this.setupDevice();
    }
  }
  sendPhoto() {
    if (this.photos.length <= 0) {
      console.log('no photos to send');
    } else {
      this.photoService.sendPhoto(this.photos[this.photos.length - 1]);
    }
  }

  setPhoto(idx: number) {
    this.isCaptured = true;
    const image = new Image();
    image.src = this.photos[idx];
    this.drawImageToCanvas(image);
  }
  drawImageToCanvas(image: unknown) {
    this.canvas.nativeElement
      .getContext('2d')
      .drawImage(image, 0, 0, this.Width, this.Height);
  }
  async getAllPhotos(){
    //this.photoService.getAllPhotos().then((photos)=>this.photos = photos);
    const pht = await this.photoService.getAllPhotos();
    if (Array.isArray(pht)) {
      this.onlinePhotos = pht;
    }
    console.log("recived: ", this.onlinePhotos);
  }

}
