import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent implements OnInit {
  report1={nombre_1:"Alfie", apellido_1:"Castellaccio", cui_1:2344960856, result:[]}
  report2={institucionbancaria:"Banco Promerica", total_debitos:0, total_creditos:0}
  report3={institucionbancaria:'Banco Promerica', result:[]}
  report4={result:[]}
  report5={nombre_1:"Alfie", apellido_1:"Castellaccio", cui_1:2344960856, mes:3, anio:2021, result:[]}
  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.Reporte1();
    this.Reporte2();
    this.Reporte3();
    this.Reporte4();
    this.Reporte5();
  }


  async Reporte1(){
    /*const data = await this.http.put('http://localhost:3000/op-client',this.report1).toPromise();
    let arreglo = JSON.stringify(data);
    let array = JSON.parse(arreglo);
    console.log(array;*/

    this.http.put('http://localhost:3000/op-client',this.report1)
    .subscribe({
      next: (res)=>{
        let converted = JSON.stringify(res);
        let conv=JSON.parse(converted);
        console.log(conv);
        this.report1.result=conv;
      }, 
      error: (error) =>{
        console.log(error);
      }
    });
  }

  Reporte2(){
    this.http.put('http://localhost:3000/credit-debit',{institucionbancaria:this.report2.institucionbancaria})
    .subscribe({
      next: (res)=>{
        let converted = JSON.stringify(res);
        let conv=JSON.parse(converted);
        this.report2.total_creditos=conv.total_creditos;
        this.report2.total_debitos=conv.total_debitos;
      }, 
      error: (error) =>{
        console.log(error);
      }
    });
  }

  Reporte3(){
    if(this.report3.institucionbancaria.length>1){
      this.http.put('http://localhost:3000/clients2',{institucionbancaria:this.report3.institucionbancaria})
    .subscribe({
      next: (res)=>{
        let converted = JSON.stringify(res);
        let conv=JSON.parse(converted);
        console.log(conv);
        this.report3.result=conv;
      }, 
      error: (error) =>{
        console.log(error);
      }
    });
    }else{
      this.http.get('http://localhost:3000/clients')
    .subscribe({
      next: (res)=>{
        let converted = JSON.stringify(res);
        let conv=JSON.parse(converted);
        console.log(conv);
        this.report3.result=conv;
      }, 
      error: (error) =>{
        console.log(error);
      }
    });
    }
  }

  Reporte4(){
    this.http.get('http://localhost:3000/bancos')
    .subscribe({
      next: (res)=>{
        let converted = JSON.stringify(res);
        let conv=JSON.parse(converted);
        console.log(conv);
        this.report4.result=conv;
      }, 
      error: (error) =>{
        console.log(error);
      }
    });
  }

  Reporte5(){
    this.http.put('http://localhost:3000/moves',this.report5)
    .subscribe({
      next: (res)=>{
        let converted = JSON.stringify(res);
        let conv=JSON.parse(converted);
        console.log(conv);
        this.report5.result=conv;
      }, 
      error: (error) =>{
        console.log(error);
      }
    });
  }

}
