import { Injectable, Inject } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { ServerConstants } from '../constants/server.constants';
import { RestClient } from './rest-client.service';
import { Constants } from '../constants/constants';
import { UserDataService } from './user-data.service';


@Injectable({
    providedIn: 'root'
})
export class BackendService {
  constructor(private restClient: RestClient, private userDataService: UserDataService) {}

  register(payload){
    return this.restClient.post( ServerConstants.REGISTER, payload ); 
  }

  logout(){}

  getUserData(){
    return JSON.parse(localStorage.getItem("whirligigUser")) || {};
  }
  // Login 
  login(payload){
    return this.restClient.post(ServerConstants.LOGIN, payload);
  }

  forgotPass(payload){
    return this.restClient.post(ServerConstants.FORGOT_PASS, payload);
  }

  setNewPassword(payload){
    return this.restClient.post(ServerConstants.SET_NEW_PASS, payload);
  }

  generatePassword(payload){
    return this.restClient.post(ServerConstants.GENERATE_PASS, payload);
  }

  /*policy*/
  getBlurbList(){
    return this.restClient.get(ServerConstants.BLURB_LIST);
  }

  createPolicy(payload){
    return this.restClient.post(ServerConstants.CREATE_POLICY, payload);
  }

  editPolicy(payload){
    return this.restClient.post(ServerConstants.EDIT_POLICY, payload);
  }

  getSinglePolicy(endPoint){
    return this.restClient.get(ServerConstants.GET_SINGLE_POLICY + '/' + endPoint);
  }

  getPolicyList(term){
    return this.restClient.get(ServerConstants.GET_POLICY_LIST + term);
  }

  /*Upload image*/
  uploadimage(image, type){
    return this.restClient.post(ServerConstants.UPLOAD_IMAGE /*+ '/' + type*/, image);
  }

  /*Form*/
  templateFormSubmit(payload){
    return this.restClient.post(ServerConstants.TEMPLATE_FORM_SUBMIT, payload);
  }

  templateFormEdit(payload){
    return this.restClient.post(ServerConstants.TEMPLATE_FORM_EDIT, payload);
  }

  getSingleTemplateForm(id){
    return this.restClient.get(ServerConstants.GET_SINGLE_TEMPLATE_FORM + '/' + id);
  }

  gettemplatelist(term){
    return this.restClient.get(ServerConstants.GET_TEMPLATE_LIST + term);
  }

  deleteTemplate(id){
    return this.restClient.get(ServerConstants.DELETE_TEMPLATE + '/' + id);
  }

  /*Chapter*/
  getchapterslist(){
    return this.restClient.get(ServerConstants.GET_CHAPTER_LIST);
  }

  getSinglechapter(chapterId, subChapterId, policyId){
    return this.restClient.get(ServerConstants.GET_SINGLE_CHAPTER + '/' + chapterId + '/' + subChapterId + '/' + policyId);
  }

  getSubchapterOfChapter(id){
    return this.restClient.get(ServerConstants.GET_SUBCHAPTER_OF_CHAPTER + '/' + id);
  }

  deleteChapter(id){
    return this.restClient.get(ServerConstants.DELETE_CHAPETR + '/' + id);
  }

  deletePolicy(id, type){
    return this.restClient.get(ServerConstants.DELETE_POLICY + '/' + id + '/' + type);
  }

  /*Document*/
  getDocumentTypeList(){
    return this.restClient.get(ServerConstants.GET_DOCUMENT_TYPE_LIST);
  }

  /*Tags*/
  getTagList(){
    return this.restClient.get(ServerConstants.GET_TAG_LIST);
  }

  /*Region*/
  getRegionList(){
    return this.restClient.get(ServerConstants.GET_REGION_LIST);
  }

  /*Category*/
  getCategoryList(){
    return this.restClient.get(ServerConstants.GET_CATEGORY_LIST);
  }

  /*organization*/
  getOrganizationList(term){
    return this.restClient.get(ServerConstants.GET_ORGANIZATION_LIST + '?q=' + (term != undefined && term != null ? term : ''));
  }

