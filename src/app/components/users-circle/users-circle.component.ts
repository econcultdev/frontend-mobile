import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-users-circle',
  templateUrl: './users-circle.component.html',
  styleUrls: ['./users-circle.component.scss'],
})
export class UsersCircleComponent implements OnInit {

  
  constructor(
    private router: Router,
  ) { }
  photo;
  @Input() photoProfileUser;

  navigate(): void {
    this.router.navigate(['/editar-usuario'])
  }

  
  ngOnInit() {
    this.photo = sessionStorage.getItem('imagen');
  }
  ionViewWillEnter() {
    
  }

}
