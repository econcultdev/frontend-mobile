import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule)
  },
  { path: 'login', loadChildren: './auth/login/login.module#LoginPageModule' },
  { path: 'register', loadChildren: './auth/register-minify/register-minify.module#RegisterMinifyPageModule' },
  { path: 'register-1', loadChildren: './auth/register/register.module#RegisterPageModule' },
  {
    path: 'bienvenida', loadChildren: './pages/bienvenida/bienvenida.module#BienvenidaPageModule',
    canActivate: [AuthGuard]
  },
  {
    path: 'encuesta-personal', loadChildren: './pages/encuesta-personal/encuesta-personal.module#EncuestaPersonalPageModule',
    canActivate: [AuthGuard]
  },
  { path: 'activate', loadChildren: './auth/activate/activate.module#ActivatePageModule' },
  { path: 'modify-password', loadChildren: './auth/modify-password/modify-password.module#ModifyPasswordPageModule' },
  {
    path: 'encuestas-realizadas', loadChildren: './pages/encuestas-realizadas/encuestas-realizadas.module#EncuestasRealizadasPageModule',
    canActivate: [AuthGuard]
  },
  {
    path: 'editar-usuario', loadChildren: './pages/editar-usuario/editar-usuario.module#EditarUsuarioPageModule',
    canActivate: [AuthGuard]
  },
  {
    path: 'datos-personales', loadChildren: './pages/datos-personales/datos-personales.module#DatosPersonalesPageModule',
    canActivate: [AuthGuard]
  },
  {
    path: 'bonos-disponibles', loadChildren: './pages/bonos-disponibles/bonos-disponibles.module#BonosDisponiblesPageModule',
    canActivate: [AuthGuard]
  },
  {
    path: 'cultotipo', loadChildren: './pages/cultotipo/cultotipo.module#CultotipoPageModule',
    canActivate: [AuthGuard]
  },
  {
    path: 'encuesta', loadChildren: './pages/encuesta/encuesta.module#EncuestaPageModule',
    canActivate: [AuthGuard]
  },
  {
    path: 'ficha-usuario', loadChildren: './pages/ficha-usuario/ficha-usuario.module#FichaUsuarioPageModule',
    canActivate: [AuthGuard]
  },
  {
    path: 'qr', loadChildren: './pages/qr/qr.module#QrPageModule',
    canActivate: [AuthGuard]
  },
  {
    path: 'resultado-encuesta', loadChildren: './pages/resultado-encuesta/resultado-encuesta.module#ResultadoEncuestaPageModule',
    canActivate: [AuthGuard]
  },
  {
    path: 'resultados-busqueda', loadChildren: './pages/resultados-busqueda/resultados-busqueda.module#ResultadosBusquedaPageModule',
    canActivate: [AuthGuard]
  },
  {
    path: 'resultados-globales', loadChildren: './pages/resultados-globales/resultados-globales.module#ResultadosGlobalesPageModule',
    canActivate: [AuthGuard]
  },
  {
    path: 'home1', loadChildren: './pages/dashboard/dashboard.module#DashboardPageModule'
  },

  //{ path: 'homeapp',  loadChildren: () => import('./pages/homeapp/homeapp.module').then( m => m.HomeappPageModule)},
  {
    path: 'event-detail',
    loadChildren: () => import('./pages/event-detail/event-detail.module').then(m => m.EventDetailPageModule)
  },
  {
    path: 'menu-tab',
    loadChildren: () => import('./menu-tab/menu-tab.module').then(m => m.MenuTabPageModule)
  },
  {
    path: 'messages',
    loadChildren: () => import('./pages/messages/messages.module').then(m => m.MessagesPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'message-chat',
    loadChildren: () => import('./pages/message-chat/message-chat.module').then(m => m.MessageChatPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: "homeapp/:eventId",
    loadChildren: () => import('./pages/event-detail/event-detail.module').then(m => m.EventDetailPageModule),
    //canActivate: [AuthGuard]
  },
  {
    path: 'event-search',
    loadChildren: () => import('./pages/event-search/event-search.module').then( m => m.EventSearchPageModule)
  },
  {
    path: 'list-experience-evaluate/:businessId',
    loadChildren: () => import('./pages/list-experience-evaluate/list-experience-evaluate.module').then( m => m.ListExperienceEvaluatePageModule)
  },

  //{ path: '**', component: PageNotFoundComponent },###
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
