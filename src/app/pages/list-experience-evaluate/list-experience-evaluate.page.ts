import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-list-experience-evaluate',
  templateUrl: './list-experience-evaluate.page.html',
  styleUrls: ['./list-experience-evaluate.page.scss'],
})
export class ListExperienceEvaluatePage implements OnInit {
  experienceEvaluate: any[] = [];
  businessId;
  idSelectSchedule;
  checked = false;
  date_EvaluateEvent= new Date();
  verifylogin = false;//sessionStorage.getItem('verifylogin');
  minDate = new Date(this.date_EvaluateEvent.getFullYear() -1, this.date_EvaluateEvent.getMonth(), this.date_EvaluateEvent.getDay());
  maxDate = new Date(this.minDate.getFullYear() + 2, this.minDate.getMonth(), this.minDate.getDay());
  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private apiService: ApiService,
    private authService: AuthService,
    private navController: NavController,
    private utilsService: UtilsService,
  ) { }

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe(paramMap => {
      if (!paramMap.has("businessId")) {
        //this.router.navigate(['/']);
      }
      this.businessId = paramMap.get("businessId");
    });
    this.searchData(this.businessId);
  }

  dismiss() {
    //this.loaded = true;
    return this.utilsService.dismiss();
  }

  changeAttributesByLanguage(singleValue, multiLanguageValue) {
    return this.utilsService.changeAttributesByLanguage(singleValue, multiLanguageValue);
  }
  searchData(businessId: number) {
    this.apiService.getListExperienceEvaluate(businessId).subscribe(items => this.experienceEvaluate = items ? items : []);
  }

  evaluateEvent(id) {
    if (this.authService.whoAmI()) {
      this.navController.navigateRoot('/app/encuesta/' + id);
    } else {
      sessionStorage.setItem('encuestaid', id);
      this.navController.navigateRoot('/login');
    }
  }

  onClickEvaluateEvent(id?: any, typeValue?: 'int' | undefined) {

  }

  changeDate(obj){
    //time now for parameter
    this.date_EvaluateEvent = obj;
  }


}