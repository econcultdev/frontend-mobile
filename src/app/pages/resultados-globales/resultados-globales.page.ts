import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { UtilsService } from 'src/app/services/utils.service';

import {
  trigger,
  state,
  style,
  animate,
  transition
} from '@angular/animations';

import * as d3 from 'd3';
import { TranslateConfigService } from 'src/app/services/translate-config.service';

@Component({
  selector: 'app-resultados-globales',
  templateUrl: './resultados-globales.page.html',
  styleUrls: ['./resultados-globales.page.scss'],
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
export class ResultadosGlobalesPage implements OnInit {

  userId = parseInt(sessionStorage.getItem('userId'), 10);
  loaded = false;
  color = [
    'rgba(223,209,197,1)',
    'rgba(242,84,84,1)',
    'rgba(238,137,51,1)',
    'rgba(14,194,84,1)',
    'rgba(111,111,111,1)',
    'rgba(28,231,221,1)', // cyan
    'rgb(211, 188, 58)',
    'rgba(3,1,3,1)', // black
    'rgba(239,107,51,1)', // orange
    'rgba(157,51,239,1)', // violet
    'rgba(16,82,248,1)', // royalblue
    'rgba(241,28,39,1)'];
  labels: any = {};
  preguntas = [];
  dataset = {};
  svg = null;
  width = 270;
  height = 250;
  offset = 30;
  innerRadius = 10;
  barHeight = 100;
  divTooltip = null;
  tipoEventos = [];
  labelsHtml = [];
  showDiv = false;
  isFirstDrawed = false;

  private _half: string;

  constructor(
    private apiService: ApiService,
    private utilsService: UtilsService,
    private translateConfigService: TranslateConfigService) { }

  ngOnInit() {
    this.barHeight = this.height * .5 - 40;
    this.labels = {
      user: { isChecked: true, color: this.color[0], title: 'Tu media total', nombre: 'user' },
      global: { isChecked: true, color: this.color[1], title: 'Media total general', nombre: 'global' }
    };

    this._translateLanguageVariable('RESULTADO_GLOBALES_TS.TOTAL_HALF', 'evaluation');
    this._translateLanguageVariable('RESULTADO_GLOBALES_TS.GLOBAL_TOTAL_HALF', 'global');
    this._translateLanguageVariable('RESULTADO_GLOBALES_TS.HALF', 'half');
  }

  ionViewWillLeave() {
    this.loaded = false;
    this.isFirstDrawed = false;
    this.labels = {};
    d3.selectAll('g > *').remove();
    d3.select('#barChartGlobales').selectAll('svg').remove();
    this.svg = null;
    return this.utilsService.dismiss();
  }

  ionViewWillEnter() {
    this.userId = parseInt(sessionStorage.getItem('userId'), 10);
    this.showDiv = false;
    this.loaded = false;
    this.isFirstDrawed = false;

    this.dataset = {};
    this.preguntas = [];
    this.tipoEventos = [];

    this.svg = d3.select('#barChartGlobales')
      .append('svg')
      .attr('width', this.width)
      .attr('height', this.height)
      .append('g')
      .attr('transform', 'translate(' + (this.width + this.offset) / 2 + ',' + (this.height + this.offset) / 2 + ')');

    this.divTooltip = d3.select('body').append('div')
      .attr('class', 'tooltip')
      .attr('id', 'tooltip')
      .style('opacity', 0);

    this.utilsService.presentLoadingWithOptions().then(() => {
      this.apiService.listEncuestasUserWithEventos(this.userId, null)
        .subscribe((encuestas) => {
          if (encuestas && !encuestas.status) {
            let i = this.labels ? Object.keys(this.labels).length : 1;
            for (const enc of encuestas) {
              this.labels[enc.Eventos.TipoEvento.nombre] = {
                id: enc.Eventos.TipoEvento.id,
                isChecked: false,
                color: this.color[i],
                title: this._half + ' ' + enc.Eventos.TipoEvento.nombre,
                nombre: enc.Eventos.TipoEvento.nombre,
                half: true
              };
              i++;
            }
            this.labelsHtml = Object.keys(this.labels).filter(i => i !== 'user' && i !== 'global').map(i => this.labels[i]);
            this.apiService.resultadosGlobalesEncuestas(this.userId)
              .subscribe((res) => {
                if (res && !res.status) {
                  this.createData(res);
                  this.dismiss().then(() => {
                    this.createSvg();
                  });
                } else {
                  this.dismiss();
                  this.utilsService.presentToastLanguage('RESULTADO_GLOBALES_TS.SERVER_ERROR');
                }
              }, (err) => {
                this.dismiss();
                console.error(err);
                this.utilsService.presentToastLanguage('RESULTADO_GLOBALES_TS.SERVER_ERROR');
              });
          } else {
            this.dismiss();
            this.utilsService.presentToastLanguage('RESULTADO_GLOBALES_TS.SERVER_ERROR');
          }
        }, (err) => {
          this.dismiss();
          console.error(err);
          this.utilsService.presentToastLanguage('RESULTADO_GLOBALES_TS.SERVER_ERROR');
        });
    });
  }

  private _translateLanguageVariable(title: string, localVariable: any) {
    this.translateConfigService.language.subscribe(() => {
      this.utilsService.translateLanguage(title).subscribe(res => {
        switch (localVariable) {
          case 'evaluation':
            this.labels.user.title = res;
            break;
          case 'global':
            this.labels.global.title = res;
            break;
          default:
            this._half = res;
            for (let label in this.labels) {
              if (this.labels[label].half) {
                this.labels[label].title = this._half + ' ' + this.labels[label].nombre;
              }
            }
            break;
        }
      });
    });
  }

  createData(resE: any) {
    const preguntas = [];
    const preguntasId = {};
    for (const respuesta of resE.respuestasContador) {
      if (preguntasId[respuesta.EncuestaPreguntaId] === undefined) {
        preguntas.push({
          id: respuesta.EncuestaPreguntaId, pregunta: respuesta.EncuestaPregunta.pregunta,
          titulo_corto: respuesta.EncuestaPregunta.titulo_corto
        });
        preguntasId[respuesta.EncuestaPreguntaId] = respuesta.EncuestaPreguntaId;
      }
    }
    const dataset = {};
    for (const datasetLabel in this.labels) {
      if (!datasetLabel) {
        continue;
      }
      if (!this.labels[datasetLabel]) {
        continue;
      }
      for (const pregunta of preguntas) {
        if (dataset[pregunta.id] === undefined) {
          dataset[pregunta.id] = [];
        }
        const obj = { label: datasetLabel, valor: null };
        dataset[pregunta.id].push(obj);
        switch (datasetLabel) {
          case 'user':
            const arrU = resE.respuestasUser.filter((el: any) => {
              return el.EncuestaPreguntaId === pregunta.id;
            });
            obj.valor = arrU.reduce((acc, el) => { return acc + parseInt(el.valor, 10) }, 0) / arrU.length || 0;
            break;
          case 'global':
            const arrG = resE.respuestasContador.filter((el: any) => {
              return el.EncuestaPreguntaId === pregunta.id;
            });
            obj.valor = arrG.reduce((acc, el) => { return acc + parseInt(el.valor, 10) }, 0) / arrG.length || 0;
            break;
          default:
            const arrT = resE.respuestasUser.filter((el: any) => {
              return el.EncuestaPreguntaId === pregunta.id && el.Encuestas.Eventos.TipoEvento.nombre === datasetLabel;
            });
            obj.valor = arrT.reduce((acc, el) => { return acc + parseInt(el.valor, 10) }, 0) / arrT.length || 0;
            break;
        }
      }
    }
    this.dataset = dataset;
    this.preguntas = preguntas;
  }

  createSvg() {
    this.svg.append('circle')
      .attr('r', this.innerRadius)
      .classed('inner', true)
      .style('fill', 'none')
      .style('stroke', 'grey')
      .style('stroke-width', '2px');

    const numPreguntas = this.preguntas.length;
    const offsetAngle = (2 * Math.PI) / numPreguntas;
    const offsetAngleGrad = 360 / numPreguntas;

    const lines = this.svg.selectAll('line')
      .data(this.preguntas)
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
    /*
  filter.append('feBlend')
    .attr('in', 'SourceGraphic')
    .attr('in2', 'offsetBlur')
    .attr('mode', 'normal');
    */
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
        const preg = this.preguntas.filter(el => el.id === preguntaIdInt)[0];
        const pregunta = preg.pregunta;
        const titulo = preg.titulo_corto;
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
      .text((d) => d.valor.toFixed(2));
    this.isFirstDrawed = true;
  }

  get stateName() {
    return this.showDiv ? 'show' : 'hide'
  }

  toggle() {
    this.showDiv = !this.showDiv;
  }

  reCreateSvg(label, checked: boolean) {
    if (this.loaded && this.isFirstDrawed) {
      d3.selectAll('g > *').remove();
      this.createSvg();
    }
  }

  dismiss() {
    this.loaded = true;
    return this.utilsService.dismiss();
  }


  rgb2Hex(color) {
    var nums = /(.*?)rgba\((\d+),\s*(\d+),\s*(\d+),\s*\d+\)/i.exec(color),
      r = parseInt(nums[2], 10).toString(16),
      g = parseInt(nums[3], 10).toString(16),
      b = parseInt(nums[4], 10).toString(16);
    return this.rgbToHex2(r, g, b);
  }

  rgbToHex2 = (r, g, b) => '#' + [r, g, b].map(x => {
    const hex = x.toString(16)
    return hex.length === 1 ? '0' + hex : hex
  }).join('');

}
