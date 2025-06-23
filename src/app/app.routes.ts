import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '',
    pathMatch: 'full',
  },
  {
    path: 'folder/:id',
    loadComponent: () =>
      import('./folder/folder.page').then((m) => m.FolderPage),
  },
  {
    path: 'cms/user-invite',
    loadComponent: () => import('./user-invite/user-invite.page').then( m => m.UserInvitePage)
  },
  // {
  //   path: ':id',
  //   loadComponent: () => import('./home/home.page').then( m => m.HomePage)
  // },
  {
    path: '',
    loadComponent: () => import('./home/home.page').then( m => m.HomePage)
  }
];
