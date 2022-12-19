import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../guards/auth.guard';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: 'app',
    component: TabsPage,
    children: [
      {
        path: 'homeapp',
        loadChildren: () => import('../pages/homeapp/homeapp.module').then( m => m.HomeappPageModule)
      },
      {
        path: 'search-events',
        loadChildren: () => import('../pages/search-events/search-events.module').then(m => m.SearchEventsPageModule)
      },
      {
        path: 'messages',
        loadChildren: () => import('../pages/messages/messages.module').then(m => m.MessagesPageModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'saved-events',
        loadChildren: () => import('../pages/saved-events/saved-events.module').then(m => m.SavedEventsPageModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'editar-usuario',
        loadChildren: () => import('../pages/editar-usuario/editar-usuario.module').then(m => m.EditarUsuarioPageModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'encuesta/:id',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../pages/encuesta/encuesta.module').then(m => m.EncuestaPageModule),
            canActivate: [AuthGuard]
          }
        ]
      },
      {
        path: 'encuesta/:id/:pregunta',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../pages/encuesta/encuesta.module').then(m => m.EncuestaPageModule),
            canActivate: [AuthGuard]
          }
        ]
      },
      {
        path: 'resultado-encuesta/:id',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../pages/resultado-encuesta/resultado-encuesta.module').then(m => m.ResultadoEncuestaPageModule),
            canActivate: [AuthGuard]
          }
        ]
      },
      {
        path: 'encuestas-realizadas',
        loadChildren: () =>
          import('../pages/encuestas-realizadas/encuestas-realizadas.module').then(m => m.EncuestasRealizadasPageModule),
        canActivate: [AuthGuard]
      },  
      {
        path: 'cultotipo',
        loadChildren: () =>
          import('../pages/cultotipo/cultotipo.module').then(m => m.CultotipoPageModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'resultados-globales',
        loadChildren: () =>
          import('../pages/resultados-globales/resultados-globales.module').then(m => m.ResultadosGlobalesPageModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'resultados-busqueda/:query',
        loadChildren: () =>
          import('../pages/resultados-busqueda/resultados-busqueda.module').then(m => m.ResultadosBusquedaPageModule),
        canActivate: [AuthGuard]
      },
      {
        path: '',
        redirectTo: '/app/homeapp',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/app/homeapp',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class TabsPageRoutingModule { }
