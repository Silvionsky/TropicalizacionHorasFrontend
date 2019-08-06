import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


import {FormsModule} from '@angular/forms';
import {ProfileComponent} from './profile.component';
import {ProfileRoutingModule} from './profile-routing.module';

@NgModule({
  imports: [
    CommonModule,
    ProfileRoutingModule,
    FormsModule,
  ],
  declarations: [
    ProfileComponent
  ],
  providers: [ ]
})
export class ProfileModule {}