import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ActionsComponent } from './actions/actions.component';
import { AuthComponent } from './auth/auth.component';
import { AuthGuard } from './auth/auth.guard';
import { HomeComponent } from './home/home.component';
import { WardViewComponent } from './actions/ward-view/ward-view.component';
import { UpdateActionComponent } from './actions/ward-view/update-action/update-action.component';

const routes: Routes = [
  { path: '', component: HomeComponent, pathMatch: 'full' },
  { path: 'actions', component: ActionsComponent },
  { path: 'auth', component: AuthComponent },
  { path: 'ward-view', component: WardViewComponent, canActivate: [AuthGuard] },
  { path: 'ward-view/:id', component: UpdateActionComponent },
  // { path: '*', redirectTo:''}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
