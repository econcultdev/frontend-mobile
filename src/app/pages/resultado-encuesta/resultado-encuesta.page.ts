import { Component, OnInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { UtilsService } from 'src/app/services/utils.service';
import { ActivatedRoute, Router } from '@angular/router';
import { trigger, state, style, animate, transition } from '@angular/animations';
import * as d3 from 'd3';
import { TranslateConfigService } from 'src/app/services/translate-config.service';
import { Subscription } from 'rxjs';
import { AnimationOptions } from 'ngx-lottie';
import { ModalController } from '@ionic/angular';
import { LotteryComponent } from 'src/app/components/lottery/lottery.component';

@Component({
  selector: 'app-resultado-encuesta',
  templateUrl: './resultado-encuesta.page.html',
  styleUrls: ['./resultado-encuesta.page.scss'],
  animations: [
    trigger('popOverState', [
      state('show', style({
        opacity: 1,
        display: 'show'
      })),
      state('hide', style({
        opacity: 0,
        display: 'none'
      })),
      transition('show => hide', animate('600ms ease-out')),
      transition('hide => show', animate('1000ms ease-in'))
    ])
  ]
})
export class ResultadoEncuestaPage implements OnInit, OnDestroy {

  @ViewChild('divBarChart', { static: false }) divBarChart: ElementRef;
  modal: HTMLIonModalElement;

  id = 0;
  encuesta = null;
  userId = parseInt(sessionStorage.getItem('userId'), 10);
  loaded = false;
  isFirstDrawed = false;
  color = [
    'rgba(223,209,197,1)',
    'rgba(242,84,84,1)',
    'rgba(238,137,51,1)',
    'rgba(14,194,84,1)',
    'rgba(111,111,111,1)',
    'rgba(28,231,221,1)', // cyan
    'rgba(231,228,211,1)', // pink
    'rgba(3,1,3,1)', // black
    'rgba(239,107,51,1)', // orange
    'rgba(157,51,239,1)', // violet
    'rgba(16,82,248,1)', // royalblue
    'rgba(241,28,39,1)'];
  labels: any;
  preguntas = {};
  preguntasContador = [];
  respuestas = {};
  dataset = {};
  svg = null;
  width = 270;
  height = 250;
  offset = 30;
  innerRadius = 10;
  barHeight = 100;
  divTooltip = null;
  usuario = {};
  showDiv = false;
  barChart = null;
  numMinUsuariosShowCompare = 3;
  showCompare = false;
  lottieOptionsSearch: AnimationOptions = {
    path: '/assets/lottie/search.json',
    renderer: 'svg',
  };
  lottieOptionsReturnLater: AnimationOptions = {
    path: '/assets/lottie/return_later_min_survey.json',
  };

  lottieStyles: Partial<CSSStyleDeclaration> = {
    maxWidth: 'calc(100% - 3m)',
    maxHeight: 'calc(100% - 3m)',
    width: '500px',
    height: '500px',
    margin: '0 auto',
  };

  private _language;
  private _translateServiceSubscription: Subscription;

  constructor(
    private apiService: ApiService,
    private activatedRoute: ActivatedRoute,
    private modalController: ModalController,
    private router: Router,
    private translateConfigService: TranslateConfigService,
    private utilsService: UtilsService) {
  }

  ngOnInit() {
    this.barHeight = this.height * .5 - 40;
  }

  ngOnDestroy() {
    this.loaded = false;
    this.isFirstDrawed = false;
    this.labels = {};
    if (this._translateServiceSubscription) {
      this._translateServiceSubscription.unsubscribe();
    }
  }

  ionViewWillLeave() {
    this.loaded = false;
    this.isFirstDrawed = false;
    this.labels = {};
    d3.selectAll('g > *').remove();
    return this.utilsService.dismiss();
  }

  ionViewWillEnter() {
    this.userId = parseInt(sessionStorage.getItem('userId'), 10);
    this.id = 0;
    this.encuesta = null;
    this.loaded = false;
    this.showDiv = false;
    this.isFirstDrawed = false;
    this.dataset = {};
    this.preguntasContador = [];
    this.preguntas = {};
    this.respuestas = {};
    this.usuario = {};
    this.showCompare = false;

    this.labels = {
      user: { isChecked: true, color: this.color[0], title: 'Tu evaluación' },
      global: { isChecked: true, color: this.color[1], title: 'Evaluación general del evento' },
      sexo: { isChecked: false, color: this.color[2], title: 'Media del evento por tu género' },
      cultotipo: { isChecked: false, color: this.color[3], title: 'Media del evento por tu cultotipo' },
      edad: { isChecked: false, color: this.color[4], title: 'Media del evento por tu edad' }
    };

    this._translateLanguageVariable('RESULTADOS_ENCUESTA_TS.EVALUATION', 'evaluation');
    this._translateLanguageVariable('RESULTADOS_ENCUESTA_TS.GENERAL_EVALUATION', 'generalEvaluation');
    this._translateLanguageVariable('RESULTADOS_ENCUESTA_TS.EVENT_GENDER_HALF', 'eventGenederHalf');
    this._translateLanguageVariable('RESULTADOS_ENCUESTA_TS.EVENT_CULTOTIPO_HALF', 'eventCultotipoHalf');
    this._translateLanguageVariable('RESULTADOS_ENCUESTA_TS.EVENT_AGE_HALF', 'eventAgeHalf');

    if (this.activatedRoute.snapshot.paramMap.get('id') && /^\d+$/.test(this.activatedRoute.snapshot.paramMap.get('id'))) {
      this.id = parseInt(this.activatedRoute.snapshot.paramMap.get('id'), 10);
    }
    if (this.id && !isNaN(this.id)) {
      this.apiService.getEncuesta(this.id, this.userId)
        .subscribe((res) => {
          this._translateServiceSubscription = this.translateConfigService.language.subscribe(language => {
            this._language = language;
          });
          if (res && !res.status) {
            this.apiService.resultadosEncuesta({ encuestaId: this.id, userId: this.userId })
              .subscribe((resE) => {
                if (resE && !resE.status) {
                  this.apiService.getSexoEdad(this.userId)
                    .subscribe((resU) => {
                      if (resU && !resU.status) {
                        if (this.numMinUsuariosShowCompare < resE.encuestasFinalizadas) {
                          this.showCompare = true;
                        }
                        if (this.preguntasContador.length === 0) {
                          this.checkCultoTypeSurvey();
                        }
                        this.usuario = resU;
                        this.encuesta = res;
                        this.createData(resE);
                        this.dismiss().then(() => {
                          if (this.preguntasContador.length && this.showCompare) {
                            setTimeout(() => {
                              this.initSvg();
                              this.createSvg();
                              this.reCreateSvg();
                              this.divBarChart.nativeElement.appendChild(this.barChart.node());
                            }, 3 * 1000);
                          }
                        });
                      } else {
                        this.dismiss();
                        this.utilsService.presentToastLanguage('RESULTADOS_ENCUESTA_TS.SERVER_ERROR');
                      }
                    }, (err) => {
                      this.dismiss();
                      console.error(err);
                      this.utilsService.presentToastLanguage('RESULTADOS_ENCUESTA_TS.SERVER_ERROR');
                    });
                } else {
                  this.dismiss();
                  this.utilsService.presentToastLanguage('RESULTADOS_ENCUESTA_TS.SERVER_ERROR');
                }
              }, (err) => {
                this.dismiss();
                console.error(err);
                this.utilsService.presentToastLanguage('RESULTADOS_ENCUESTA_TS.SERVER_ERROR');
              })
          } else {
            this.dismiss();
            this.utilsService.presentToastLanguage('RESULTADOS_ENCUESTA_TS.SERVER_ERROR');
          }
        }, (err) => {
          this.dismiss();
          console.error(err);
          this.utilsService.presentToastLanguage('RESULTADOS_ENCUESTA_TS.SERVER_ERROR');
        });
    } else {
      this.utilsService.presentToastLanguage('RESULTADOS_ENCUESTA_TS.SURVEY_NOT_ALLOWED');
    }
  }

  private _translateLanguageVariable(title: string, localVariable: any) {
    this.translateConfigService.language.subscribe(() => {
      this.utilsService.translateLanguage(title).subscribe(res => {
        switch (localVariable) {
          case 'evaluation':
            this.labels.user.title = res;
            break;
          case 'generalEvaluation':
            this.labels.global.title = res;
            break;
          case 'eventGenederHalf':
            this.labels.sexo.title = res;
            break;
          case 'eventCultotipoHalf':
            this.labels.cultotipo.title = res;
            break;
          case 'eventAgeHalf':
            this.labels.edad.title = res;
            break;
        }
      });

    });
  }


  createData(resE: any) {

    const preguntas = {};
    for (const pregunta of this.encuesta.preguntas) {
      preguntas[pregunta.id] = pregunta;
    }

    const respuestas = {};
    for (const respuesta of resE.respuestasUser) {
      if (!preguntas[respuesta.EncuestaPreguntaId]) {
        continue;
      }
      let preguntaObj = preguntas[respuesta.EncuestaPreguntaId];
      let valor = '';
      switch (preguntas[respuesta.EncuestaPreguntaId].TipoPregunta.tipo) {
        case 'Sí/No':
          valor = (respuesta.valor == '1') ? 'Sí' : 'No';
          break;
        case 'Precio':
          if (respuesta.precio != null) {
            preguntaObj.pregunta = preguntaObj.pregunta.replace('XX', respuesta.precio);
            preguntaObj.pregunta_multi = this.replacePrice(preguntaObj.pregunta_multi, respuesta.precio);
            preguntas[respuesta.EncuestaPreguntaId].pregunta = preguntaObj.pregunta;
            preguntas[respuesta.EncuestaPreguntaId].pregunta_multi = preguntaObj.pregunta_multi;

            preguntaObj.descripcion = preguntaObj.descripcion.replace('XX', respuesta.precio);
            preguntaObj.descripcion_multi = this.replacePrice(preguntaObj.descripcion_multi, respuesta.precio);
            preguntas[respuesta.EncuestaPreguntaId].descripcion = preguntaObj.descripcion;
            preguntas[respuesta.EncuestaPreguntaId].descripcion_multi = preguntaObj.descripcion_multi;

            preguntaObj.titulo_corto = preguntaObj.titulo_corto.replace('XX', respuesta.precio);
            preguntaObj.titulo_corto_multi = this.replacePrice(preguntaObj.titulo_corto_multi, respuesta.precio);
            preguntas[respuesta.EncuestaPreguntaId].titulo_corto = preguntaObj.titulo_corto;
            preguntas[respuesta.EncuestaPreguntaId].titulo_corto_multi = preguntaObj.titulo_corto_multi;
          }
          valor = (respuesta.valor == '1') ? 'Sí' : 'No';
          break;
        default:
          valor = respuesta.valor;
      }
      respuestas[respuesta.EncuestaPreguntaId] = { valor: valor, pregunta: preguntaObj.pregunta };
    }
    const preguntasContador = [];
    for (const respuesta of resE.respuestasContador) {
      if (!preguntas[respuesta.EncuestaPreguntaId]) {
        continue;
      }
      preguntasContador.push({
        id: respuesta.EncuestaPreguntaId, pregunta: respuesta.EncuestaPregunta.pregunta,
        titulo: preguntas[respuesta.EncuestaPreguntaId].titulo_corto
      });
    }

    const dataset = {};
    for (const datasetLabel in this.labels) {
      if (!datasetLabel) {
        continue;
      }
      if (!this.labels[datasetLabel]) {
        continue;
      }
      for (const pregunta of preguntasContador) {
        if (dataset[pregunta.id] === undefined) {
          dataset[pregunta.id] = [];
        }
        const obj = { label: datasetLabel, valor: null };
        dataset[pregunta.id].push(obj);
        switch (datasetLabel) {
          case 'user':
            const arrUser = resE.respuestasUser.filter((el: any) => {
              return el.EncuestaPreguntaId === pregunta.id;
            }).map(el => el.valor);
            if (arrUser.length) {
              obj.valor = parseInt(arrUser.shift(), 10);
            } else {
              obj.valor = 0;
            }
            break;
          case 'global':
            const arrContador = resE.respuestasContador.filter((el: any) => {
              return el.EncuestaPreguntaId === pregunta.id;
            }).map(el => el.valor);
            if (arrContador.length) {
              obj.valor = parseInt(arrContador.shift(), 10);
            } else {
              obj.valor = 0;
            }
            break;
          default:
            let valorUsuario = null;
            switch (datasetLabel) {
              case 'edad':
                valorUsuario = this.usuario['edad'] + '';
                break;
              case 'sexo':
                valorUsuario = this.usuario['sexo'];
                break;
              case 'cultotipo':
                valorUsuario = this.usuario['cultotipo'] + '';
                break;
            }
            const arrContadorCriterio = resE.respuestasContadorCriterio.filter((el: any) => {
              return el.criterio === datasetLabel && el.EncuestaPreguntaId === pregunta.id &&
                ((valorUsuario !== null && el.criterioId === valorUsuario) || true);
            }).map(el => el.valor);
            if (arrContadorCriterio.length) {
              obj.valor = parseInt(arrContadorCriterio.shift(), 10) || 0;
            } else {
              obj.valor = 0;
            }
            break;
        }
      }
    }
    this.preguntas = preguntas;
    this.dataset = dataset;
    this.preguntasContador = preguntasContador;
    this.respuestas = respuestas;
  }

  /**
   * Replace XX to price value
   * @param multiVariable Multi language variable values
   */
  private replacePrice(multiVariable: any, price: any) {
    let lKeys: any[] = Object.keys(multiVariable);
    lKeys.map(key => multiVariable[key] = multiVariable[key].replace('XX', price));
    return multiVariable;
  }

  initSvg() {
    d3.selectAll('#barChart').remove();
    d3.selectAll('#tooltip').remove();
    this.barChart = d3.select('body').append('div').attr('id', 'barChart').attr('class', 'barChart');
    this.svg = d3.select('#barChart')
      .append('svg')
      .attr('width', this.width)
      .attr('height', this.height)
      .append('g')
      .attr('transform', 'translate(' + (this.width + this.offset) / 2 + ',' + (this.height + this.offset) / 2 + ')');
    this.divTooltip = d3.select('body').append('div')
      .attr('class', 'tooltip')
      .attr('id', 'tooltip')
      .style('opacity', 0);
  }

  createSvg() {
    this.svg.append('circle')
      .attr('r', this.innerRadius)
      .classed('inner', true)
      .style('fill', 'none')
      .style('stroke', 'grey')
      .style('stroke-width', '2px');

    const numPreguntas = this.preguntasContador.length;
    const offsetAngle = (2 * Math.PI) / numPreguntas;
    const offsetAngleGrad = 360 / numPreguntas;

    const lines = this.svg.selectAll('line')
      .data(this.preguntasContador)
      .enter().append('line')
      .attr('y1', -this.innerRadius)
      .attr('y2', -((this.height - this.offset) / 2))
      .style('stroke', 'black')
      .style('stroke-width', '.5px')
      .attr('transform', (d, i) => 'rotate(' + (i * offsetAngleGrad) + ')');

    const defs = this.svg.append('defs');
    const filter = defs
      .append('filter')
      .attr('id', 'dropshadow');
    filter.append('feGaussianBlur')
      .attr('in', 'SourceAlpha')
      .attr('stdDeviation', 2.5)
      .attr('result', 'blur');
    filter.append('feOffset')
      .attr('in', 'blur')
      .attr('dx', 2)
      .attr('dy', 2)
      .attr('result', 'offsetBlur');
    const feMerge = filter.append('feMerge');
    feMerge.append('feMergeNode')
      .attr('in', 'offsetBlur')
    feMerge.append('feMergeNode')
      .attr('in', 'SourceGraphic');

    const arc = d3.arc()
      .innerRadius(this.innerRadius);
    let j = 0;
    let k = 1;
    const arcData = [];
    for (const preguntaId in this.dataset) {
      if (preguntaId) {
        const preguntaIdInt = parseInt(preguntaId, 10);
        const pregunta = this.preguntas[preguntaIdInt].pregunta;
        const titulo = this.preguntas[preguntaIdInt].titulo_corto;
        const extent = d3.extent(this.dataset[preguntaId].filter((el) => this.labels[el.label].isChecked)
          .map((el) => el.valor)
          , (d) => d);
        const barScale = d3.scaleLinear().domain([0, extent[1]]).range([10 + this.innerRadius, this.barHeight]);
        const numLabels = this.dataset[preguntaId].map((el) => el.label).filter((el) => this.labels[el].isChecked).length + 2;
        const offsetArc = j * offsetAngle + (offsetAngle / numLabels);
        let i = 0;
        for (const valor of this.dataset[preguntaId]) {
          if (!this.labels[valor.label].isChecked) {
            continue;
          }
          const color = (this.labels[valor.label]) ? this.labels[valor.label].color : 'white';
          arcData.push({
            barScale,
            outerRadiusEnd: barScale(valor.valor),
            outerRadius: 0,
            pregunta,
            titulo,
            color,
            label: this.labels[valor.label].title,
            startAngle: offsetArc + ((i * offsetAngle) / numLabels),
            endAngle: offsetArc + (((i + 1) * offsetAngle) / numLabels),
            valor: valor.valor,
            k
          });
          k++;
          i++;
        }
        j++;
      }
    }

    const arcs = this.svg.selectAll('path')
      .data(arcData)
      .enter().append('path')
      .style('fill', (d) => d.color)
      .attr('id', (d) => 'arc_' + d.k)
      .attr('d', arc)
      .attr('filter', 'url(#dropshadow)')
      .on('mouseover', (d, i, n) => {
        this.divTooltip.transition()
          .duration(200)
          .style('opacity', .9);
        this.divTooltip.html('<p align="left">Info: ' + ((d.titulo) ? d.titulo : d.pregunta) + '. <br />Datos: ' + d.label + '. <br /> Valor: ' + d.valor.toFixed(2) + '</p>')
          .style('left', (d3.event.pageX) + 'px')
          .style('top', (d3.event.pageY - 28) + 'px')
        d3.select(n[i]).transition()
          .duration('50')
          .attr('opacity', '.75');
      })
      .on('mousemove', (d, i, n) => {
        this.divTooltip.style('left', (d3.event.pageX) + 'px')
          .style('top', (d3.event.pageY - 28) + 'px')
      })
      .on('mouseout', (d, i, n) => {
        this.divTooltip.transition()
          .duration(500)
          .style('opacity', 0);
        d3.select(n[i]).transition()
          .duration('50')
          .attr('opacity', '1');
      });

    arcs.transition().ease(d3.easeElastic).duration(1000).delay((d, i) => (1 - i) * 100)
      .attrTween('d', (d, index) => {
        const i = d3.interpolate(d.outerRadius, d.barScale(+d.valor));
        //console.log(d.outerRadius +',' + d.barScale(+d.valor) + ','+ d.valor);
        return (t) => { d.outerRadius = i(t); return arc(d, index); };
      });
    const labels = this.svg.append('g').classed('labels', true);
    labels.selectAll('text')
      .data(arcData)
      .enter().append('text')
      .attr('transform', (d, i, j) => {
        const angle = ((d.endAngle + d.startAngle) / 2) - (Math.PI / 2);
        const radius = this.innerRadius + d.outerRadiusEnd + 10;
        return 'translate(' + (radius * Math.cos(angle)) + ','
          + (radius * Math.sin(angle)) + ')';
      })
      .style('text-anchor', 'middle')
      .style('font-size', '12px')
      .style('font-weight', 'bold')
      .style('fill', '#3e3e3e')
      .text((d) => d.valor);

    this.isFirstDrawed = true;
  }

  get stateName() {
    return this.showDiv ? 'show' : 'hide'
  }

  toggle() {
    this.showDiv = !this.showDiv;
  }

  reCreateSvg() {
    if (this.loaded && this.isFirstDrawed) {
      d3.selectAll('g > *').remove();
      this.createSvg();
    }
  }

  dismiss() {
    setTimeout(() => {
      this.loaded = true;
    }, 2 * 1000);
    return this.utilsService.dismiss();
  }

  /**
   * Change attributes when change language
   */
  changeAttributesByLanguage(singleValue, multiLanguageValue) {
    return this.utilsService.changeAttributesByLanguage(singleValue, multiLanguageValue);
  }

  /**
   * Check user cultotype and navigate to lottery page
   */
  checkCultoTypeSurvey() {
    let userId = parseInt(sessionStorage.getItem('userId'), 10);
    this.apiService.cultoTipoUser(userId).subscribe(data => {
      if (!data) {
        this.showLotteryModal();
      }
    });
  }

  /**
   * Show the lottery modal
   * @returns Modal
   */
  async showLotteryModal() {
    this.modal = await this.modalController.create({
      component: LotteryComponent,
      backdropDismiss: false,
      showBackdrop: true,
      componentProps: {
        onClick: () => {
          this.modal.dismiss();
        },
      },
    });
    this.utilsService.setModal(this.modal);
    return await this.modal.present();
  }

  stopPropagationEvent(event: any) {
    return event.stopPropagation();
  }

}
