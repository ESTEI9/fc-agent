import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { SignaturePadModule } from 'angular2-signaturepad';

import { IonicModule } from '@ionic/angular';

import { CoopPage } from './coop.page';

const routes: Routes = [
  {
    path: '',
    component: CoopPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SignaturePadModule,
    RouterModule.forChild(routes)
  ],
  declarations: [CoopPage]
})
export class CoopPageModule {}
