import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { fromEvent } from 'rxjs';
import { Network } from '@ionic-native/network/ngx';
import { TranslateService } from '@ngx-translate/core';
import { TranslateConfigService } from './services/translate-config.service';
import { SwUpdate } from '@angular/service-worker';


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {

  appIsOnline: boolean;
  appIsOnDevice: boolean;

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private network: Network,
    private swUpdate: SwUpdate,
    private translate: TranslateService,
    private translateConfigService: TranslateConfigService
  ) {
    this.initializeApp();
    this.translate.use(this.translateConfigService.getLanguageBrowser());
    this.translateConfigService.setLanguage(this.translateConfigService.getLanguageBrowser());

    // #TO-DO: Disable show slides
    sessionStorage.setItem('showSlides', 'false');
  }

  initializeApp() {
    /*
    if (this.swUpdate.available) {
      this.swUpdate.available.subscribe(() => {
        window.location.reload();
      });
    }
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.initNetworkMonitor();
      this.checkModoDarkTheme();
    });*/
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.initNetworkMonitor();
      this.checkModoDarkTheme();
    });
  }

  initNetworkMonitor() {
    console.log("init network monitoring...")
    if ('onLine' in navigator) {
      this.appIsOnline = navigator.onLine;
    }
    // check if we are on device or if its a browser:
    if (this.appIsOnDevice) {
      // watch network for a disconnect
      this.network.onDisconnect().subscribe(() => {
        console.log("network disconnected:(");
        this.appIsOnline = false;
      });
      // watch network for a connection
      this.network.onConnect().subscribe(() => {
        console.log("network connected!");
        this.appIsOnline = true;
        if (this.network.type === "wifi") {
          console.log("we got a wifi connection, woohoo!");
        }
        /*
        this.sync();
        if (this.sockets) {
          this.sockets.open()
        }
        */
      });
      console.log("device network monitor is ON")
    } else {
      fromEvent(window, "offline").subscribe(() => {
        this.appIsOnline = false;
        console.log("network disconnected:(");
        // this.fbdb.afd.database.goOffline();
      }
      );
      fromEvent(window, "online").subscribe(() => {
        this.appIsOnline = true;
        console.log("network connected!");
        // this.fbdb.afd.database.goOnline();
        /*
        this.sync();
        if (this.sockets) {
          this.sockets.open()
        }
        */
      }
      );
      console.log("PWA network monitor is ON")
    }
    if (!this.appIsOnline) {
      // this.fbdb.afd.database.goOffline();
    }
  };

checkModoDarkTheme(){
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
  //console.log(prefersDark);
  if (prefersDark.matches){
    document.body.classList.toggle('dark');
  }
}

}
