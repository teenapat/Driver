import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/authentication/auth.guard';

export const routes: Routes = [
    {
      path: '',
      loadComponent: () => import('./modules/products/products.component').then(m => m.ProductsComponent),
      canActivate: [AuthGuard]
    },
    { path: 'login',
      loadComponent: () => import('./modules/auth/login/login.component').then(m => m.LoginComponent),
    },
    // Other routes...
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
