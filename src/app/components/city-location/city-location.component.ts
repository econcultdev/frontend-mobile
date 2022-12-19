import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ApiService } from 'src/app/services/api.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-city-location',
  templateUrl: './city-location.component.html',
  styleUrls: ['./city-location.component.scss'],
})
export class CityLocationComponent implements OnInit {

  cityId: any;
  nameCity = '';
  listCities = [];
  @Output() filterSelectCity = new EventEmitter<Date>();

  constructor(
    private formBuilder: FormBuilder,
    private apiService: ApiService,
    private utilsService: UtilsService) { }

  ngOnInit() {
    this.apiService.getCitiesBusiness().subscribe(items => this.listCities = items ? items : []);
    this.cityId = 246;

  }

  check() {
    
  }

  clickItem(item) {
    this.cityId = item.id;
    console.log('ssss ssss');
  }
  changeAttributesByLanguage(singleValue, multiLanguageValue) {
    return this.utilsService.changeAttributesByLanguage(singleValue, multiLanguageValue);
  }

  changeSelected(country: any) {
    try {

      let nameCity = this.listCities.filter(xx => xx.id == country.detail.value)[0].nombre;

      


      //var booksByStoreID = this.listCities.filter(book => book.id === country.detail.value).map(c => c);
      //console.log(booksByStoreID + ' FDFDDFDFDFDFDFDDF');
      if (country && country.detail && country.detail.value && country.detail.value.id) {
        this.cityId = country.detail.value.id;
        this.nameCity = country.detail.value.nombre;
        console.log('ssss ssss');
      }
    } catch (e) {
    }
  }







}
