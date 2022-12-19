
import { NgModule, NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { DragDropModule } from '@angular/cdk/drag-drop';
import { ScrollingModule } from '@angular/cdk/scrolling';

import { FormGroup, FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';


import { HTTP_INTERCEPTORS, HttpClientModule, HttpClient } from '@angular/common/http';
import { TokenInterceptor } from './interceptors/token.interceptor';

import { Pipes } from './pipes/pipes.module';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { Keyboard } from '@ionic-native/keyboard/ngx';
import { Network } from '@ionic-native/network/ngx';

import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';

import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
//import { Globalization } from '@ionic-native/globalization/ngx';
import { LanguagesModalComponent } from './components/languages-modal/languages-modal.component';
import { TranslateConfigService } from './services/translate-config.service';
import { LottieModule } from 'ngx-lottie';

import { NgCalendarModule } from 'ionic2-calendar';
import { Camera } from '@ionic-native/camera/ngx';

import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';


import { MatButtonModule } from '@angular/material/button';
import { MatRippleModule } from '@angular/material/core';


import { MatToolbarModule } from '@angular/material/toolbar';
import { MatDialogModule } from '@angular/material/dialog';

import { MatNativeDateModule } from '@angular/material/core';





import { MatSnackBarModule } from '@angular/material/snack-bar';
//import { SocialSharing } from '@ionic-native/social-sharing';
//import { SocialSharing } from '@ionic-native/social-sharing/ngx';



//import { IonicStorageModule } from '@ionic/storage';





export function HttpLoaderFactory(http: HttpClient) {
    return new TranslateHttpLoader(http, "./assets/i18n/", ".json");
}

export function LanguageLoader(http: HttpClient) {
    return new TranslateHttpLoader(http, 'assets/i18n/', '.json');
}

// Note we need a separate function as it's required
// by the AOT compiler.
export function playerFactory() {
    return import(/* webpackChunkName: 'lottie-web' */ 'lottie-web');
}

const firebaseConfig = {
    apiKey: "AIzaSyCL92eI5ZWvrTZoCppzuN7LVLCj4JJZuuQ",
    authDomain: "aucultura-f95e6.firebaseapp.com",
    databaseURL: "https://aucultura-f95e6.firebaseio.com",
    projectId: "aucultura-f95e6",
    storageBucket: "aucultura-f95e6.appspot.com",
    messagingSenderId: "462687635748",
    appId: "1:462687635748:web:1533647d0a2edbc681cbb1",
    measurementId: "G-4GHRCB2QSD"
    /*
    apiKey: "AIzaSyDJT7CWLQnH89d7pUTSCyDjx3iyLZU0E8Y",
    authDomain: "aucultur-mobile-app.firebaseapp.com",
    projectId: "aucultur-mobile-app",
    storageBucket: "aucultur-mobile-app.appspot.com",
    messagingSenderId: "715326479970",
    appId: "1:715326479970:web:5c8906929c231fe581bb3b",
    measurementId: "G-YE0NDFDFYZ"*/

}
@NgModule({
    entryComponents: [
        LanguagesModalComponent
    ],
    imports: [
        BrowserModule,
        TranslateModule,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: (LanguageLoader),
                deps: [HttpClient]
            }
        }),
        NgCalendarModule,
        IonicModule.forRoot(),
        HttpClientModule,
        FormsModule,
        ReactiveFormsModule,
        AppRoutingModule,
        //AngularFireModule.initializeApp(firebaseConfig),
        BrowserAnimationsModule,
        DragDropModule,
        ScrollingModule,
        Pipes,
        AngularFireModule.initializeApp(firebaseConfig),
        MatDatepickerModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatRippleModule,
        MatToolbarModule,
        MatDialogModule,
        AngularFireAuthModule,
        MatNativeDateModule,
        MatSnackBarModule,
        LottieModule.forRoot({ player: playerFactory }),
        ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
    ],
    providers: [

        GooglePlus,
        StatusBar,
        SplashScreen,
        InAppBrowser,
        Keyboard,
        TranslateConfigService,
        Network,
        Camera,
        //Globalization,
        { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
        {
            provide: HTTP_INTERCEPTORS,
            useClass: TokenInterceptor,
            multi: true
        },
        MatDatepickerModule,
        MatNativeDateModule,
    ],
    bootstrap: [AppComponent],
    declarations: [AppComponent, LanguagesModalComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule { }
