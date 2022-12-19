import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { UtilsService } from 'src/app/services/utils.service';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';

import { myInitObject } from '../../config/config';

@Component({
  selector: 'app-qr',
  templateUrl: './qr.page.html',
  styleUrls: ['./qr.page.scss'],
})
export class QrPage implements OnInit {

  WebQR = { video: null, canvas: null, ctx: null, container: null, stream: null, decoder: null };
  QRSCANNED_DATA: string;
  isOn = false;
  device = { id: '', text: '' };
  devices = [];
  isDataLink = false;
  loaded = false;

  constructor(
    private navController: NavController,
    private utilsService: UtilsService
  ) { }

  ngOnInit() {
    this.WebQR.container = window.document.querySelector('#containerElem') as HTMLElement;
    this.WebQR.video = window.document.querySelector('#videoElem') as HTMLElement;
    this.WebQR.canvas = window.document.querySelector('#canvasElem') as HTMLElement;
    this.WebQR.ctx = this.WebQR.canvas.getContext('2d');
    document.body.addEventListener('keyup', event => {
      if (event.keyCode === 27) {
        this.closeScanner(false);
      }
    });
  }

  ionViewWillEnter() {
    this.loaded = false;
    this.QRSCANNED_DATA = '';
    this.isOn = false;
    this.devices = [];
    this.device = { id: '', text: '' };
    this.isDataLink = false;
    if (!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia && 'enumerateDevices' in navigator.mediaDevices)) {
      this.utilsService.presentToastLanguage('QR_TS.NOT_SUPPORTED_DEVICES');
    } else {
      let objSelfRef = this;
      navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
        objSelfRef.WebQR.stream = stream;
        return navigator.mediaDevices.enumerateDevices();
      }).then((devices) => {
        const dev = [];
        devices.forEach(function (device) {
          if (device.kind === 'videoinput') {
            dev.push({ id: device.deviceId, text: device.label.replace(/\([0-9a-f:]+\)/, '') });
          }
        });
        if (dev.length === 0) {
          objSelfRef.utilsService.presentToastLanguage('QR_TS.NO_DEVICES');
        } else {
          objSelfRef.device = (dev.length > 1) ? dev[1] : dev[0];
          objSelfRef.devices = dev;
          console.debug(objSelfRef.devices);
          objSelfRef.WebQR.decoder = new Worker('../../../assets/utils/decoder.js');
          objSelfRef.WebQR.decoder.onmessage = ((event) => {
            if (event.data.length > 0) {
              const data = event.data[0][2];
              const reg = new RegExp('^' + myInitObject.baseUrl + '/app/home/.+$');
              if (reg.test(data)) {
                objSelfRef.isDataLink = true;
              }
              objSelfRef.QRSCANNED_DATA = data;
              objSelfRef.closeScanner(false);
            } else {
              setTimeout(() => { objSelfRef.scanImg() }, 0);
            }
          });
          objSelfRef.loaded = true;
        }
      }).catch((e) => {
        this.utilsService.presentToastLanguage('QR_TS.CATCHED_DEVICES_ERROR');
        throw new Error(e);
      });
    }
  }

  ionViewWillLeave() {
    this.closeScanner(true);
    return this.utilsService.dismiss();
  }

  openUrl() {
    const reg = new RegExp('^' + myInitObject.baseUrl + '/app/home/.+$');
    if (reg.test(this.QRSCANNED_DATA)) {
      this.navController.navigateRoot(this.QRSCANNED_DATA);
    }
  }

  scanImg() {
    try {
      this.WebQR.ctx.drawImage(this.WebQR.video, 0, 0, 240, 200);
      let img = this.WebQR.ctx.getImageData(0, 0, 240, 200);
      if (img.data) {
        this.WebQR.decoder.postMessage(img);
      }
    } catch (error) {
      console.error(error);
    }
  }

  goToQrScan() {
    if (this.isOn) {
      return;
    }
    if (this.WebQR.decoder === null) {
      this.utilsService.presentToastLanguage('QR_TS.LOAD_QR_DECODER_ERROR');
      return;
    }
    this.closeScanner(false);
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      this.WebQR.container.style.display = 'block';
      this.isOn = true;
      this.isDataLink = false;
      this.QRSCANNED_DATA = '';
      if (this.device.text === '') {
        this.device = (this.devices.length > 1) ? this.devices[1] : this.devices[0];
      }
      let objSelfRef = this;
      this.utilsService.presentLoadingWithOptions().then(() => {
        console.debug(objSelfRef.device);
        navigator.mediaDevices.getUserMedia({ video: { deviceId: { exact: objSelfRef.device.id } }, audio: false })
          .then(function (stream) {
            console.debug('stream: ' + stream);
            const videoTracks = stream.getVideoTracks();
            console.debug('Using video device: ' + videoTracks[0].label);
            objSelfRef.isOn = true;
            if (objSelfRef.WebQR.video.mozSrcObject !== undefined) {
              objSelfRef.WebQR.video.mozSrcObject = stream;
            } else if (objSelfRef.WebQR.video.srcObject !== undefined) {
              objSelfRef.WebQR.video.srcObject = stream;
            } else {
              objSelfRef.WebQR.video.src = stream;
            }
            objSelfRef.WebQR.video.play().then(() => {
              ;
              objSelfRef.WebQR.stream = stream;
              objSelfRef.dismiss().then(() => {
                objSelfRef.scanImg();
              });
            }).catch(e => {
              console.error(e);
              objSelfRef.dismiss();
              objSelfRef.closeScanner(false);
            });
          }).catch(e => {
            console.error(e);
            objSelfRef.dismiss();
            objSelfRef.closeScanner(false);
          });
      });
    } else {
      this.utilsService.presentToastLanguage('QR_TS.NO_DEVICES');
    }
  }

  closeScanner(killWorker) {
    this.isOn = false;
    if (this.WebQR.stream !== null) {
      this.WebQR.stream.getTracks().forEach(track => {
        console.debug(track);
        if (track.readyState === 'live') {
          track.stop();
        }
        this.WebQR.stream.removeTrack(track);
      });
      this.WebQR.stream = null;
    }
    this.WebQR.container.style.display = 'none';
    if (this.WebQR.ctx !== null) {
      this.WebQR.ctx.clearRect(0, 0, 240, 200);
    }
    if (killWorker && this.WebQR.decoder !== null) {
      this.WebQR.decoder.terminate();
      this.WebQR.decoder = null;
    }
  }

  changeDeviceId($event) {
    this.device = $event.target.value;
  }

  compareById = (o1, o2) => {
    return o1.id === o2.id;
  };

  dismiss() {
    this.loaded = true;
    return this.utilsService.dismiss();
  }
}
