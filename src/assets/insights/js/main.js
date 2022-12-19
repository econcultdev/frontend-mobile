var apiUrl = '//api.aucultur.eu/api/';
var currentExperienceId, currentExperience;

function urlParam() {
var queryString = window.location.search.slice(1);
var obj = {};

if (queryString) {
  queryString = queryString.split('#')[0];
  var arr = queryString.split('&');

  for (var i = 0; i < arr.length; i++) {
    var a = arr[i].split('=');
    var paramName = a[0];
    var paramValue = typeof (a[1]) === 'undefined' ? true : a[1];
    paramName = paramName.toLowerCase();
    if (typeof paramValue === 'string') paramValue = paramValue.toLowerCase();
    if (paramName.match(/\[(\d+)?\]$/)) {
      var key = paramName.replace(/\[(\d+)?\]/, '');
      if (!obj[key]) obj[key] = [];
      if (paramName.match(/\[\d+\]$/)) {
        var index = /\[(\d+)\]/.exec(paramName)[1];
        obj[key][index] = paramValue;
      } else {
        obj[key].push(paramValue);
      }
    } else {
      if (!obj[paramName]) {
        obj[paramName] = paramValue;
      } else if (obj[paramName] && typeof obj[paramName] === 'string'){
        obj[paramName] = [obj[paramName]];
        obj[paramName].push(paramValue);
      } else {
        obj[paramName].push(paramValue);
      }
    }
  }
}

return obj;
}


