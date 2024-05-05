import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { PhotoService } from '../services/photo.service';

@Component({
  selector: 'app-take-a-photo',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './take-a-photo.component.html',
  styleUrl: './take-a-photo.component.scss',
})
export class TakeAPhotoComponent implements OnInit {

  @ViewChild('video') public video: ElementRef = new ElementRef('video');
  @ViewChild('canvas') public canvas: ElementRef = new ElementRef('canvas');

  windowWidth: number = window.screen.width;
  windowHeight: number = window.screen.height;
  Width: number = this.windowWidth;//480;
  Height: number = this.windowHeight;//360;
  canvasWidth: number = 700;//this.windowWidth/2;//480;
  canvasHeight: number = 700;//this.windowHeight/2;//360;


  hasError: boolean = false;
  initCamera: boolean = false;
  camera: boolean = false;
  isCaptured: boolean = false;
  photos: string[] = [];
  onlinePhotos: string[] = [];

  constructor(public photoService: PhotoService) {
    // if (this.windowWidth / this.windowHeight >= 1) {
    //   //desktop 
    //   this.Height = 360;
    //   this.Width = 480;
    // }
    // else {
    //   //mobile
    //   this.Height = Math.min(this.windowHeight,360);
    //   this.Width = Math.min(this.windowWidth,270);
    // }

    
  }
  ngOnInit(): void {
    const vid:HTMLVideoElement = document.getElementsByTagName("video")[0]
    vid.addEventListener('loadeddata',(()=>{
      this.canvasHeight = document.getElementsByTagName("video")[0].videoHeight
      this.canvasWidth = document.getElementsByTagName("video")[0].videoWidth
    }))
  }
  
    

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
    console.log(document.getElementsByTagName("video")[0].getBoundingClientRect())
    //this.canvasHeight = document.getElementsByTagName("video")[0].getBoundingClientRect().height+2
    //this.canvasWidth = document.getElementsByTagName("video")[0].getBoundingClientRect().width+2
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

  drawImageToCanvas(image: unknown|HTMLVideoElement) {
    const img = new Image();
    img.src = image as string;
    // if (image === HTMLVideoElement){

    //   this.canvasHeight = image.videoHeight
    //   this.canvasWidth = image.videoWidth
    // }
    console.log("image: ", this.canvasHeight,this.canvasWidth,img)
    this.canvas.nativeElement
      .getContext('2d')
      .drawImage(image, 0, 0, this.canvasWidth, this.canvasHeight);
  }

  async getAllPhotos() {
    const pht = await this.photoService.getAllPhotos();
    if (Array.isArray(pht)) {
      this.onlinePhotos = pht;
    }
    console.log("recived: ", this.onlinePhotos);
  }

}
