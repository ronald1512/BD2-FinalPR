import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateRecordsComponent } from './create-records/create-records.component';
import { ReportsComponent } from './reports/reports.component';

const routes: Routes = [
  {path:"", redirectTo:"reports", pathMatch:"full"},
  {path:"reports", component: ReportsComponent},
  {path:"create_records", component: CreateRecordsComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
