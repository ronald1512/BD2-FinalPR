import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-fails',
  templateUrl: './fails.component.html',
  styleUrls: ['./fails.component.css']
})
export class FailsComponent implements OnInit {
  result=[];
  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.http.get('http://localhost:3000/fallas')
    .subscribe({
      next: (res)=>{
        let converted = JSON.stringify(res);
        let conv=JSON.parse(converted);
        console.log(conv);
        this.result=conv;
      }, 
      error: (error) =>{
        console.log(error);
      }
    });
  }

}
