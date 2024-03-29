import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Constants } from 'src/app/constants/constants';
import { ProxyService } from 'src/app/proxy.service';
import { BackendService } from 'src/app/services/backend.service';
import { EventService } from 'src/app/services/event.service';
import { LoadingService } from 'src/app/services/loading.service';

@Component({
  selector: 'app-get-gravity-formby-id',
  templateUrl: './get-gravity-formby-id.component.html',
  styleUrls: ['./get-gravity-formby-id.component.scss']
})
export class GetGravityFormbyIdComponent implements OnInit {
  formId:any;
  jsonForm: any;  
  selctValue:any;

  formData:any={};
  constructor(private route: ActivatedRoute, private router: Router , private proxyservice: ProxyService ,     private backendService: BackendService,
    private loadingService: LoadingService ,     private toastr: ToastrService , private event: EventService
    ) { }

  ngOnInit() {
    this.loadingService.apiStart();
    this.route.queryParams.subscribe((params:any) =>{
      console.log( 'idd', params.fromID)
      this.formId =params.fromID
      console.log(this.formId)
    } );
    this.getGravityFormbyId()
  }

  getGravityFormbyId(){
    this.proxyservice.getFormById(this.formId).subscribe((res)=>{
      console.log( 'result',res)
      this.jsonForm = res;  
      this.formData.title = this.jsonForm.title;
      this.formData.description = this.jsonForm.description;
      console.log('extra formdata',this.formData)  
      this.loadingService.apiStop();  
    } , (err)=>{
      console.log('error' , err);
      
    })
  }
  backButton(){
    this.router.navigate(['/create-template'])
  }
  onChangeradion(selectValue: any) {
    this.selctValue = selectValue;
    console.log('selectValue', this.selctValue);
  }
  formSubmit(form:any){
    console.log('Submitted Form' , form.value)

  }
  exitForm(){
    this.event.sendMessage({
      type: Constants.OPEN_CONFIRMATION_OVERLAY,
      data: {
        heading: "Cancel template?",
        inline: true,
        callback: function () {
          window.history.back();
        },
      },
    });
  }

  superAdminAddnewForm(){
   let payload = JSON.parse(JSON.stringify(this.formData));
   payload.content = JSON.stringify(this.jsonForm);
  //  payload.content = document.getElementById('gravityForm').innerHTML
  //  payload.conditionallogic = this.jsonForm

console.log( 'docinnerhtml', payload);

this.loadingService.apiStart();

this.backendService.templateFormSubmit(payload).subscribe(
  (result) => {
    this.loadingService.apiStop();
        if (result.code == 200) {
          // this.formData = {};
          // document.getElementById("formEditor").innerHTML = "";
          // form.submitted = false;
          this.toastr.success("Form submitted successfully!!");
          window.history.back();

        }
console.log(result)
  }),(error:any) => {
    this.loadingService.apiStop();
    this.toastr.error("Form Not submitted There are some error !!");

console.log(error)
  }


  }

}
