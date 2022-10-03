import { Injectable, Inject } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { Ng2ImgMaxService } from 'ng2-img-max';

import { ServerConstants } from '../constants/server.constants';
import { RestClient } from './rest-client.service';
import { environment } from '../../environments/environment';
import { BackendService } from './backend.service';
import { Constants } from '../constants/constants';
import { LoadingService } from './loading.service';

@Injectable({
    providedIn: 'root'
})
export class S3Service {
  constructor(private backendService: BackendService, private toastr: ToastrService, private loadingService: LoadingService, private ng2ImgMax: Ng2ImgMaxService) {}

  /*TODO need to integrate this service with backend*/
  uploadS3(file, type, successCallback, errorCallback): void {

    if (file.type.includes('image')) {
      this.ng2ImgMax.compressImage(file, 0.5).subscribe(
      result => {
        let compressedImage = new File([result], result.name);
        const formData: FormData = new FormData();
        formData.append('image', compressedImage, compressedImage.name);

        this.backendService.uploadimage(formData, type)
        .subscribe(result => {
          if(result.code == 200) {
            successCallback({Location: result.data});
          }else{
            errorCallback(result);
          }
        },
        (error) => {
          errorCallback(error);
        });
      },
      error => {
        errorCallback(error);
      });
    } else {
      const formData: FormData = new FormData();
      formData.append('image', file, file.name);

      this.backendService.uploadimage(formData, type)
      .subscribe(result => {
        if(result.code == 200) {
          successCallback({Location: result.data});
        }else{
          errorCallback(result);
        }
      },
      (error) => {
        errorCallback(error);
      });
    }
  }
}
