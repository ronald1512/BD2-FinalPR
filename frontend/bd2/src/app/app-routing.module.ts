import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateRecordsComponent } from './create-records/create-records.component';
import { FailsComponent } from './fails/fails.component';
import { ReportsComponent } from './reports/reports.component';

const routes: Routes = [
  {path:"", redirectTo:"reports", pathMatch:"full"},
  {path:"reports", component: ReportsComponent},
  {path:"create_records", component: CreateRecordsComponent},
  {path:"fails", component: FailsComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
