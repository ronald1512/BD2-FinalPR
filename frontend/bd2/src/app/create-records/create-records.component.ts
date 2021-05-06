import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-create-records',
  templateUrl: './create-records.component.html',
  styleUrls: ['./create-records.component.css']
})
export class CreateRecordsComponent implements OnInit {
  insert1={nombre:'', apellido:'', cui:0,email:'', fecharegistro:'', genero:'', institucionbancaria:'', abreviacioninst:'', tipocuenta:'', saldoinicial:0}
  
  constructor() { }

  ngOnInit(): void {
  }

}
