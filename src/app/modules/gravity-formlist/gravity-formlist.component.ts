import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProxyService } from 'src/app/proxy.service';
import { LoadingService } from 'src/app/services/loading.service';

@Component({
  selector: 'app-gravity-formlist',
  templateUrl: './gravity-formlist.component.html',
  styleUrls: ['./gravity-formlist.component.scss']
})
export class GravityFormlistComponent implements OnInit {
templates:any =[]
  constructor( private proxyservice: ProxyService ,  private Route: Router , private loadingService: LoadingService) { }

  ngOnInit() {
    this.loadingService.apiStart()
    this.getAllgravityForm()
  }

getAllgravityForm(){
   this.proxyservice.getFormList().subscribe((res)=>{
      console.log( 'result',res)
      let pro = Object.values(res)
      console.log('http res',pro); 
      this.templates = pro;
    // this.loadingService.apiStop();

      console.log( 'form array',this.templates);
      this.loadingService.apiStop();
    } , (err)=>{
      console.log('error' , err);
      
    })   
}

viewForm(id:any){
console.log(id)
this.Route.navigate(['/preview-gravityFrom'],{queryParams: {fromID : id}})

}

}
