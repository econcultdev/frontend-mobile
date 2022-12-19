import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { UtilsService } from 'src/app/services/utils.service';
import { NavController } from '@ionic/angular';
import { TranslateConfigService } from 'src/app/services/translate-config.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-encuesta',
  templateUrl: './encuesta.page.html',
  styleUrls: ['./encuesta.page.scss'],
})
export class EncuestaPage implements OnInit, OnDestroy {

  id = null;
  preguntaid = null;
  preguntasSiguientes = [];
  preguntasSiguientesHash = {};
  pregunta = null;
  encuesta = null;
  respuestas = [];
  preguntasRespondidasId = {};
  comentario_publico = false;
  progress = 0;
  valor = '';
  precio = 0;
  userId = parseInt(sessionStorage.getItem('userId'), 10);
  step = 0;
  loaded = false;
  pregLimits = { init: 0, end: 0, labelInit: '', labelEnd: '', arr: [] };
  amountEnter: string;
  questionTypeImpact = [];
  questionTypeGlobalSatisfaction = [];
  private _language;
  private _translateServiceSubscription: Subscription;

  constructor(private apiService: ApiService,
    private utilsService: UtilsService,
    private activatedRoute: ActivatedRoute,
    private navController: NavController,
    private translateConfigService: TranslateConfigService) { }

  ngOnInit(): void {
    this.translateConfigService.language.subscribe(() => {
      this._translateLanguage('ENCUESTA_TS.AMOUNT_ENTER', this.amountEnter);
    });
    this.apiService.getQuestionTypeImpacts().subscribe(data => { this.questionTypeImpact = data; });
    this.apiService.getQuestionTypeGlobalSatisfaction().subscribe(data => this.questionTypeGlobalSatisfaction = data);
    setTimeout(() => {
      this.chargeData();
    }, 100);
  }

  private _translateLanguage(variable: string, localVariable) {
    this.utilsService.translateLanguage(variable).subscribe(res => {
      localVariable = res;
    });
  }

  ionViewWillLeave() {
    return this.utilsService.dismiss();
  }

  chargeData() {
    this.userId = parseInt(sessionStorage.getItem('userId'), 10);
    this.id = null;
    this.preguntaid = null;
    this.pregunta = null;
    this.encuesta = null;
    this.respuestas = [];
    this.preguntasSiguientes = [];
    this.preguntasSiguientesHash = {};
    this.preguntasRespondidasId = {};
    this.progress = 0;
    this.valor = '';
    this.precio = 0;
    this.step = 0;
    this.loaded = false;
    this.pregLimits = { init: 0, end: 0, labelInit: '', labelEnd: '', arr: [] };
    if (this.activatedRoute.snapshot.paramMap.get('id') && /^\d+$/.test(this.activatedRoute.snapshot.paramMap.get('id'))) {
      this.id = parseInt(this.activatedRoute.snapshot.paramMap.get('id'), 10);
    }
    if (this.activatedRoute.snapshot.paramMap.get('pregunta') && /^\d+$/.test(this.activatedRoute.snapshot.paramMap.get('pregunta'))) {
      this.preguntaid = parseInt(this.activatedRoute.snapshot.paramMap.get('pregunta'), 10);
    }
    if (this.id && !isNaN(this.id)) {
      this.apiService.getEncuestaQuestionBlockVisible(this.id, this.userId)
        .subscribe((res) => {
          this._translateServiceSubscription = this.translateConfigService.language.subscribe(language => {
            this._language = language;
          });
          if (res && !res.status) {
            this.encuesta = res;
            if (this.encuesta.EncuestaUserFinalizada.length && this.encuesta.EncuestaUserFinalizada[0].finalizada) {
              this.dismiss();

              this.navController.navigateRoot('/app/resultado-encuesta/' + this.encuesta.id);
            } else {
              this.apiService.getEncuestaRespuestasUsuario(this.userId, this.encuesta.id)
                .subscribe((resR) => {
                  if (resR && !resR.status) {
                    this.respuestas = resR;
                    let isPregSig = false;
                    for (const preg of this.encuesta.preguntas) {
                      if (preg.EPId && preg.EPId.length) {
                        isPregSig = true;
                        break;
                      }
                    }
                    if (isPregSig) {
                      this.apiService.getPreguntasSiguientes()
                        .subscribe((resPS) => {
                          if (resPS && !resPS.status) {
                            this.dismiss().then(() => {
                              this.preguntasSiguientes = resPS;
                              for (const pS of this.preguntasSiguientes) {
                                this.preguntasSiguientesHash[pS.EncuestaPreguntaSiguienteId] = true;
                              }
                              this.processEncuesta();
                            });
                          }
                        }, (err) => {
                          this.dismiss();
                          console.error(err);
                          this.utilsService.presentToastLanguage('ENCUESTA_TS.SERVER_ERROR');
                        });
                    } else {
                      this.dismiss().then(() => {
                        this.processEncuesta();
                      });
                    }
                  } else {
                    this.dismiss();
                    this.utilsService.presentToastLanguage('ENCUESTA_TS.SURVEY_NOT_AVAILABLE');
                  }
                }, (err) => {
                  this.dismiss();
                  console.error(err);
                  this.utilsService.presentToastLanguage('ENCUESTA_TS.SERVER_ERROR');
                });
            }

          } else {
            this.dismiss();
            this.utilsService.presentToastLanguage('ENCUESTA_TS.SURVEY_NOT_AVAILABLE');
          }
        }, (err) => {
          this.dismiss();
          console.error(err);
          this.utilsService.presentToastLanguage('ENCUESTA_TS.SERVER_ERROR');
        });
    } else {
      this.utilsService.presentToastLanguage('ENCUESTA_TS.SURVEY_ERROR');
    }
  }