  createOrganization(payload){
    return this.restClient.post(ServerConstants.CREATE_ORGANIZATION, payload);
  }

  editOrganizationProfile(payload){
    return this.restClient.post(ServerConstants.EDIT_ORGANIZATION_PROFILE, payload);
  }

  editOrganizationPolicy(payload){
    return this.restClient.post(ServerConstants.EDIT_ORGANIZATION_POLICY, payload);
  }

  editOrganizationForms(payload){
    return this.restClient.post(ServerConstants.EDIT_ORGANIZATION_FORMS, payload);
  }

  editOrganizationSOPs(payload){
    return this.restClient.post(ServerConstants.EDIT_ORGANIZATION_SOPS, payload);
  }

  getSingleOrganization(id){
    return this.restClient.get(ServerConstants.GET_SINGLE_ORGANIZATION + '/' + id);
  }

  reAssignAdmin(payload){
    return this.restClient.post(ServerConstants.RE_ASSIGN_ADMIN, payload);
  }

  /*Profile*/
  profileCompletionOne(payload){
    return this.restClient.post(ServerConstants.PROFILE_COMPLETION_ONE, payload);
  }

  profileCompletionTwo(payload){
    return this.restClient.post(ServerConstants.PROFILE_COMPLETION_TWO, payload);
  }

  /*SOP*/
  createSOP(payload){
    return this.restClient.post(ServerConstants.CREATE_SOP, payload);
  }

  getSOPById(id){
    return this.restClient.get(ServerConstants.GET_SOP_BY_ID + '/' + id);
  }

  editSOP(payload){
    return this.restClient.post(ServerConstants.EDIT_SOP, payload);
  }

  getSOPList(term){
    return this.restClient.get(ServerConstants.GET_SOP_LIST + term);
  }

  deleteSOP(id){
    return this.restClient.get(ServerConstants.DELETE_SOP + '/' + id);
  }

  /*Manager*/
  getManagerList(term){
    return this.restClient.get(ServerConstants.GET_MANAGER_LIST + '?q=' + (term != undefined && term != null ? term : ''));
  }

  getEmpList(term){
    return this.restClient.get(ServerConstants.GET_EMP_LIST + '?q=' + (term != undefined && term != null ? term : ''));
  }

  getUserList(term){
    return this.restClient.get(ServerConstants.GET_USER_LIST + '?q=' + (term != undefined && term != null ? term : ''));
  }

  addNewUser(payload){

    if (this.userDataService.getSelectedOrg()) {
       payload['users'].forEach((user)=>{
         user['orgid'] = this.userDataService.getSelectedOrg().id
       });
    }

    return this.restClient.post(ServerConstants.ADD_NEW_USER, payload);
  }

  removeUser(payload){
    return this.restClient.post(ServerConstants.DELETE_USER, payload);
  }

  suspendOrg(orgId){
    return this.restClient.get(ServerConstants.SUSPEND_ORG + '/' + orgId);
  }

  activateSuspendedOrg(orgId){
    return this.restClient.get(ServerConstants.ACTIVATE_SUSPENDED_ORG + '/' + orgId);
  }

  suspendUser(userId){
    return this.restClient.get(ServerConstants.SUSPEND_USER + '/' + userId);
  }

  activateSuspendUser(userId){
    return this.restClient.get(ServerConstants.ACTIVATE_SUSPENDED_USER + '/' + userId);
  }

  deleteOrg(orgId){
    return this.restClient.get(ServerConstants.DELETE_ORG + '/' + orgId);
  }

  /*Check email*/
  isEmailExist(payload){
    return this.restClient.post(ServerConstants.IS_EMAIL_EXIST, payload);
  }

  /*Get IP*/
  getIPAddress(){
    return this.restClient.get("https://api.ipify.org/?format=json");
  }

  /*Accept cookie*/
  acceptCookie(payload){
    return this.restClient.post( ServerConstants.ACCEPT_COOKIE, payload);
  }