var siteLang = urlParam().lang;
function auInsightsLoc(name){
  siteLang = (typeof siteLang !== 'undefined') ?  siteLang : (navigator.language || navigator.userLanguage).substr(0, 2);
  var lang = siteLang;
  
  var conversaLanguages =
    {
      "loading": { en: 'Loading', es: 'Cargando', ca: 'Carregant'},
      "experience_menu": { en: 'Change experience', es: 'Cambiar experiencia', ca: 'Canviar experiència'},
      "change_dates": { en: 'Change dates', es: 'Modificar fechas seleccionadas', ca: 'Canviar dates'},
      "start": { en: 'Start:', es: 'Inicio:', ca: 'Inici:'},
      "end": { en: 'End:', es: 'Fin:', ca: 'Fi:'},
      "change": { en: 'Change', es: 'Modificar', ca: 'Modificar'},
      "overall": { en: 'Overall rating', es: 'Valoración general', ca: 'Valoració general'},
      "demographic": { en: 'Demographics', es: 'Demográficos', ca: 'Demogràfics'},
      "age": { en: 'Age', es: 'Edad', ca: 'Edat'},
      "all": { en: 'All', es: 'Cualquiera', ca: 'Qualsevol'},
      "gender": { en: 'Gender', es: 'Género', ca: 'Gènere'},
      "men": { en: 'Men', es: 'Hombres', ca: 'Homes'},
      "women": { en: 'Women', es: 'Mujeres', ca: 'Dones'},
      "other_gender": { en: 'Other genders', es: 'Otros géneros', ca: 'Altres gèneres'},
      "language": { en: 'Language', es: 'Idioma', ca: 'Idioma'},
      "average": { en: 'Average', es: 'Media', ca: 'Mitjana'},
      "days": { en: 'Days', es: 'Días', ca: 'Dies'},
      "chart": { en: 'Chart: ', es: 'Ver: ', ca: 'Gràfic: '},
      "data": { en: 'Data: ', es: 'Datos: ', ca: 'Dades: '},
      "score_global_short": { en: 'Global', es: 'Global', ca: 'Global'},
      "score_social_short": { en: 'Social', es: 'Social', ca: 'Social'},
      "score_emotional_short": { en: 'Emotional', es: 'Emocional', ca: 'Emocional'},
      "score_aesthetic_short": { en: 'Aesthetic', es: 'Estético', ca: 'Estètic'},
      "score_cognitive_short": { en: 'Cognitive', es: 'Cognitivo', ca: 'Cognitiu'},
      "score_global": { en: 'Global Score', es: 'Valoración global', ca: 'Valoració global'},
      "score_cognitive": { en: 'Cognitive Score', es: 'Impacto cognitivo', ca: 'Impacte cognitiu'},
      "score_emotional": { en: 'Emotional Score', es: 'Impacto emocional', ca: 'Impacte emocional'},
      "score_aesthetic": { en: 'Aesthetic Score', es: 'Impacto estético', ca: 'Impacte estètic'},
      "score_social": { en: 'Social Score', es: 'Impacto social', ca: 'Impacte social'},
      "venue_avg": { en: 'Venue Average', es: 'Media del espacio', ca: 'Mitjana de l\'espai'},
      "category_avg": { en: 'Category Average', es: 'Media de la categoría', ca: 'Mitjana de la categoria'},
      "date_error": { en: 'The end date must be later than the start date', es: 'La fecha final debe ser posterior a la fecha de inicio', ca: 'La data final ha de ser posterior a la data d\'inici'},
      "no_data": { en: 'No data found', es: 'No se han encontrado datos', ca: 'No s\'han trobat dades'},
      "max_price": { en: 'Maximum user price', es: 'Precio máximo usuario', ca: 'Preu màxim usuaris'},
      "max_price_avg": { en: 'Maximum price avg.:', es: 'Precio máx. medio:', ca: 'Preu màxim mitjà:'},
      "reviews": { en: 'Reviews', es: 'Reseñas', ca: 'Ressenyes'},
      "about": { en: 'About Aucultur', es: 'Sobre Aucultur', ca: 'Sobre Aucultur'},
      "legal": { en: 'Legal note', es: 'Aviso legal', ca: 'Avís legal'},
      "cookies": { en: 'Cookies policy', es: 'Política de cookies', ca: 'Política de cookies'},
      "next": { en: 'Next', es: 'Siguiente', ca: 'Següent'},
      "prev": { en: 'Previous', es: 'Anterior', ca: 'Anterior'},
      "yes": { en: 'Yes', es: 'S&iacute;', ca: 'S&iacute;'},
      "no": { en: 'No'},
      "today": { en: 'Today', es: 'Hoy', ca: 'Hui'},
      "Jan": {es: 'Ene', ca: 'Gen'},
      "Feb": {es: 'Feb', ca: 'Feb'},
      "Mar": {es: 'Mar', ca: 'Mar'},
      "Apr": {es: 'Abr', ca: 'Abr'},
      "Jun": {es: 'Jun', ca: 'Jun'},
      "Jul": {es: 'Jul', ca: 'Jul'},
      "Aug": {es: 'Ago', ca: 'Ago'},
      "Sep": {es: 'Sep', ca: 'Set'},
      "Oct": {es: 'Oct', ca: 'Oct'},
      "Nov": {es: 'Nov', ca: 'Nov'},
      "Dec": {es: 'Dic', ca: 'Des'},
      "January": {es: 'Enero', ca: 'Gener'},
      "February": {es: 'Febrero', ca: 'Febrer'},
      "March": {es: 'Marzo', ca: 'Març'},
      "April": {es: 'Abril', ca: 'Abril'},
      "May": {es: 'Mayo', ca: 'Maig'},
      "June": {es: 'Junio', ca: 'Juny'},
      "July": {es: 'Julio', ca: 'Juliol'},
      "August": {es: 'Agosto', ca: 'Agost'},
      "September": {es: 'Septiembre', ca: 'Setembre'},
      "October": {es: 'Octubre', ca: 'Octubre'},
      "November": {es: 'Noviembre', ca: 'Novembre'},
      "December": {es: 'Diciembre', ca: 'Desembre'},
    };
    
  if(conversaLanguages[name] !== undefined){
    if(conversaLanguages[name][lang] !== undefined){
      return conversaLanguages[name][lang];
    } else if (conversaLanguages[name].en !== undefined){
      return conversaLanguages[name].en;
    } else {
      return name;
    }
  } else {
    return name;
  }
}

function localizeDom(){
  var toLocalize = document.querySelectorAll('[data-locale]');
  toLocalize.forEach( function(element){
    element.innerHTML = auInsightsLoc(element.dataset.locale);
  });
}

