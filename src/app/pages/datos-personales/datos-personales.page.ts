import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { UtilsService } from 'src/app/services/utils.service';
import { ACompleteService } from 'src/app/services/autocomplete.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-datos-personales',
  templateUrl: './datos-personales.page.html',
  styleUrls: ['./datos-personales.page.scss'],
  providers: [ACompleteService]
})
export class DatosPersonalesPage implements OnInit {

  datosPersonalesForm: FormGroup;
  loaded = false;
  fechaNacimiento = new Date().toISOString();
  maxDate = new Date().toISOString();
  minDate = new Date('1900-01-01').toISOString();
  sexo = 'M';
  userId = parseInt(sessionStorage.getItem('userId'), 10);
  /*paisId = 0;
  pais = '';
  provinciaId = 0;
  provincia = '';
  ciudadId = 0;
  ciudad = '';

  countries: any[] = [];
  provinces: any[] = [];
  provincesCountry: any[] = [];
  cities: any[] = [];
  citiesProvince: any[] = [];*/

  constructor(
    private formBuilder: FormBuilder,
    private apiService: ApiService,
    private utilsService: UtilsService,
    private router: Router,
    public aCompleteService: ACompleteService) {

  }

  ngOnInit(): void {
    this.datosPersonalesForm = this.formBuilder.group({
      fechaNacimiento: [null, Validators.required],
      sexo: [null, Validators.required],
    });
    /*this.aCompleteService.setData('paises', 0, '');
    this.apiService.getCountries().subscribe(countries => this.countries = countries ? countries : []);
    this.apiService.getProvinces().subscribe(provinces => this.provinces = provinces ? provinces : []);
    this.apiService.getCities().subscribe(cities => this.cities = cities ? cities : []);*/
  }

  ionViewWillLeave() {
    return this.utilsService.dismiss();
  }

  ionViewWillEnter() {
    this.userId = parseInt(sessionStorage.getItem('userId'), 10);
    this.loaded = true;
    this.fechaNacimiento = new Date().toISOString();
    this.maxDate = new Date().toISOString();
    this.sexo = 'M';
    /*this.paisId = 0;
    this.pais = '';
    this.provinciaId = 0;
    this.provincia = '';
    this.ciudadId = 0;
    this.ciudad = '';*/

    this.utilsService.presentLoadingWithOptions().then(() => {
      this.apiService.getSexoEdad(this.userId)
        .subscribe((res) => {
          if (res && !res.status) {
            this.dismiss().then(() => {
              this.sexo = res.sexo;
              this.fechaNacimiento = res.fecha_nacimiento;
              /*this.paisId = res.paisId || 0;
              this.pais = res.pais || '';
              this.provinciaId = res.provinciaId || 0;
              this.provincia = res.provincia || '';
              this.ciudadId = res.ciudadId || 0;
              this.ciudad = res.ciudad || '';*/

              this.datosPersonalesForm = this.formBuilder.group({
                fechaNacimiento: [this.fechaNacimiento, Validators.required],
                sexo: [this.sexo, Validators.required],
                //pais: [this.pais, Validators.required],
                //provincia: [this.provincia, Validators.required],
                //ciudad: [this.ciudad, Validators.required]
              });
            });
          } else {
            this.dismiss();
          }
        }, (err) => {
          this.dismiss();
          console.error(err);
          this.utilsService.presentToastLanguage('DATOS_PERSONALES_TS.SERVER_ERROR');
        });
    });
  }

  onFormSubmit(form: any) {
    if (form.fechaNacimiento && form.sexo) {
      this.utilsService.presentLoadingWithOptions().then(() => {
        const obj = {
          id: this.userId, sexo: form.sexo, fecha_nacimiento: form.fechaNacimiento,
          //PaisId: this.paisId, ProvinciaId: this.provinciaId,
          //CiudadId: this.ciudadId
        };
        this.apiService.actualizarDatosPersonales(obj)
          .subscribe((res) => {
            if (res && !res.status) {
              this.apiService.cultoTipoBorrarRespuestaUser(this.userId)
                .subscribe((resB) => {
                  if (resB !== undefined && !resB.status) {
                    this.dismiss().then(() => {
                      this.router.navigate(['encuesta-personal']);
                    });
                  } else {
                    this.dismiss();
                    this.utilsService.presentToastLanguage('DATOS_PERSONALES_TS.SERVER_ERROR');
                  }
                }, (err) => {
                  this.dismiss();
                  console.error(err);
                  this.utilsService.presentToastLanguage('DATOS_PERSONALES_TS.SERVER_ERROR');
                });
            } else {
              this.dismiss();
              this.utilsService.presentToastLanguage('DATOS_PERSONALES_TS.SERVER_ERROR');
            }
          }, (err) => {
            this.dismiss();
            console.error(err);
            this.utilsService.presentToastLanguage('DATOS_PERSONALES_TS.SERVER_ERROR');
          });
      });
    } else {
      this.utilsService.presentToastLanguage('DATOS_PERSONALES_TS.DATA_ERROR');
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
   * Change contry and set provinces from this country
   * @param country Country
   */
  /*
  changeCountrySelected(country: any) {
    this.provincesCountry = [];
    if (country && country.detail && country.detail.value && country.detail.value.id) {
      this.paisId = country.detail.value.id;
      this.pais = country.detail.value.nombre;
      this.provincesCountry = this.provinces
        .filter(pr => pr.PaisId === this.paisId)
        .sort(function (a, b) {
          let nameA = a.nombre.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
          let nameB = b.nombre.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
          if (nameA === nameB) {
            return 0;
          }
          return nameA > nameB ? 1 : -1;
        });;
    }
  }*/

  /**
   * Change province and set cities from this province
   * @param province Province
   */
  /*
  changeProvinceSelected(province: any) {
    this.citiesProvince = [];
    if (province && province.detail && province.detail.value && province.detail.value.id) {
      this.provinciaId = province.detail.value.id;
      this.provincia = province.detail.value.nombre;
      this.citiesProvince = this.cities
        .filter(pr => pr.ProvinciaId === this.provinciaId)
        .sort(function (a, b) {
          let nameA = a.nombre.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
          let nameB = b.nombre.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
          if (nameA === nameB) {
            return 0;
          }
          return nameA > nameB ? 1 : -1;
        });
    }
  }*/

  /**
   * Change city selected
   * @param city City
   */
  /*
  changeCitySelected(city: any) {
    if (city && city.detail && city.detail.value && city.detail.value.id) {
      this.ciudadId = city.detail.value.id;
      this.ciudad = city.detail.value.nombre;
    }
  }*/

}
