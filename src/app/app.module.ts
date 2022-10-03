import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { OwlModule } from 'ngx-owl-carousel';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Ng2ImgMaxModule } from 'ng2-img-max';
import { NgwWowModule } from 'ngx-wow';
import { FormsModule }   from '@angular/forms';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { HomePageComponent } from './components/home-page/home-page.component';
import { FooterComponent } from './components/footer/footer.component';
import { ServicesModule } from './services/services.module';
import { CookiePolicyComponent } from './components/cookie-policy/cookie-policy.component';
import { EditProfileModalComponent } from './components/edit-profile-modal/edit-profile-modal.component';
import { LoginModalComponent } from './components/login-modal/login-modal.component';
import { SuperAdminNavigationsOrgComponent } from './components/super-admin-navigations-org/super-admin-navigations-org.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    HomePageComponent,
    FooterComponent,
    CookiePolicyComponent,
    EditProfileModalComponent,
    LoginModalComponent,
    SuperAdminNavigationsOrgComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    OwlModule,
    CommonModule,
    HttpClientModule,
    ToastrModule.forRoot({
      maxOpened: 1,
      preventDuplicates: true,
      autoDismiss: true,
      positionClass: 'toast-bottom-right'
    }), // ToastrModule added,
    BrowserAnimationsModule,
    Ng2ImgMaxModule,
    ServicesModule,
    NgwWowModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