const scores = ['global','cognitive','emotional','aesthetic','social'];
const scoreLabels = [auInsightsLoc('score_global'),auInsightsLoc('score_cognitive'),auInsightsLoc('score_emotional'),auInsightsLoc('score_aesthetic'),auInsightsLoc('score_social')];
const colors = ['97, 181, 135','184, 172, 149','149, 170, 184','174, 149, 184','184, 149, 162','182, 184, 149'];

function initSubmenus(){
  
  if(document.querySelector('.submenu-toggle') === null){
    return;
  }
  
  var subMenuButtons = document.querySelectorAll(".submenu-toggle");
  var subMenus = document.querySelectorAll(".submenu-container");
  subMenuButtons.forEach( function(subMenuButton){
      subMenuButton.onclick = function(e) {
          e.preventDefault();
          subMenus.forEach( function(subMenu){
            if(subMenu != subMenuButton.parentElement){
              subMenu.classList.remove("active");
            }
          });
          subMenuButton.parentElement.classList.toggle("active");
      };
  });
  
}

function loadJSON(endpoint,callback) {
  var xobj = new XMLHttpRequest();
  xobj.overrideMimeType("application/json");
  xobj.open('GET', apiUrl+endpoint, true);
  xobj.onreadystatechange = function () {
        if (xobj.readyState == 4 && xobj.status == "200") {
          callback(JSON.parse(xobj.responseText));
        }
  };
  xobj.send(null);
}

function formatDate(date){
  return date.split(" ")[0].split("-").reverse().join("/");
}

function jsDate(date) {
  let parts = date.split("-");
  return new Date(parts[0]- 1, parts[1]-1, parts[2]);
}

function loadExperience(id,date_start,date_end){
  
  date_start = (typeof date_start !== 'undefined') ?  date_start : false;
  date_end = (typeof date_end !== 'undefined') ?  date_end : false;
  
  let endpoint = 'dashboard-event-range?EventoId='+id;
  
  
  loadJSON(endpoint, function(experience){
    console.log(experience);
    currentExperienceId = id;
    currentExperience = experience;
    
    if(experience.venue == undefined){
      document.querySelector('.venue-name').innerHTML = 'Insights';
    } else {
      document.querySelector('.venue-name').innerHTML = experience.venue;
    }
    
    // Set name
    document.querySelector('.experience-name').innerHTML = experience.name.en;
    
    // Set datepicker
    experience.date_start = experience.date_start.slice(0, 10);
    experience.date_end = experience.date_end.slice(0, 10);
    let datepickers = document.querySelectorAll('.datepicker-selector input');
    date_start = (date_start !== false) ?  date_start : experience.date_start;
    date_end = (date_end !== false) ?  date_end : experience.date_end;
    datepickers.forEach(function(datepicker){
      datepicker.setAttribute('min',experience.date_start);
      datepicker.setAttribute('max',experience.date_end);
      switch(datepicker.getAttribute('name')){
        case 'date-start':
          datepicker.value = date_start;
          datepicker.dataset.date_start = date_start;
          break;
        case 'date-end':
          datepicker.value = date_end;
          datepicker.dataset.date_end = date_end;
          break;
      }
    });
    let dateLabel = formatDate(date_start);
    if(date_start!=date_end){ dateLabel = formatDate(date_start)+' - '+formatDate(date_end);}
    document.querySelector('.datepicker .date-range').innerHTML = dateLabel;
    
    
    let endpointDates = 'dashboard-event-range?EventoId='+id+'&&date_start='+experience.date_start+'&date_end='+experience.date_end;
    if(date_start && date_end){
      endpointDates = 'dashboard-event-range?EventoId='+id+'&&date_start='+date_start+'&date_end='+date_end;
    }
    
    loadJSON(endpointDates, function(experienceDates){
      
      currentExperience = experienceDates;
      experience = experienceDates;
      
      // Precio max
      let priceAvgCont = document.querySelector('.block-score-price .big-number');
      if(experience.score_price){
        priceAvgCont.innerHTML = experience.score_price+' &euro;';
      } else {
        priceAvgCont.innerHTML = 'N/A';
      }
      renderPriceChart();
      
      // Global chart
      globalChartData();
      
      // Reviews
      
      let reviewsCont = document.querySelector('.block-reviews .text-space');
      reviewsCont.innerHTML = "";
      
      if(experience.dates && experience.dates.length > 0){
        
        experience.dates.forEach( function(reviewDate){
          reviewDate = reviewDate.date;
          let endpointDate = 'dashboard-event-date?EventoId='+id+'&&date_start='+reviewDate+'&date_end='+reviewDate;
          loadJSON(endpointDate, function(experienceReviews){
            experienceReviews.forEach( function(review){
              if(review.review){
                let reviewElement = document.createElement('div');
                reviewElement.classList.add('review');
                let reviewData = document.createElement('div');
                reviewData.classList.add('data');
                reviewData.innerHTML = formatDate(reviewDate);
                reviewElement.appendChild(reviewData);
                let reviewText = document.createElement('p');
                reviewText.innerHTML = review.review;
                reviewElement.appendChild(reviewText);
                reviewsCont.appendChild(reviewElement);
              }
            });
          });
        });
        
      }
    });
    
    
  });
}

