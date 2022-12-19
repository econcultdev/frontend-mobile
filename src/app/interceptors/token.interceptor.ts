import {
    HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpResponse, HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { ToastController } from '@ionic/angular';
import { Injectable } from '@angular/core';
import { UtilsService } from '../services/utils.service';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

    constructor(
        public toastController: ToastController,
        private utilsService: UtilsService
    ) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const token = sessionStorage.getItem('token');
        if (token) {
            request = request.clone({
                setHeaders: {
                    Authorization: token
                }
            });
        }

        if (!request.headers.has('Content-Type')) {
            request = request.clone({
                setHeaders: {
                    'content-type': 'application/json'
                }
            });
        }

        request = request.clone({
            headers: request.headers.set('Accept', 'application/json')
        });

        return next.handle(request).pipe(
            map((event: HttpEvent<any>) => {
                if (event instanceof HttpResponse) {
                    console.log('event--->>>', event);
                }
                return event;
            }),
            catchError((error: HttpErrorResponse) => {
                if (error.status === 401) {
                    if (error.error.success === false) {
                        this.utilsService.presentToastLanguage('TOKEN_INTERCEPTOR_TS.AUTH_FAILED');
                    }
                }
                return throwError(error);
            }));
    }

    async presentToast(msg: string) {
        const toast = await this.toastController.create({
            message: msg,
            duration: 2000,
            position: 'top',
            buttons: [
                {
                  text: 'Cerrar',
                  role: 'cancel',
                  handler: () => {
                    console.log('Cancel clicked');
                  }
                }
              ]
        });

        toast.onDidDismiss().then(() => {
            console.log('Dismissed toast');
        });

        toast.present();
    }

}
