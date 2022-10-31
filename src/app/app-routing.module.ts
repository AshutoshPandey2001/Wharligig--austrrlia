import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomePageComponent } from './components/home-page/home-page.component';
import { AuthGuard } from './auth.guard';
import { GravityFormlistComponent } from './modules/gravity-formlist/gravity-formlist.component';
import { GetGravityFormbyIdComponent } from './modules/get-gravity-formby-id/get-gravity-formby-id.component';

const routes: Routes = [
  {
    path: '',
    component: HomePageComponent,
    data: {
      isFooter: true
    }
  },
  /*Features module*/
  {
    path: 'feature',
    loadChildren: './modules/features/features.module#FeaturesModule',
    data: {
      isFooter: true
    },
    canActivate: [AuthGuard]
  },
  /*Contact module*/
  {
    path: 'contact',
    loadChildren: './modules/contact/contact.module#ContactModule',
    data: {
      isFooter: true
    },
    canActivate: [AuthGuard]
  },
  /*About module*/
  {
    path: 'about',
    loadChildren: './modules/about/about.module#AboutModule',
    data: {
      isFooter: true
    },
    canActivate: [AuthGuard]
  },

  /*policy uploadar form module*/
  {
    path: 'create-policy',
    loadChildren: './modules/policy-uploader/uploader.module#UploaderModule',
    data: {
      role: 1
    },
    canActivate: [AuthGuard]
  }, 
  {
    path: 'edit-policy/:endpoint',
    loadChildren: './modules/policy-uploader/uploader.module#UploaderModule',
    data: {
      role: 1
    },
    canActivate: [AuthGuard]
  },

  /*Dasboard module*/
  {
    path: 'dashboard',
    loadChildren: './modules/dashboard/dashboard.module#DashboardModule',
    data: {
      isFooter: true
    },
    canActivate: [AuthGuard]
  },

  /*Submitted module*/
  {
    path: 'submitted-form',
    loadChildren: './modules/submitted-form/submitted-form.module#SubmittedFormModule',
    canActivate: [AuthGuard]
  },

  /*My forms module*/
  {
    path: 'my-forms',
    loadChildren: './modules/my-forms/my-forms.module#MyFormsModule',
    canActivate: [AuthGuard]
  },

  /*Assigned forms module*/
  {
    path: 'assigned-forms',
    loadChildren: './modules/assign-forms/assign-forms.module#AssignFormsModule',
    canActivate: [AuthGuard]
  },

  /*Form uploader module*/
  {
    path: 'create-template',
    component: GravityFormlistComponent,
    data: {
      role: 0
    },
    canActivate: [AuthGuard]
  },
  {
    path: 'preview-gravityFrom',
    component: GetGravityFormbyIdComponent,
    data: {
      role: 0
    },
    canActivate: [AuthGuard]
  },

  {
    path: 'edit-template/:templateId',
    loadChildren: './modules/uploader/uploader.module#UploaderModule',
    data: {
      role: 0
    },
    canActivate: [AuthGuard]
  },

  {
    path: 'view-template/:templateId',
    loadChildren: './modules/uploader/uploader.module#UploaderModule',
    data: {
      role: 0
    },
    canActivate: [AuthGuard]
  },

  /*Fill form module*/
  {
    path: 'fill-form/:templateId/:empId',
    loadChildren: './modules/uploader/uploader.module#UploaderModule',
    data: {
      role: 1,
      isFillForm: true
    },
    canActivate: [AuthGuard]
  },

  /*view my form inner*/
  {
    path: 'view-my-form/:reviewFormId',
    loadChildren: './modules/uploader/uploader.module#UploaderModule',
    data: {
      /*Read only for view form only to hide buttons */
      isReviewForm: true,
      isReadOnly: true
    },
    canActivate: [AuthGuard]
  },

  /*Edit my form inner*/
  {
    path: 'edit-my-form/:reviewFormId',
    loadChildren: './modules/uploader/uploader.module#UploaderModule',
    data: {
      isFillForm: true,
      isMyFormEdit: true
    },
    canActivate: [AuthGuard]
  },

  /*view assigned form inner*/
  {
    path: 'view-assign-form/:reviewFormId',
    loadChildren: './modules/uploader/uploader.module#UploaderModule',
    data: {
      /*Read only for view form only to hide buttons */
      isReviewForm: true,
      isReadOnly: true
    },
    canActivate: [AuthGuard]
  },
  /*Fill form module*/
  {
    path: 'review-form/:reviewFormId',
    loadChildren: './modules/uploader/uploader.module#UploaderModule',
    data: {
      role: 1,
      isReviewForm: true
    },
    canActivate: [AuthGuard]
  },
  /*Policy inner view module*/
  {
    path: 'policy/:endpoint',
    loadChildren: './modules/policy-inner-view/policy-inner-view.module#PolicyInnerViewModule',
    canActivate: [AuthGuard]
  },

  /*Policy inner view module*/
  {
    path: 'sub-chapter/:subChapterId',
    loadChildren: './modules/chapter-inner-view/chapter-inner-view.module#ChapterInnerViewModule',
    data: {
      isFooter: true
    },
    canActivate: [AuthGuard]
  },

  /*Organizations module*/
  {
    path: 'organizations',
    loadChildren: './modules/organizations/organizations.module#OrganizationsModule',
    canActivate: [AuthGuard]
  },

  /*Employee module*/
  {
    path: 'employee',
    loadChildren: './modules/employee/employee.module#EmployeeModule',
    canActivate: [AuthGuard]
  },

  /*form-templates module*/
  {
    path: 'form-templates',
    loadChildren: './modules/form-templates/form-templates.module#FormTemplatesModule',
    canActivate: [AuthGuard]
  },
  /*chapters module*/
  {
    path: 'chapters',
    loadChildren: './modules/chapters/chapters.module#ChaptersModule',
    canActivate: [AuthGuard]
  },
  /*sub chapter module*/
  {
    path: 'chapter/:chapterId',
    loadChildren: './modules/sub-chapter/sub-chapter.module#SubChapterModule',
    canActivate: [AuthGuard]
  },
  /*SOP module*/
  {
    path: 'create-sop',
    loadChildren: './modules/sop-uploader/sop-uploader.module#SopUploaderModule',
    canActivate: [AuthGuard]
  },
  /*SOP inner view module*/
  {
    path: 'sop/:sopId',
    loadChildren: './modules/sop-inner-view/sop-inner-view.module#SopInnerViewModule',
    canActivate: [AuthGuard]
  },
  /*SOP edit*/
  {
    path: 'edit-sop/:sopId',
    loadChildren: './modules/sop-uploader/sop-uploader.module#SopUploaderModule',
    canActivate: [AuthGuard]
  },
  /*SOP list module*/
  {
    path: 'sop',
    loadChildren: './modules/sop-list/sop-list.module#SopListModule',
    canActivate: [AuthGuard]
  },
  /*disclaimer module start*/
  { 
    path: 'disclaimer',
    loadChildren: './modules/disclaimer/disclaimer.module#DisclaimerModule',
    data: {
      isFooter: true
    }
  },
  /*Terms and condition module*/
  { 
    path: 'terms',
    loadChildren: './modules/terms-and-conditions/terms-and-conditions.module#TermsAndConditionsModule',
    data: {
      isFooter: true
    }
  },
  /*Privacy policy module*/
  { 
    path: 'privacy-policy',
    loadChildren: './modules/privacy-policy/privacy-policy.module#PrivacyPolicyModule',
    data: {
      isFooter: true
    }
  },
  /*Notification module*/
  { 
    path: 'notification',
    loadChildren: './modules/notification/notification.module#NotificationModule',
    data: {
      isFooter: true
    },
    canActivate: [AuthGuard]
  },
  /*Onboarding module*/
  { 
    path: '',
    loadChildren: './modules/onboarding/onboarding.module#OnboardingModule',
    data: {
      isFooter: false
    },
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {scrollPositionRestoration: 'enabled'})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
