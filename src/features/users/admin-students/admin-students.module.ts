import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StudentsListComponent } from './components/students-list/students-list.component';
import { StudentProfileComponent } from './components/student-profile/student-profile.component';
import { StoreModule } from '@ngrx/store';
import * as fromStudent from './state/student.reducer';
import { EffectsModule } from '@ngrx/effects';
import { StudentEffects } from './state/student.effects';
import {AdminStudentsService} from './admin-students.service';
import {CustomMaterialModule} from '../../../app/material.module';
import {UserRoutingModule} from '../user-routing.module';
import {ReactiveFormsModule} from '@angular/forms';
import { StudentProjectsEditComponent } from '../../projects/components/student-projects-edit/student-projects-edit.component';



@NgModule({
  declarations: [StudentsListComponent, StudentProfileComponent],
  imports: [
    CommonModule,
    CustomMaterialModule,
    UserRoutingModule,
    ReactiveFormsModule,
    StoreModule.forFeature(fromStudent.studentFeatureKey, fromStudent.reducer),
    EffectsModule.forFeature([StudentEffects])
  ],
  exports: [
    StudentsListComponent
  ],
  providers: [
    AdminStudentsService
  ]
})
export class AdminStudentsModule { }
