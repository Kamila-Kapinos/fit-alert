/* eslint-disable @typescript-eslint/semi */
/* eslint-disable @typescript-eslint/object-curly-spacing */
/* eslint-disable @typescript-eslint/consistent-type-imports */
/* eslint-disable @typescript-eslint/indent */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/promise-function-async */
import { Routes } from '@angular/router';
import { FooterComponent } from './common-components/components/footer/footer.component';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./common-components/common-components.module').then(m => m.CommonComponentsModule)
  },
    {path: 'footer', component: FooterComponent}
];
