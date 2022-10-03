import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { SignupComponent } from './pages/signup/signup.component';
import { EmailVerifyComponent } from './pages/email-verify/email-verify.component';
import { ProfileCompletionComponent } from './pages/profile-completion/profile-completion.component';
import { MobileNumberVerificationComponent } from './pages/mobile-number-verification/mobile-number-verification.component';
import { RegisterComponent } from './pages/register/register.component';
import { LoginComponent } from './pages/login/login.component';
import { ProfileCompletionOneComponent } from './pages/profile-completion-one/profile-completion-one.component';
import { NewPassComponent } from './pages/new-pass/new-pass.component';

const routes: Routes = [
  { path: 'sign-up',
    component: RegisterComponent
  },
  { path: 'login',
    component: LoginComponent
  },
  /*Sign up component is to verify email not for sign up*/
  { path: 'verify-email',
    component: SignupComponent
  },
  { path: 'forgot-pass',
    component: SignupComponent,
    data: {
      forgotPass: true
    }
  },{
    path: 'email-verify',
    component: EmailVerifyComponent
  },{
    path: 'profile-completion-2',
    component: ProfileCompletionComponent
  },{
    path: 'profile-completion-1',
    component: ProfileCompletionOneComponent
  },{
    path: 'otp-verification',
    component: MobileNumberVerificationComponent
  },
  {
    path: 'passwordset',
    component: NewPassComponent
  }
];

@NgModule({
  declarations: [SignupComponent, ProfileCompletionComponent, EmailVerifyComponent, MobileNumberVerificationComponent, RegisterComponent, LoginComponent, ProfileCompletionOneComponent, NewPassComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule
  ]
})
export class OnboardingModule { }
