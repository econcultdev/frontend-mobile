import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { UtilsService } from 'src/app/services/utils.service';
import { Router, ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { TranslateConfigService } from 'src/app/services/translate-config.service';
import { Subscription } from 'rxjs';
import { isEmpty } from 'rxjs/operators';

@Component({
  selector: 'app-encuesta-personal',
  templateUrl: './encuesta-personal.page.html',
  styleUrls: ['./encuesta-personal.page.scss'],
})
export class EncuestaPersonalPage implements OnInit {

  id = null;
  progress = 0;
  pregunta = null;
  valor: any = '';
  respuestaId = '';
  userId = parseInt(sessionStorage.getItem('userId'), 10);
  step = 0;
  loaded = false;
  preguntas = [];
  respuestas = [];
  respuestasUser = [];
  preguntasRespondidasId = {};
  pregLimits = { init: 0, end: 0, arr: [] };
  sexo = '';
  edad = 0;
  checked = false;
  numberIntroduce: string;
  motherTongue = 1;
  private _language;
  private _translateServiceSubscription: Subscription;

  constructor(private apiService: ApiService,
    private utilsService: UtilsService,
    public router: Router,
    private navController: NavController,
    private translateConfigService: TranslateConfigService) {
    this.translateConfigService.language.subscribe(() => {
      this.utilsService.translateLanguage('ENCUESTA_PERSONAL_TS.NUMBER_INTRODUCE').subscribe(res => {
        this.numberIntroduce = res;
      });
    });
  }

  ngOnInit() {
    if (!this.sexo && !this.edad) {
      this.userId = parseInt(sessionStorage.getItem('userId'), 10);
      this.apiService.getSexoEdad(this.userId)
        .subscribe((res) => {
          if (res && !res.status) {
            this.sexo = res.sexo;
            this.edad = res.edad;
          }
        }, (err) => {
          this.dismiss();
          console.error(err);
          this.utilsService.presentToastLanguage('ENCUESTA_PERSONAL_TS.SERVER_ERROR');
        });
    }
  }

  init() {
    this.userId = parseInt(sessionStorage.getItem('userId'), 10);
    this.checked = false;
    this.pregunta = null;
    this.valor = '';
    this.loaded = false;
    this.respuestas = [];
    this.respuestaId = '';
    this.respuestasUser = [];
    this.preguntasRespondidasId = {};
    this.pregLimits = { init: 0, end: 0, arr: [] };
  }

  ionViewWillLeave() {
    if (this._translateServiceSubscription) {
      this._translateServiceSubscription.unsubscribe()
    }
  }

  ionViewWillEnter() {
    this.init();
    this.progress = 0;
    this.step = 0;
    this.preguntas = [];

    this.utilsService.presentLoadingWithOptions().then(() => {
      this.apiService.cultoTipoPreguntas()
        .subscribe((res) => {
          if (res && !res.status) {
            this.apiService.cultoTipoRespuestasUser(this.userId)
              .subscribe((resU) => {
                if (resU && !resU.status) {
                  this.dismiss().then(() => {
                    this.preguntas = res;
                    this.respuestasUser = resU;

                    if (this.preguntas.length) {
                      this.step = 1 / (this.preguntas.length + 1);
                      this.progress = (this.respuestasUser.length) ? (this.respuestasUser.length + 1) * this.step : this.step;

                      if (this.respuestasUser.length < this.preguntas.length) {
                        for (const resp of this.respuestasUser) {
                          this.preguntasRespondidasId[resp.CultoTipoPreguntaId] = resp.CultoTipoPreguntaId;
                        }
                        for (const preg of this.preguntas) {
                          if (this.preguntasRespondidasId[preg.id] === undefined) {
                            this.pregunta = preg;
                            this.preProcessPregunta();
                            break;
                          }
                        }
                      }

                      this._translateServiceSubscription = this.translateConfigService.language.subscribe(language => {
                        this._language = language;
                      });

                      if (this.pregunta === null) {
                        this.apiService.asignarCultoTipo(this.userId)
                          .subscribe((resF) => {
                            if (resF !== undefined && (resF === false || (resF && !resF.status))) {
                              this.navController.navigateRoot(['/cultotipo']);
                            } else {
                              this.utilsService.presentToastLanguage('ENCUESTA_PERSONAL_TS.CULTOTIPO_ERROR');
                            }
                          }, (err) => {
                            console.error(err);
                            this.utilsService.presentToastLanguage('ENCUESTA_PERSONAL_TS.SERVER_ERROR');
                          });
                      } else {
                        if (this.valor !== '') {
                          this.respuestas = this.pregunta.CultoTipoRespuesta.map((el) => {
                            if (el.valor + '' === this.valor) {
                              const obj = JSON.parse(JSON.stringify(el));
                              obj['checked'] = true;
                              return obj;
                            } else {
                              return el;
                            }
                          })
                            .sort((a, b) => (a.valor > b.valor) ? 1 : -1);
                        } else {
                          this.respuestas = this.pregunta.CultoTipoRespuesta.sort((a, b) => (a.valor > b.valor) ? 1 : -1);
                        }
                      }

                    } else {
                      this.dismiss();
                      this.utilsService.presentToastLanguage('ENCUESTA_PERSONAL_TS.SURVEY_WTHOUT_QUESTIONS');
                    }
                  });
                } else {
                  this.dismiss();
                  this.utilsService.presentToastLanguage('ENCUESTA_PERSONAL_TS.NO_QUESTIONS');
                }
              }, (err) => {
                this.dismiss();
                console.error(err);
                this.utilsService.presentToastLanguage('ENCUESTA_PERSONAL_TS.SERVER_ERROR');
              });
          } else {
            this.dismiss();
            this.utilsService.presentToastLanguage('ENCUESTA_PERSONAL_TS.NO_QUESTIONS');
          }
        }, (err) => {
          this.dismiss();
          console.error(err);
          this.utilsService.presentToastLanguage('ENCUESTA_PERSONAL_TS.SERVER_ERROR');
        });
    });
  }

  onClickRespuesta(valor?: any, typeValue?: 'string' | undefined) {
    this.checked = false;
    let response;
    if (this.respuestaId) {
      const id = parseInt(this.respuestaId, 10);
      for (const respuesta of this.pregunta.CultoTipoRespuesta) {
        if (respuesta.id === this.respuestaId) {
          this.valor = respuesta.valor;
        }
      }
    } else {
      response = this.pregunta.CultoTipoRespuesta.filter(response => response.valor === valor);
      this.respuestaId = response && response.length > 0 ? response[0].id : this.respuestaId;
    }
    if (valor === '' && this.valor !== undefined && this.valor !== '') {
      if (typeValue) {
        valor = this.valor + '';
      } else {
        valor = this.valor;
      }
    }
    this.valor = '';
    let ok = false;
    for (const preg of this.preguntas) {
      if (preg.id === this.pregunta.id) {
        ok = true;
      }
    }
    if (ok) {
      this.utilsService.presentLoadingWithOptions().then(() => {
        const obj = {
          userId: this.userId,
          respuestaId: this.respuestaId,
          preguntaId: this.pregunta.id,
          valor
        };
        if (this.pregunta && this.pregunta.pregunta && this.pregunta.pregunta.toLowerCase() === 'sex' && response) {
          let lUser = {
            id: this.userId,
            sexo: response[0].respuesta.charAt(0).toUpperCase()
          }
          this.apiService.actualizarDatosPersonales(lUser).subscribe(() => { },
            (error) => {
              console.log(error);
            });
        }
        this.apiService.cultoTipoRespuestaUser(obj)
          .subscribe((res) => {
            if (res && !res.status) {
              this.init();
              this.apiService.cultoTipoRespuestasUser(this.userId)
                .subscribe((resU) => {
                  if (resU && !resU.status) {
                    this.dismiss().then(() => {
                      this.respuestasUser = resU;

                      this.progress = (this.respuestasUser.length + 1) * this.step;

                      if (this.respuestasUser.length < this.preguntas.length) {
                        for (const resp of this.respuestasUser) {
                          this.preguntasRespondidasId[resp.CultoTipoPreguntaId] = resp.CultoTipoPreguntaId;
                        }
                        for (const preg of this.preguntas) {
                          if (this.preguntasRespondidasId[preg.id] === undefined) {
                            this.pregunta = preg;
                            this.preProcessPregunta();
                            break;
                          }
                        }
                      }

                      if (this.pregunta === null) {
                        this.apiService.asignarCultoTipo(this.userId)
                          .subscribe((resF) => {
                            if (resF !== undefined && (resF === false || (resF && !resF.status))) {
                              this.navController.navigateRoot(['/cultotipo']);
                            } else {
                              this.utilsService.presentToastLanguage('ENCUESTA_PERSONAL_TS.CULTOTIPO_ERROR');
                            }
                          }, (err) => {
                            console.error(err);
                            this.utilsService.presentToastLanguage('ENCUESTA_PERSONAL_TS.SERVER_ERROR');
                          });
                      } else {
                        if (this.valor !== '') {
                          this.respuestas = this.pregunta.CultoTipoRespuesta.map((el) => {
                            if (el.valor + '' === this.valor) {
                              const obj = JSON.parse(JSON.stringify(el));
                              obj['checked'] = true;
                              return obj;
                            } else {
                              return el;
                            }
                          })
                            .sort((a, b) => (a.valor > b.valor) ? 1 : -1);
                        } else {
                          this.respuestas = this.pregunta.CultoTipoRespuesta.sort((a, b) => (a.valor > b.valor) ? 1 : -1);
                        }
                      }
                    });
                  } else {
                    this.dismiss();
                    this.utilsService.presentToastLanguage('ENCUESTA_PERSONAL_TS.SERVER_ERROR');
                  }
                }, (err) => {
                  this.dismiss();
                  console.error(err);
                  this.utilsService.presentToastLanguage('ENCUESTA_PERSONAL_TS.SERVER_ERROR');
                });
            } else {
              this.dismiss();
              this.utilsService.presentToastLanguage('ENCUESTA_PERSONAL_TS.SERVER_ERROR');
            }
          }, (err) => {
            this.dismiss();
            console.error(err);
            this.utilsService.presentToastLanguage('ENCUESTA_PERSONAL_TS.SERVER_ERROR');
          });
      });
    } else {
      this.utilsService.presentToastLanguage('ENCUESTA_PERSONAL_TS.QUESTION_NOT_EXITS');
    }
  }


  preProcessPregunta() {
    this.pregLimits = { init: 0, end: 0, arr: [] };
    if (this.pregunta !== null) {
      if (this.pregunta.TipoPregunta.tipo === 'Número') {
        this.valor = '0';
      }
      else if (this.pregunta.TipoPregunta.tipo_multi.en && this.pregunta.TipoPregunta.tipo_multi.en.toLowerCase() === 'language list') {
        this.apiService.getLanguages().subscribe(languages => {
          this.respuestas = languages.map((lng) => {
            let lLanguage = {
              valor: lng.id_int,
              respuesta: lng.name,
              respuesta_multi: lng.name_multi,
              checked: false
            }
            return lLanguage;
          }).sort((a, b) => (a.valor > b.valor) ? 1 : -1);
        });
      }
      else if (/^\d\s*[a\-]\s*\d+$/i.test(this.pregunta.TipoPregunta.tipo)) {
        const arr = this.pregunta.TipoPregunta.tipo.match(/^(\d)\s*[a\-]\s*(\d+)$/i);
        if (arr.length === 3) {
          this.pregLimits.init = parseInt(arr[1], 10);
          this.pregLimits.end = parseInt(arr[2], 10);
          const offset = this.pregLimits.init + 1;
          this.pregLimits.arr = [...Array(this.pregLimits.end - offset).keys()].map(i => i + offset);
        }
      } else {
        if (/^\s*edad\s*$/i.test(this.pregunta.pregunta) && this.edad !== undefined) {
          this.valor = this.edad + '';
        }
        if (/^\s*sexo\s*$/i.test(this.pregunta.pregunta) && this.sexo) {
          this.checked = true;
          this.valor = (this.sexo === 'M') ? '1' : '2';
        }
      }
    }
  }

  dismiss() {
    this.loaded = true;
    return this.utilsService.dismiss();
  }

  /**
   * Change attributes when change language
   */
  changeAttributesByLanguage(singleValue, multiLanguageValue) {
    return this.utilsService.changeAttributesByLanguage(singleValue, multiLanguageValue);
  }

  /**
   * Change mother tongue
   * @param $event Event
   */
  changeMotherTongue($event) {
    this.motherTongue = $event.target.value ? $event.target.value : '';
    console.log(this.motherTongue)
  }

}