  processEncuesta() {
    this.encuesta.preguntas.sort((a, b) => { return a.EncuestasPreguntas.orden - b.EncuestasPreguntas.orden });
    if (this.encuesta.preguntas && this.encuesta.preguntas.length > 0) {

      this.step = 1 / (this.encuesta.preguntas.length + 1);

      for (const resp of this.respuestas) {
        this.preguntasRespondidasId[resp.EncuestaPreguntaId] = resp.valor;
      }
      this.searchPregunta();
    }
  }


  searchPregunta() {
    if (this.preguntaid !== null) {
      this.progress = (this.respuestas.length) ? this.respuestas.length * this.step : this.step;
      // recoger la pregunta de las preguntas asociadas a la encuesta
      for (const preg of this.encuesta.preguntas) {
        if (preg.id === this.preguntaid && this.preguntasRespondidasId[preg.id] === undefined && this.preguntasSiguientesHash[preg.id] === undefined) {
          this.pregunta = preg;
          this.preProcessPregunta();
          break;
        }
      }
      // buscar la pregunta en las preguntas siguientes
      if (this.pregunta === null && this.preguntasSiguientes.length) {
        const pregIds = this.encuesta.preguntas.map(el => el.id);
        const nextPregs = this.preguntasSiguientes.filter((el) => {
          // el id de la pregunta siguiente es el buscado y la pregunta no ha de estar respondida
          if (el.EncuestaPreguntaSiguienteId === this.preguntaid && this.preguntasRespondidasId[el.EncuestaPreguntaSiguienteId] === undefined) {
            // buscar la pregunta padre en las preguntas de la encuesta, que esté respondida y con la respuesta correcta.
            if (pregIds.includes(el.EncuestaPreguntaId) && this.preguntasRespondidasId[el.EncuestaPreguntaId] !== undefined && el.respuesta == this.preguntasRespondidasId[el.EncuestaPreguntaId]) {
              return el;
            }
          }
        });
        if (nextPregs.length) {
          this.pregunta = nextPregs[0].EPSId;
          this.preProcessPregunta();
        }
      }
    }

    // no se ha suministrado un id de pregunta o no se ha encontrado. Se busca la siguiente disponible
    if (this.pregunta === null) {
      this.progress = (this.respuestas && this.respuestas.length > 0) ?
        (this.respuestas.length + 1) * this.step : this.step;

      loopPreguntas:
      for (const preg of this.encuesta.preguntas) {
        if (this.preguntasRespondidasId[preg.id] === undefined && this.preguntasSiguientesHash[preg.id] === undefined) {
          this.pregunta = preg;
          this.preProcessPregunta();
          break;
        } else if (preg.EPId && preg.EPId.length) { // pregunta contestada y con siguientes
          // buscar si hay alguna pregunta siguiente sin contestar
          let pregId = preg.id;
          const nextPregs = this.preguntasSiguientes.filter((el) => el.EncuestaPreguntaId === pregId && el.respuesta == this.preguntasRespondidasId[pregId]);
          while (nextPregs.length) {
            const preg = nextPregs.shift();
            if (this.preguntasRespondidasId[preg.EncuestaPreguntaSiguienteId] === undefined) {
              this.pregunta = preg.EPSId;
              this.preProcessPregunta();
              break loopPreguntas;
            } else {
              pregId = preg.EncuestaPreguntaSiguienteId;
              const pregs = this.preguntasSiguientes.filter((el) => el.EncuestaPreguntaId === pregId && el.respuesta == this.preguntasRespondidasId[pregId]);
              nextPregs.push(...pregs);
            }
          }
        }
      }
    }
    // if (this.respuestas.length === this.encuesta.preguntas.length || this.pregunta === null) {
    // Sin pregunta que mostrar, se entiende que la encuesta ha finalizado
    if (this.pregunta === null) {
      this.apiService.finalizarEncuesta({ userId: this.userId, encuestaId: this.encuesta.id, finalizada: true })
        .subscribe((resF) => {
          this.dismiss().then(() => {
            if (resF && !resF.status && resF.ok) {
              this.navController.navigateRoot('/app/resultado-encuesta/' + this.encuesta.id);
            } else {
              this.utilsService.presentToastLanguage('ENCUESTA_TS.SURVEY_FINISH_ERROR');
            }
          });
        }, (err) => {
          this.dismiss();
          console.error(err);
          this.utilsService.presentToastLanguage('ENCUESTA_TS.SERVER_ERROR');
        });
    } else {
      this.dismiss();
    }
  }