function datepickerInit(){
  var datepickerButton = document.querySelector('.datepicker-change-date');
  datepickerButton.onclick = function(e) {
    e.preventDefault();
    let datepickers = document.querySelectorAll('.datepicker-selector input');
    let newDateStart, newDateEnd;
    datepickers.forEach(function(datepicker){
      switch(datepicker.getAttribute('name')){
        case 'date-start':
          newDateStart = datepicker.value;
          break;
        case 'date-end':
          newDateEnd = datepicker.value;
          break;
      }
    });
    
    if(jsDate(newDateEnd) < jsDate(newDateStart)){
      
      // Go to previous date
      datepickers.forEach(function(datepicker){
        switch(datepicker.getAttribute('name')){
          case 'date-start':
            datepicker.value = datepicker.dataset.date_start;
            break;
          case 'date-end':
            datepicker.value = datepicker.dataset.date_end;
            break;
        }
      });
      
      return alert(auInsightsLoc('date_error'));
      
    }
    
    loadExperience(currentExperienceId,newDateStart,newDateEnd);
    document.querySelector('.datepicker').classList.remove('active');
    
  };
}

function intGlobalChartOptions(){
  let chartOptions = document.querySelectorAll('.block-global-score .chart-options input');
  chartOptions.forEach(function(option){
    option.addEventListener("change",globalChartData);
  });
}

