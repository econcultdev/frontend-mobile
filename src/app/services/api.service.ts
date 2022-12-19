import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

import { myInitObject } from '../config/config';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  apiUrl = myInitObject.apiUrl;

  constructor(private http: HttpClient) { }

  setEventSavedUser(data: any): Observable<any> {
    return this.http.post<any>(this.apiUrl + 'seteventsaveduser', data)
      .pipe(
        tap(_ => this.log('Event_Saved_User')),
        catchError(this.handleError('Event_Saved_User', []))
      );
  }

  getListExperienceEvaluate(businessId: number): Observable<any> {
    let params = new HttpParams();
    params = params.append('businessId', businessId + '');
    return this.http.get<any>(this.apiUrl + 'encuesta/getlist_experience_evaluate', { params })
      .pipe(
        tap(_ => this.log('Experience_Evaluate')),
        catchError(this.handleError('ExperienceEvaluate', []))
      );
  }
  getEventSavedUser(EventoId: number, UserId: number): Observable<any> {
    let params = new HttpParams();
    params = params.append('EventoId', EventoId + '');
    params = params.append('UserId', UserId + '');
    return this.http.get<any>(this.apiUrl + 'geteventsaveduser', { params })
      .pipe(
        tap(_ => this.log('Event_Saved_User')),
        catchError(this.handleError('Event_Saved_User', []))
      );
  }

  getEventSchedule(EventoId: number): Observable<any> {
    let params = new HttpParams();
    params = params.append('EventoId', EventoId + '');
    return this.http.get<any>(this.apiUrl + 'geteventschedule', { params })
      .pipe(
        tap(_ => this.log('Event_Schedule')),
        catchError(this.handleError('Event_Schedule', []))
      );
  }
  getEventOpinions(EventoId: number): Observable<any> {
    let params = new HttpParams();
    params = params.append('EventoId', EventoId + '');
    return this.http.get<any>(this.apiUrl + 'geteventopinionsbyid', { params })
      .pipe(
        tap(_ => this.log('Event_Saved_User')),
        catchError(this.handleError('Event_Saved_User', []))
      );
  }

  setHideReviewUser(data: any): Observable<any> {
    return this.http.post<any>(this.apiUrl + 'set_hidereviewuser', data)
      .pipe(
        tap(_ => this.log('encuesta_pregunta_user')),
        catchError(this.handleError('encuesta_pregunta_user', []))
      );
  }

  getEventoCloserByDate(userId: number): Observable<any> {
    return this.http.get<any>(this.apiUrl + 'evento_closerbydate/' + userId)
      .pipe(
        tap(_ => this.log('dashboard')),
        catchError(this.handleError('dashboard', []))
      );
  }

  /**
   * Used to get the featured events
   * @param userId User id
   * @returns Featured events
   */
  getEventosSavedUserId(userId: number): Observable<any> {
    let params = new HttpParams();
    params = params.append('UserId', userId + '');
    return this.http.get<any>(this.apiUrl + 'geteventossaveduserid', { params })
      .pipe(
        tap(_ => this.log('eventos-saved-user')),
        catchError(this.handleError('eventos-saved-user', []))
      );
  }


  /**
   * Used to get the featured events
   * @param limit Limit
   * @param offset Offset
   * @param userId User id
   * @returns Featured events
   */


  getListaEventosWithAuth(limit: number, offset: number, userId: number, date: Date): Observable<any> {
    let params = new HttpParams();
    if (!date)
      date = new Date();
    params = params.append('limit', limit + '');
    params = params.append('offset', offset + '');
    params = params.append('userId', userId + '');
    params = params.append('date_day', date + '');

    //let datstart = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0);

    return this.http.get<any>(this.apiUrl + 'lista_eventos_with_auth', { params })
      .pipe(
        tap(_ => this.log('eventos-destacados')),
        catchError(this.handleError('eventos-destacados', []))
      );
  }

  /**
   * It is used to obtain the featured events without being logged in.
   * @param limit Limit
   * @param offset Offset
   * @returns Featured events
   */
  getListaEventos(limit: number, offset: number, date_start: Date, date_end: Date): Observable<any> {
    let params = new HttpParams();
    params = params.append('limit', limit + '');
    params = params.append('offset', offset + '');
    let datastart = new Date(date_start.getFullYear(), date_start.getMonth(), date_start.getDate(), 0, 0, 0);
    let dataend = new Date(date_end.getFullYear(), date_end.getMonth(), date_end.getDate(), 23, 59, 59);

    params = params.append('date_start', date_start + '');
    params = params.append('date_end', date_end + '');

    return this.http.get<any>(this.apiUrl + 'lista_eventos', { params })
      .pipe(
        tap(_ => this.log('lista_eventos')),
        catchError(this.handleError('lista_eventos', []))
      );
  }

  /**
   * Used to get the featured events
   * @param limit Limit
   * @param offset Offset
   * @param userId User id
   * @returns Featured events
   */


  getListaEventos_plus(limit: number, offset: number): Observable<any> {
    let params = new HttpParams();
    params = params.append('limit', limit + '');
    params = params.append('offset', offset + '');
    return this.http.get<any>(this.apiUrl + 'lista_eventos_plus', { params })
      .pipe(
        tap(_ => this.log('eventos-destacados-plus')),
        catchError(this.handleError('eventos-destacados-plus', []))
      );
  }

  getEvento(id: number): Observable<any> {
    let params = new HttpParams();
    //params = params.append('userId', userId + '');
    return this.http.get<any>(this.apiUrl + 'eventos/edit/' + id)
      .pipe(
        tap(_ => this.log('eventos')),
        catchError(this.handleError('eventos', []))
      );
  }


  getImage(data: any): Observable<any> {
    return this.http.get<any>(this.apiUrl + 'image/' + data)
      .pipe(
        tap(_ => this.log('dashboard')),
        catchError(this.handleError('dashboard', []))
      );
  }

  getEncuesta(id: number, userId: number): Observable<any> {
    let params = new HttpParams();
    params = params.append('userId', userId + '');
    return this.http.get<any>(this.apiUrl + 'encuesta/edit/' + id, { params })
      .pipe(
        tap(_ => this.log('encuesta')),
        catchError(this.handleError('encuesta', []))
      );
  }

  getEncuestaQuestionBlockVisible(id: number, userId: number): Observable<any> {
    let params = new HttpParams();
    params = params.append('userId', userId + '');
    return this.http.get<any>(this.apiUrl + 'encuesta/questionblock/edit/' + id, { params })
      .pipe(
        tap(_ => this.log('encuesta/questionblock')),
        catchError(this.handleError('encuesta/questionblock', []))
      );
  }

  getEncuestaRespuestasUsuario(userId: number, encuestaId: number): Observable<any> {

    let params = new HttpParams();
    params = params.append('userId', userId + '');
    params = params.append('encuestaId', encuestaId + '');
    return this.http.get<any>(this.apiUrl + 'encuesta/respuestasUsuario', { params })
      .pipe(
        tap(_ => this.log('encuesta')),
        catchError(this.handleError('encuesta', []))
      );
  }

  getPreguntasSiguientes(): Observable<any> {
    return this.http.get<any>(this.apiUrl + 'encuestapregunta/preguntas_siguientes')
      .pipe(
        tap(_ => this.log('encuesta')),
        catchError(this.handleError('encuesta', []))
      );
  }

  listEncuestasUser(userId: number): Observable<any> {
    return this.http.get<any>(this.apiUrl + 'encuestas/user/' + userId)
      .pipe(
        tap(_ => this.log('encuesta')),
        catchError(this.handleError('encuesta', []))
      );
  }

  listEncuestasUserWithEventos(userId: number, finalizada: boolean): Observable<any> {
    let params = new HttpParams();
    if (finalizada !== null) {
      params = params.append('finalizada', finalizada + '');
    }
    return this.http.get<any>(this.apiUrl + 'encuestas_eventos/user/' + userId, { params })
      .pipe(
        tap(_ => this.log('encuesta')),
        catchError(this.handleError('encuesta', []))
      );
  }

  listEncuestasUserWithEventosLimit(limit: number, offset: number, userId: number): Observable<any> {
    let params = new HttpParams();
    params = params.append('offset', offset + '');
    params = params.append('limit', limit + '');
    return this.http.get<any>(this.apiUrl + 'encuestas_eventos/user/' + userId, { params })
      .pipe(
        tap(_ => this.log('encuesta')),
        catchError(this.handleError('encuesta', []))
      );
  }

  responderEncuesta(data: any): Observable<any> {
    return this.http.post<any>(this.apiUrl + 'encuesta/responder', data)
      .pipe(
        tap(_ => this.log('encuesta')),
        catchError(this.handleError('encuesta', []))
      );
  }

  valorarPreguntaEncuesta(data: any): Observable<any> {
    return this.http.post<any>(this.apiUrl + 'encuesta/valorarpregunta', data)
      .pipe(
        tap(_ => this.log('encuesta')),
        catchError(this.handleError('encuesta', []))
      );
  }

  resultadosEncuesta(data: any): Observable<any> {
    let params = new HttpParams();
    params = params.append('userId', data.userId + '');
    params = params.append('encuestaId', data.encuestaId + '');
    return this.http.get<any>(this.apiUrl + 'encuesta/resultados', { params })
      .pipe(
        tap(_ => this.log('encuesta')),
        catchError(this.handleError('encuesta', []))
      );
  }

  resultadosGlobalesEncuestas(userId: number): Observable<any> {
    let params = new HttpParams();
    params = params.append('userId', userId + '');
    return this.http.get<any>(this.apiUrl + 'encuesta/resultados_globales', { params })
      .pipe(
        tap(_ => this.log('resultados-globales')),
        catchError(this.handleError('resultados-globales', []))
      );
  }

  finalizarEncuesta(data: any): Observable<any> {
    return this.http.post<any>(this.apiUrl + 'encuesta/finalizar', data)
      .pipe(
        tap(_ => this.log('encuesta')),
        catchError(this.handleError('encuesta', []))
      );
  }

  cultoTipoPreguntas(): Observable<any> {
    return this.http.get<any>(this.apiUrl + 'cultotipo/pregunta_respuesta')
      .pipe(
        tap(_ => this.log('encuesta-personal')),
        catchError(this.handleError('encuesta-personal', []))
      );
  }

  cultoTipoRespuestasUser(userId: number): Observable<any> {
    let params = new HttpParams();
    params = params.append('userId', userId + '');
    return this.http.get<any>(this.apiUrl + 'cultotipo/respuestasUser', { params })
      .pipe(
        tap(_ => this.log('encuesta-personal')),
        catchError(this.handleError('encuesta-personal', []))
      );
  }

  cultoTipoUser(userId: number): Observable<any> {
    return this.http.get<any>(this.apiUrl + 'cultotipo/user/' + userId)
      .pipe(
        tap(_ => this.log('cultotipo')),
        catchError(this.handleError('cultotipo', []))
      );
  }

  actualizarDatosPersonales(data: any): Observable<any> {
    return this.http.post<any>(this.apiUrl + 'usuario/updateDatosPersonales', data)
      .pipe(
        tap(_ => this.log('datos-personales')),
        catchError(this.handleError('datos-personales', []))
      );
  }

  asignarCultoTipo(userId): Observable<any> {
    return this.http.post<any>(this.apiUrl + 'cultotipo/asignarCultoTipo', { userId })
      .pipe(
        tap(_ => this.log('encuesta-personal')),
        catchError(this.handleError('encuesta-personal', []))
      );
  }

  cultoTipoRespuestaUser(data: any): Observable<any> {
    return this.http.post<any>(this.apiUrl + 'cultotipo/respuestaUser', data)
      .pipe(
        tap(_ => this.log('encuesta-personal')),
        catchError(this.handleError('encuesta-personal', []))
      );
  }

  cultoTipoBorrarRespuestaUser(userId: number): Observable<any> {
    return this.http.post<any>(this.apiUrl + 'cultotipo/borrarRespuestaUser', { userId })
      .pipe(
        tap(_ => this.log('ficha-usuario')),
        catchError(this.handleError('ficha-usuario', []))
      );
  }

  getSexoEdad(userId: number): Observable<any> {
    return this.http.get<any>(this.apiUrl + 'usuario/getSexoEdad/' + userId)
      .pipe(
        tap(_ => this.log('encuesta-personal')),
        catchError(this.handleError('encuesta-personal', []))
      );
  }

  /**
   * Get questions type of impacts
   * @returns List questions type of impacts
   */
  getQuestionTypeImpacts(): Observable<any> {
    return this.http.get<any>(this.apiUrl + 'tipopreguntas/impact')
      .pipe(
        tap(_ => this.log('tipo-preguntas')),
        catchError(this.handleError('tipo-preguntas', []))
      );
  }

  /**
   * Get questions type of global satisfaction
   * @returns List questions type of global satisfaction
   */
  getQuestionTypeGlobalSatisfaction(): Observable<any> {
    return this.http.get<any>(this.apiUrl + 'tipopreguntas/globalsatisfaction')
      .pipe(
        tap(_ => this.log('tipo-preguntas')),
        catchError(this.handleError('tipo-preguntas', []))
      );
  }

  /**
   * Get questions type of global satisfaction
   * @returns List questions type of global satisfaction
   */
  getLanguages(): Observable<any> {
    return this.http.get<any>(this.apiUrl + 'language')
      .pipe(
        tap(_ => this.log('tipo-preguntas')),
        catchError(this.handleError('tipo-preguntas', []))
      );
  }

  buscarEventos(limit: number, offset: number, query: string, userId: any): Observable<any> {
    let params = new HttpParams();
    params = params.append('limit', limit + '');
    params = params.append('offset', offset + '');
    return this.http.get<any>(this.apiUrl + 'eventos/search/' + userId + '/' + query, { params })
      .pipe(
        tap(_ => this.log('header')),
        catchError(this.handleError('header', []))
      );
  }

  /**
   * Get countries
   * @returns List countries
   */
  getCountries(): Observable<any> {
    return this.defaultGET('paises');
  }

  /**
   * Get countries
   * @returns List countries
   */
  getProvinces(): Observable<any> {
    return this.defaultGET('provincias');
  }

  /**
   * Get countries
   * @returns List countries
   */
  getCities(): Observable<any> {
    return this.defaultGET('ciudades');
  }

  /**
   * Get List City Business
   * @returns List City
   */
  getCitiesBusiness(): Observable<any> {
    return this.defaultGET('listCitiesBusiness');
  }

  /**
   * Default get
   * @param url URL
   * @param logUrl LogURL
   * @returns Data
   */
  private defaultGET(url: string, logUrl?: string) {
    return this.http.get<any>(this.apiUrl + url)
      .pipe(
        tap(_ => this.log(logUrl ? logUrl : url)),
        catchError(this.handleError(logUrl ? logUrl : url, []))
      );
  }


  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      // return of(result as T);
      return of(error);
    };
  }

  private log(message: string) {
    console.log(message);
  }

  /**
   * Get Tipo Eventos
   * @returns List Tipo Eventos
   */
  getTipoEventos(): Observable<any> {
    return this.defaultGET('tipoevento');
  }
}
