import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-create-records',
  templateUrl: './create-records.component.html',
  styleUrls: ['./create-records.component.css']
})
export class CreateRecordsComponent implements OnInit {
  insert1={nombre:'', apellido:'', cui:0,email:'', fecharegistro:'', genero:'', institucionbancaria:'', abreviacioninst:'', tipocuenta:'', saldoinicial:0}
  
  insert2={ nombre_1:'', apellido_1:'', cui_1:0, InstitucionBancaria_1:'', tipoCuenta_1:'', saldoinicial_1:0, nombre_2:'', apellido_2:'', cui_2:0,
    InstitucionBancaria_2:'', tipoCuenta_2:'', saldoinicial_2:0,montotransferencia:0, fechatransferencia:new Date(), mes:0, anio:0, fechaRegistro_1:'', fechaRegistro_2:''}

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
  }


  addCliente(){
    this.http.post('http://localhost:3000/bancos',this.insert1)
    .subscribe({
      next: (res)=>{
        let converted = JSON.stringify(res);
        let conv=JSON.parse(converted);
        console.log(conv);
        alert("Cuentahabiente agregado satisfactoriamente!! ");
      }, 
      error: (error) =>{
        console.log(error);
        alert(error);
      }
    });
  }

  addMov(){
    this.insert2.fechatransferencia=new Date();
    this.insert2.mes=this.insert2.fechatransferencia.getMonth()+1;
    this.insert2.anio=this.insert2.fechatransferencia.getFullYear();
    console.log(this.insert2);
    this.http.post('http://localhost:3000/op-client',this.insert2)
    .subscribe({
      next: (res)=>{
        let converted = JSON.stringify(res);
        let conv=JSON.parse(converted);
        console.log(conv);
        alert("Movimiento registrado satisfactoriamente!! ");
      }, 
      error: (error) =>{
        let converted = JSON.stringify(error);
        let conv=JSON.parse(converted);
        console.log(conv.error.result);
        alert(conv.error.result);
      }
    });
  }

}