  onClickRespuesta(valor: any) {
    if (valor === '' && this.valor) {
      valor = this.valor;
    }
    this.valor = '';
    const data = {
      userId: this.userId, encuestaId: this.encuesta.id, preguntaId: this.pregunta.id, valor: valor + '',
      precio: (this.precio) ? this.precio : null, comentario_publico: this.comentario_publico
    };

    this.utilsService.presentLoadingWithOptions().then(() => {
      this.apiService.responderEncuesta(data)
        .subscribe((res) => {
          if (res) {
            if (res.status) {
              this.dismiss();
              this.utilsService.presentToastLanguage('ENCUESTA_TS.RESPONSE_SAVE_ERROR');
            } else {
              // if (/^\d\s*[a\-]\s*\d+$/.test(this.pregunta.TipoPregunta.tipo)) {
              if (this.searchQuestionTypeForImpacts(this.questionTypeImpact, this.pregunta.TipoPregunta)
                || this.searchQuestionTypeForImpacts(this.questionTypeGlobalSatisfaction, this.pregunta.TipoPregunta)) {
                const objV = { encuestaId: this.encuesta.id, preguntaId: this.pregunta.id, userId: this.userId, valor };
                this.apiService.valorarPreguntaEncuesta(objV)
                  .subscribe(() => {
                    this.continuarEncuesta(res);
                  }, (err) => {
                    this.utilsService.dismiss();
                    console.error(err);
                    this.utilsService.presentToastLanguage('ENCUESTA_TS.SERVER_ERROR');
                    return;
                  });
              } else {
                this.continuarEncuesta(res);
              }
            }
          } else {
            this.dismiss();
            this.utilsService.presentToastLanguage('ENCUESTA_TS.RESPONSE_SAVE_ERROR');
          }
        }, (err) => {
          this.dismiss();
          console.error(err);
          this.utilsService.presentToastLanguage('ENCUESTA_TS.SERVER_ERROR');
        });
    });
  }

