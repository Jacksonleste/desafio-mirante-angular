import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'outros-creditos-debitos',
    pathMatch: 'full',
  },
  {
    path: 'outros-creditos-debitos',
    title: 'Outros Créditos/Débitos',
    loadComponent: () =>
      import('./features/outros-creditos-debitos/pages/consulta-lotes/consulta-lotes.component').then(
        (m) => m.ConsultaLotesComponent,
      ),
  },
];
