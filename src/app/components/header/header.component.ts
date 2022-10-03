import { Component, OnInit } from '@angular/core';
import { UserDataService } from '../../services/user-data.service';
import { Constants } from '../../constants/constants';
import { EventService } from '../../services/event.service';
import { BackendService } from '../../services/backend.service'

var _this;
declare var $:any;

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  constants = Constants;
  isConfirmationOverlayOpen = false;
  confirmationOverlayData:any = {};
  isCookieOpen = false;
  isUnseenNotification = false;

  selectedOrg = false;

  constructor(public userData: UserDataService, private event: EventService, private backendService: BackendService) {
    _this = this;

    /*Capturing custom data events*/
    _this.event.getMessage().subscribe(data => {

      /*To open confirmation overlay*/
      if(Constants.OPEN_CONFIRMATION_OVERLAY == data.type) {
        _this.confirmationOverlayData = data.data;
        _this.isConfirmationOverlayOpen = true;
      }

      /*To close confirmation overlay*/
      if(Constants.CLOSE_CONFIRMATION_OVERLAY == data.type) {
        _this.isConfirmationOverlayOpen = false;
      }

      /*To open login modal*/
      if(Constants.OPEN_LOGIN_MODAL == data.type) {
        $('#loginModal').modal('show');
      }
    });
  }

  ngOnInit() {
    this.getIPAddress();
    $(document).on('click', 'li.dropdown.notification-menu', function (e) {
      if(e.target.tagName.toLowerCase() != 'a') {
        e.stopPropagation();
      }
    });

    this.userData.getSelectedOrgObs().subscribe((data)=>{
      this.selectedOrg = data;
    });
  }

  checkIsCookieAccepted(ip){
    this.backendService.checkIsCookieAccepted(ip)
    .subscribe(result => {
      this.isCookieOpen = !result;
    },
    error => {
    });
  }

  getIPAddress(){
    this.backendService.getIPAddress()
    .subscribe(result => {
      this.checkIsCookieAccepted(result.ip);
    },
    error => {
    });
  }

  /*Confirmation overlay actions*/
  confirmation(status){
    if(status) {
      /*Callback if action yes*/
      this.confirmationOverlayData.callback();
    }
    /*Close confirmation overlay*/
    this.isConfirmationOverlayOpen = false;
  }

  onCloseCookie(){
    $('.cookie').addClass('cookie-close');
    setTimeout(function(){
      _this.isCookieOpen = false;
    }, 1000);
  }
}
