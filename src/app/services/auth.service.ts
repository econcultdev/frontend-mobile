import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { HttpService } from './http.service';
import { myInitObject } from '../config/config';
import { Router } from '@angular/router';
import { StorageService } from './storage.service';
import { AuthConstants } from '../config/auth-constants';



@Injectable({
    providedIn: 'root'
})
export class AuthService {

    apiUrl = myInitObject.apiUrl;
    userData$ = new BehaviorSubject<any>([]);

    //constructor(private http: HttpClient) { }
    getUserData() {
        this.storageService.get(AuthConstants.AUTH).then(res => {
            this.userData$.next(res);
        });
    }

    constructor(
        private http: HttpClient,
        private httpService: HttpService,
        private storageService: StorageService,
        private router: Router) { }
    loginBCK(email: string, password: string) {
        this.http.post(this.apiUrl + '/signup', { email: email, password: password })
            .subscribe((resp: any) => {

                this.router.navigate(['/homeapp']);
                localStorage.setItem('token', resp.token);

            });


    }

    whoAmI() {
        return sessionStorage.getItem('token');
    }

    checkToken(data: any): Observable<any> {
        return this.http.post<any>(this.apiUrl + 'checkToken', data)
            .pipe(
                tap(_ => this.log('login')),
                catchError(this.handleError('login', []))
            );
    }
    headers: HttpHeaders = new HttpHeaders({
        Accept: "application/json",
        "Content-Type": "application/json; charset='utf-8'",
        'Access-Control-Allow-Origin': '*',
        'Authorization': 'authkey',
    });

    loginss(postData: any): Observable<any> {
        return this.httpService.post('signin', postData);
    }

    login(data: any): Observable<any> {
        //data.headers = this.headers;
        data = this.http.post(this.apiUrl + 'signin', data);
        return data;
        /*
        return this.http.post<any>(this.apiUrl + 'signin', data)
            .pipe(
                tap(_ => this.log('login ********************')),
                catchError(this.handleError('login', []))
            );
        */
    }

    public get logIn(): boolean {
        return (localStorage.getItem('token') !== null);
    }

    logout(): Observable<any> {
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('userId');
        sessionStorage.removeItem('userName');
        sessionStorage.removeItem('name');
        sessionStorage.removeItem('sexo');
        sessionStorage.removeItem('imagen');
        return this.http.get<any>(this.apiUrl + 'signout')
            .pipe(
                tap(_ => this.log('logout')),
                catchError(this.handleError('logout', []))
            );
    }

    register(data: any): Observable<any> {
        return this.http.post<any>(this.apiUrl + 'signup', data).pipe(
            tap(_ => this.log('register')),
            catchError(this.handleError('login', []))
        );
    }

    registerMinify(data: any): Observable<any> {
        return this.http.post<any>(this.apiUrl + 'signup/minify', data)
            .pipe(
                tap(_ => this.log('register')),
                catchError(this.handleError('login', []))
            );
    }

    modifyPassword(data: any): Observable<any> {
        return this.http.post<any>(this.apiUrl + 'modify_password', data)
            .pipe(
                tap(_ => this.log('modifyPassword')),
                catchError(this.handleError('modifyPassword', []))
            );
    }

    activate(data: any): Observable<any> {
        return this.http.post<any>(this.apiUrl + 'activate', data)
            .pipe(
                tap(_ => this.log('activate')),
                catchError(this.handleError('activate', []))
            );
    }

    editUser(userId: number): Observable<any> {
        return this.http.get<any>(this.apiUrl + 'usuario/edit/' + userId)
            .pipe(
                tap(_ => this.log('editar-usuario')),
                catchError(this.handleError('editar-usuario', []))
            );
    }

    textoLegal(): Observable<any> {
        return this.http.get<any>(this.apiUrl + 'textolegal/editActive')
            .pipe(
                tap(_ => this.log('register')),
                catchError(this.handleError('register', []))
            );
    }

    textoLegalList(): Observable<any> {
        return this.http.get<any>(this.apiUrl + 'textolegal/')
            .pipe(
                tap(_ => this.log('register')),
                catchError(this.handleError('register', []))
            );
    }

    getGoogleUser(userName: string, token: string, displayName: string): Observable<any> {
        return this.http.post<any>(this.apiUrl + 'usuario/edit_username/', { userName, token, displayName })
            .pipe(
                tap(_ => this.log('editar-usuario')),
                catchError(this.handleError('editar-usuario', []))
            );
    }

    updateUser(data: any): Observable<any> {
        return this.http.post<any>(this.apiUrl + 'usuario/update/', data)
            .pipe(
                tap(_ => this.log('editar-usuario')),
                catchError(this.handleError('editar-usuario', []))
            );
    }

    private handleError<T>(operation = 'operation', result?: T) {
        return (error: any): Observable<T> => {

            // TODO: send the error to remote logging infrastructure
            console.error(error); // log to console instead

            // TODO: better job of transforming error for user consumption
            this.log(`${operation} failed: ${error.message}`);

            // Let the app keep running by returning an empty result.
            //return of(result as T);
            return of(error);
        };
    }

    private log(message: string) {
        console.log(message);
    }
}
