import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { IndexGuard } from '../guards/index.guard';
import { UserDataResolver } from '../resolvers/user-data.resolver';

import { MenuTabPage } from './menu-tab.page';

const routes: Routes = [
  {
    path: '',
    component: MenuTabPage,
    canActivate: [IndexGuard],
    resolve: {
      userData: UserDataResolver
    },
    children: [
      {
        path: 'homeapp',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../pages/notifications/notifications.module').then(
                m => m.NotificationsPageModule
              )
          }
        ]
      },
      {
        path: 'messages',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../pages/messages/messages.module').then(
                m => m.MessagesPageModule
              )
          }
        ]
      },
      {
        path: 'notifications',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../pages/notifications/notifications.module').then(
                m => m.NotificationsPageModule
              )
          }
        ]
      },
      {
        path: 'editar-usuario',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../pages/editar-usuario/editar-usuario.module').then(
                m => m.EditarUsuarioPageModule
              )
          }
        ]
      },
      {
        path: '',
        redirectTo: '/app/homeapp',
        pathMatch: 'full'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MenuTabPageRoutingModule {}