  /**
   * Search in list if present question type
   * @param list List
   * @param questionType Question type
   * @returns boolean value
   */
  searchQuestionTypeForImpacts(list: any[], questionType) {
    return !!list.find(elem => elem.id === questionType.id);
  }

  continuarEncuesta = (res: any) => {
    this.respuestas.push(res);
    this.progress = (this.respuestas.length + 1) * this.step;
    this.preguntasRespondidasId[this.pregunta.id] = res.valor;
    this.pregunta = null;
    this.preguntaid = null;
    this.searchPregunta();
  }

  preProcessPregunta() {
    this.pregLimits = { init: 0, end: 0, labelInit: '', labelEnd: '', arr: [] };
    if (this.pregunta !== null) {
      if (/^\d\s*[a\-]\s*\d+.*$/i.test(this.pregunta.TipoPregunta.tipo)) {
        const arr = this.pregunta.TipoPregunta.tipo.match(/^(\d)\s*[a\-]\s*(\d+)(.*)$/i);
        if (arr.length >= 3) {
          this.pregLimits.init = parseInt(arr[1], 10);
          this.pregLimits.end = parseInt(arr[2], 10);
          const offset = this.pregLimits.init + 1;
          this.pregLimits.arr = [...Array(this.pregLimits.end - offset).keys()].map(i => i + offset);
          if (arr.length === 4) {
            switch (arr[3].trim().toLowerCase()) {
              case 'impacto':
                this._translateLanguage('ENCUESTA_TS.NO_IMPACT', this.pregLimits.labelInit);
                this._translateLanguage('ENCUESTA_TS.MAXIMUM_IMPACT', this.pregLimits.labelEnd);
                break;
              case 'satisfacción':
                this._translateLanguage('ENCUESTA_TS.NO_SATISFACTION', this.pregLimits.labelInit);
                this._translateLanguage('ENCUESTA_TS.MAXIMUM_SATISFACTION', this.pregLimits.labelEnd);
                break;
              default:
                this._translateLanguage('ENCUESTA_TS.STRONGLY_DISAGREE', this.pregLimits.labelInit);
                this._translateLanguage('ENCUESTA_TS.MAXIMUM_AGREE', this.pregLimits.labelEnd);
            }
          } else {
            this._translateLanguage('ENCUESTA_TS.STRONGLY_DISAGREE', this.pregLimits.labelInit);
            this._translateLanguage('ENCUESTA_TS.MAXIMUM_AGREE', this.pregLimits.labelEnd);
          }
        }
      } else if ((this.pregunta.TipoPregunta.tipo === 'Precio' || this.pregunta.TipoPregunta.tipo === 'Price') && this.encuesta.Eventos.precio) {
        if (!this.precio) {
          const precios = this.respuestas.filter(el => el.precio);
          if (precios.length) {
            this.precio = precios[0].precio;
          } else {
            const arrPrecios = this.encuesta.Eventos.precio.split(/\s*[,-]\s*/);
            if (arrPrecios.length > 1) {
              const max = parseInt(arrPrecios[1].trim(), 10);
              const min = parseInt(arrPrecios[0].trim(), 10);
              this.precio = Math.floor(Math.random() * ((max + 1) - min) + min);
            }
          }
        }
        this.pregunta.pregunta = this.pregunta.pregunta.replace('XX', this.precio);
        this.replacePrice('pregunta_multi');

        this.pregunta.titulo_corto = this.pregunta.titulo_corto.replace('XX', this.precio);
        this.replacePrice('titulo_corto_multi');

        this.pregunta.descripcion = this.pregunta.descripcion.replace('XX', this.precio);
        this.replacePrice('descripcion_multi');
      }
    }
  }

  /**
   * Replace XX to price value
   * @param nameMultiVariable Name from multi language variable
   */
  private replacePrice(nameMultiVariable: string) {
    let lKeys: any[] = Object.keys(this.pregunta[nameMultiVariable]);
    lKeys.map(key => this.pregunta[nameMultiVariable][key] = this.pregunta[nameMultiVariable][key].replace('XX', this.precio));
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

  ngOnDestroy() {
    if (this._translateServiceSubscription) {
      this._translateServiceSubscription.unsubscribe();
    }
  }

}