function globalChartData(){
  let chartOptions = document.querySelectorAll('.block-global-score .chart-options input[type="checkbox"]');
  let dataOptions = [];
  let labels = [];
  let datasets = [];
  let type = 'radar';
  let typeOption = document.querySelector('.block-global-score .chart-options input[type="radio"]:checked');
  if(typeOption !== null){
    type = typeOption.value;
  }
  
  if(type == 'radar'){
  
    datasets = [{label: currentExperience.name.en,
                data: [],
                borderColor: 'rgb(62, 214, 192, 1)',
                backgroundColor: 'rgba(62, 214, 192,0.3)'},
                
                {label: auInsightsLoc('venue_avg'),
                data: [],
                borderColor: 'rgb(134, 119, 153)',
                backgroundColor: 'rgba(134, 119, 153,0.2)'},
                
                {label: auInsightsLoc('category_avg'),
                data: [],
                borderColor: 'rgb(184, 172, 149)',
                backgroundColor: 'rgba(184, 172, 149,0.2)'},
                
    ];
  }
  
  if(type == 'bar'){
    datasets.push({name: 'average_score', label: auInsightsLoc('average'), data: [], type: 'line', borderColor: 'rgba(2,2,2,0.2)', backgroundColor: 'rgba(2,2,2,0.4)'});
  }
  
  chartOptions.forEach(function(option){
    if(option.checked && scores.includes(option.getAttribute('name'))){
      let scoreName = option.getAttribute('name');
      let scoreIndx = scores.indexOf(scoreName);
      let scoreDataName;
      
      if(type == 'radar'){
        labels.push(scoreLabels[scoreIndx]);
        scoreDataName = 'score_'+scoreName;
        datasets[0].data.push(currentExperience[scoreDataName]);
        scoreDataName = 'venue_'+scoreName;
        datasets[1].data.push(currentExperience[scoreDataName]);
        scoreDataName = 'category_'+scoreName;
        datasets[2].data.push(currentExperience[scoreDataName]);
      }
      
      if(type == 'bar'){
        datasets.push({name: 'score_'+scoreName, label: scoreLabels[scoreIndx], data: [], borderColor: 'rgba('+colors[scoreIndx]+',1)', backgroundColor: 'rgba('+colors[scoreIndx]+',0.4)'});
      }
      
    }
  });
  
  if(type == 'bar'){
    currentExperience.dates.forEach( function(date){
      let dateScoresSum = 0;
      let dateScoresN = 0;
      labels.push(formatDate(date.date));
      datasets.forEach( function(dataset,datasetIndex){
        if(date[dataset.name] !== undefined){
          datasets[datasetIndex].data.push(date[dataset.name]);
          dateScoresN++; dateScoresSum=dateScoresSum+date[dataset.name];
        }
      });
      let averageDateScore = dateScoresSum/dateScoresN;
      datasets[0].data.push(averageDateScore);
    });
  }
  
  if(type == 'radar' && labels.length < 3){
    type = 'bar';
  }
  
  console.log(labels);
  console.log(datasets);
  
  if(globalChart !== undefined && globalChart.type == type){
    globalChart.data.labels = labels;
    globalChart.data.datasets = datasets;
    globalChart.update();
    return;
  }
  renderGlobalChart(labels,datasets,type);
  
}

var globalChart;
function renderGlobalChart(labels,datasets,type){
  let chartCanvas = document.getElementById('global-average-chart');
  
  if(globalChart !== undefined){
      globalChart.destroy();
  } else {
    chartCanvas = document.createElement('canvas');
    chartCanvas.setAttribute('id','global-average-chart');
    document.querySelector('.block-global-score .chart-container').appendChild(chartCanvas);
  }
  
  let scales = {r: {min: 0, max: 10}};
  if(type == 'bar'){
    scales = {x: {min: 0, max: 10}};
  }
  
  globalChart = new Chart(chartCanvas, {
    type: type,
    data: {
      labels: labels,
      datasets: datasets
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: scales,
      elements: {bar: {borderWidth: 2,}}
    }
  });
  
  resizeCharts();
}


var priceChart;
function renderPriceChart(){
  let chartCanvas = document.getElementById('score-price-chart');

  let labels = [];
  let dataset = {data:[],borderColor:colors[0]};
  
  currentExperience.dates.forEach( function(date){
      labels.push(formatDate(date.date));
      if(date.score_price !== undefined){
        dataset.data.push(date.score_price);
      } else {
        dataset.data.push(0);
      }
  });
  
  if(priceChart !== undefined){
      priceChart.data.labels = labels;
      priceChart.data.datasets = [dataset];
      priceChart.update();
      return;
  } else {
    chartCanvas = document.createElement('canvas');
    chartCanvas.setAttribute('id','score-price-chart');
    document.querySelector('.block-score-price .chart-container').appendChild(chartCanvas);
  }
  
  
  priceChart = new Chart(chartCanvas, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [dataset]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {y: {min: 0}},
      plugins: {legend: {display: false}},
    }
  });
  
  resizeCharts();
}

function resizeCharts(){
  let charts = document.querySelectorAll('.chart-container');
  charts.forEach( function(chartContainer){
    chartContainer.style.height = "";
    chartContainer.style.width  = "";
    let height = chartContainer.parentElement.offsetHeight-40;
    let width = chartContainer.parentElement.offsetWidth-40;
    chartContainer.style.height = height+'px';
    chartContainer.style.width  = width+'px';
  });
}

window.addEventListener('resize', resizeCharts);

function init(){
  localizeDom();
  initSubmenus();
  datepickerInit();
  intGlobalChartOptions();
  loadExperience(urlParam().id);
}

document.addEventListener( 'DOMContentLoaded', function() {
  init();
});