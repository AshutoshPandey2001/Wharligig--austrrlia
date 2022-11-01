import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { fromEvent } from 'rxjs';
import { ProxyService } from 'src/app/proxy.service';
import { LoadingService } from 'src/app/services/loading.service';
import { map, filter, debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-gravity-formlist',
  templateUrl: './gravity-formlist.component.html',
  styleUrls: ['./gravity-formlist.component.scss']
})
export class GravityFormlistComponent implements OnInit {
templates:any =[]
  formNameInput:any ='';
  searchTerm;
  pageNo = 1;
  constructor( private proxyservice: ProxyService ,  private Route: Router , private loadingService: LoadingService) { }

  ngOnInit() {
    this.loadingService.apiStart()
    this.getAllgravityForm()
    // this.onSearchChange();
  }

  // onSearchChange(){
  //   this.formNameInput = document.getElementById("formSearch");
  //   const subscription = fromEvent(this.formNameInput, 'input')
  //   .pipe(debounceTime(1000))
  //   .subscribe((e: KeyboardEvent) => {
  //     this.pageNo = 1;
  //     this.searchTerm = (<HTMLInputElement>e.target).value;
  //     this.getAllgravityForm()
  //   });
  // }

getAllgravityForm(){
   this.proxyservice.getFormList().subscribe((res)=>{
      console.log( 'result',res)
      let pro = Object.values(res)
      console.log('http res',pro); 
      this.templates = pro;

      console.log( 'form array',this.templates);
      this.loadingService.apiStop();
    } , (err)=>{
      console.log('error' , err);
      this.loadingService.apiStop();

    })   
}

viewForm(id:any){
console.log(id)
this.Route.navigate(['/preview-gravityFrom'],{queryParams: {fromID : id}})

}

}
