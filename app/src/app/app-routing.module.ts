import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AgentGuard } from '../app/guards/agent.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  { path: 'login', loadChildren: './pages/login/login.module#LoginPageModule' },
  { path: 'coop', loadChildren: './pages/signup/coop/coop.module#CoopPageModule', canActivate: [AgentGuard] },
  { path: 'home', loadChildren: './pages/home/home.module#HomePageModule', canActivate: [AgentGuard] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  providers: [AgentGuard],
  exports: [RouterModule]
})
export class AppRoutingModule {}