  checkIsCookieAccepted(ip){
    return this.restClient.get( ServerConstants.CHECK_IS_COOKIE_ACCEPTED + '/' + ip);
  }

  /*Assign forms*/
  assignNewForm(payload){

    if (this.userDataService.getSelectedOrg()) {
      payload['id'] = this.userDataService.getSelectedOrg()['id'];
    }

    return this.restClient.post( ServerConstants.ASSIGN_NEW_FORM, payload);
  }

  getAssignedFormList(){

    let term = ( this.userDataService.getSelectedOrg() ? ('?id=' + this.userDataService.getSelectedOrg().id) : '') ;

    return this.restClient.get( ServerConstants.ADMIN_ASSIGN_FORM_LIST);
  }

  getAdminAssignedFormList(term){

    term = term +( this.userDataService.getSelectedOrg() ? ('&id=' + this.userDataService.getSelectedOrg().id) : '') ;

    return this.restClient.get( ServerConstants.ADMIN_ASSIGN_FORM_LIST + term);
  }

  myFormList(term){
    return this.restClient.get( ServerConstants.MY_FORM_LIST + term);
  }

  publishMyForm(payload){
    return this.restClient.post( ServerConstants.PUBLISH_MY_FORM, payload);
  }

  editMyForm(payload){
    return this.restClient.put( ServerConstants.EDIT_MY_FORM, payload);
  }

  submitReviewComment(payload){
    return this.restClient.post( ServerConstants.SUBMIT_REVIEW_COMMENT, payload);
  }

  submittedFormList(){
    let term = this.userDataService.getSelectedOrg() ? ('?id=' + this.userDataService.getSelectedOrg().id) : '' ;
    return this.restClient.get( ServerConstants.SUBMITTED_FORM_LIST + term);
  }

  getsubmittedFormById(id){
    return this.restClient.get( ServerConstants.GET_SUBMITTED_FORM_BY_ID + '/' + id);
  }

  approveAssignedForm(payload){
    return this.restClient.post( ServerConstants.APPROVE_ASSIGNED_FORM , payload);
  }

  rejectAssignedForm(payload){
    return this.restClient.post( ServerConstants.REJECT_ASSIGNED_FORM, payload);
  }

  /*Update user role*/
  updateUserRole(payload){
    return this.restClient.post( ServerConstants.UPDATE_USER_ROLE, payload);
  }

  updateUser(payload){
    return this.restClient.post( ServerConstants.UPDATE_USER, payload);
  }

  editEmp(payload){
    return this.restClient.post( ServerConstants.EDIT_EMP, payload);
  }

  teamLeaders(){
    return this.restClient.get( ServerConstants.TEAM_LEADERS);
  }

  getSingleUserDetails(id, role){
    return this.restClient.get(ServerConstants.SINGLE_USER_DETAILS + '/' + id + '/' + role);
  }

  getUserById(id){
    return this.restClient.get(ServerConstants.GET_USER_BY_ID + '/' + id );
  }

  updateUserBasicDetails(payload){
    return this.restClient.post(ServerConstants.UPDATE_USER_BASIC_DETAILS, payload );
  }

  updateUserManager(payload){
    return this.restClient.post(ServerConstants.UPDATE_USER_MANAGER, payload );
  }

  updateUserTeamLeader(payload){
    return this.restClient.post(ServerConstants.UPDATE_USER_TEAM_LEADER, payload );
  }

  updateUserEmployee(payload){
    return this.restClient.post(ServerConstants.UPDATE_USER_EMPLOYEE, payload );
  }

  templatesAccordingToPolicy(payload){
    return this.restClient.post(ServerConstants.TEMPLATES_ACCORDING_TO_POLICY, payload );
  }

  sopsAccordingToPolicy(payload){
    return this.restClient.post(ServerConstants.SOPS_ACCORDING_TO_POLICY, payload );
  }

  policiesAccordingToPolicy(payload){
    return this.restClient.post(ServerConstants.POLICYIES_ACCORDING_TO_POLICY, payload );
  }
}