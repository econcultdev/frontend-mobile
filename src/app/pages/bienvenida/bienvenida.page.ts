import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-bienvenida',
  templateUrl: './bienvenida.page.html',
  styleUrls: ['./bienvenida.page.scss'],
})
export class BienvenidaPage implements OnInit {

  username = sessionStorage.getItem('userName');
  name = sessionStorage.getItem('name') || this.username;

  constructor(private router: Router) { }

  ngOnInit() {
  }

   
}
