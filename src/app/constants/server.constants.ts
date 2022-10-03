import { environment } from '../../environments/environment';

export class ServerConstants {
  public static REGISTER = environment.BaseUrl + "/usersignup";
  public static USER_NAME = environment.BaseUrl + "/username";
  public static LOGIN = environment.BaseUrl + "/login";
  public static FORGOT_PASS = environment.BaseUrl + "/forgotpasswordemail";
  public static SET_NEW_PASS = environment.BaseUrl + "/setpassword";
  public static GENERATE_PASS = environment.BaseUrl + '/generatepassword';

  /*policy*/
  public static BLURB_LIST = environment.BaseUrl + "/blurb";
  public static CREATE_POLICY = environment.BaseUrl + "/policy";
  public static EDIT_POLICY = environment.BaseUrl + "/editpolicy";
  public static GET_SINGLE_POLICY = environment.BaseUrl + "/feed";
  public static GET_POLICY_LIST = environment.BaseUrl + "/policylist";

  /*Upload image*/
  public static UPLOAD_IMAGE = environment.BaseUrl + "/upload";

  /*Form*/
  public static TEMPLATE_FORM_SUBMIT = environment.BaseUrl + '/formtemplates';
  public static TEMPLATE_FORM_EDIT = environment.BaseUrl + '/editformtemplates';
  public static GET_SINGLE_TEMPLATE_FORM = environment.BaseUrl + "/singleformtemplates";
  public static GET_TEMPLATE_LIST = environment.BaseUrl + "/formtemplates";
  public static DELETE_TEMPLATE = environment.BaseUrl + "/deleteformtemplate";


  /*Chapter*/
  public static GET_CHAPTER_LIST = environment.BaseUrl + "/chapterlist";
  public static GET_SINGLE_CHAPTER = environment.BaseUrl + "/singlesubchapterwithpolicy";
  public static GET_SUBCHAPTER_OF_CHAPTER = environment.BaseUrl + "/singlechapterdetails";
  public static DELETE_CHAPETR = environment.BaseUrl + "/deletechapter";
  public static DELETE_POLICY = environment.BaseUrl + "/deletepolicy";


  /*Document*/
  public static GET_DOCUMENT_TYPE_LIST = environment.BaseUrl + "/documentname";

  /*tags*/
  public static GET_TAG_LIST = environment.BaseUrl + "/tags";

  /*Region*/
  public static GET_REGION_LIST = environment.BaseUrl + "/region";

  /*Category list*/
  public static GET_CATEGORY_LIST = environment.BaseUrl + "/category";

  /*Organization*/
  public static GET_ORGANIZATION_LIST = environment.BaseUrl + "/organizationlist";
  public static CREATE_ORGANIZATION = environment.BaseUrl + "/organization";
  public static GET_SINGLE_ORGANIZATION = environment.BaseUrl + "/organizationsingle";
  public static EDIT_ORGANIZATION_PROFILE = environment.BaseUrl + "/orgprofile";

  public static EDIT_ORGANIZATION_POLICY = environment.BaseUrl + "/updateassignpolicy";
  public static EDIT_ORGANIZATION_FORMS = environment.BaseUrl + "/editorgform";
  public static EDIT_ORGANIZATION_SOPS = environment.BaseUrl + "/editorgsop";


  public static RE_ASSIGN_ADMIN = environment.BaseUrl + "/newadmin";
  /*Profile*/
  public static PROFILE_COMPLETION_ONE = environment.BaseUrl + "/customiseprofile";
  public static PROFILE_COMPLETION_TWO = environment.BaseUrl + "/customiseorgform";

  /*SOP*/
  public static CREATE_SOP = environment.BaseUrl + "/sop";
  public static GET_SOP_BY_ID = environment.BaseUrl + "/singlesop";
  public static EDIT_SOP = environment.BaseUrl + "/editsop";
  public static GET_SOP_LIST = environment.BaseUrl + "/sop";
  public static DELETE_SOP = environment.BaseUrl + "/deletesoop";

  /*Manger list*/
  public static GET_MANAGER_LIST = environment.BaseUrl + "/managerlist";
  public static GET_USER_LIST = environment.BaseUrl + "/userlist";
  public static ADD_NEW_USER = environment.BaseUrl + "/adduser";
  public static GET_EMP_LIST = environment.BaseUrl + "/orgemplist";
  public static DELETE_USER = environment.BaseUrl + "/removeuser";

  public static SUSPEND_ORG = environment.BaseUrl + "/orgsuspend";
  public static SUSPEND_USER = environment.BaseUrl + "/usersuspend";

  public static ACTIVATE_SUSPENDED_ORG = environment.BaseUrl + "/activateorgsuspend";
  public static ACTIVATE_SUSPENDED_USER = environment.BaseUrl + "/activatesuspenduser";

  public static DELETE_ORG = environment.BaseUrl + "/orgdelete";

  /*Check email*/
  public static IS_EMAIL_EXIST = environment.BaseUrl + "/emailcheck";

  /*Cookie accept*/
  public static ACCEPT_COOKIE = environment.BaseUrl + "/ipset";
  public static CHECK_IS_COOKIE_ACCEPTED = environment.BaseUrl + "/ipcheck";

  /*Assign forms*/
  public static ASSIGN_NEW_FORM = environment.BaseUrl + "/assignform";
  public static MY_FORM_LIST = environment.BaseUrl + "/myforms";
  public static ADMIN_ASSIGN_FORM_LIST = environment.BaseUrl + "/adminassingform";
  public static GET_MY_FORM_BY_ID = environment.BaseUrl + "/myformdetails";
  public static PUBLISH_MY_FORM = environment.BaseUrl + "/publishassignform";
  public static EDIT_MY_FORM = environment.BaseUrl + "/formedit";
  public static SUBMIT_REVIEW_COMMENT = environment.BaseUrl + "/formcomment";
  public static SUBMITTED_FORM_LIST = environment.BaseUrl + "/submitformlist";
  public static GET_SUBMITTED_FORM_BY_ID = environment.BaseUrl + "/submitformbyid";
  public static APPROVE_ASSIGNED_FORM = environment.BaseUrl + "/apporveassignform";
  public static REJECT_ASSIGNED_FORM = environment.BaseUrl + "/rejetedform";

  /*Update user*/
  public static UPDATE_USER_ROLE = environment.BaseUrl + "/edituserrole";
  public static UPDATE_USER = environment.BaseUrl + "/editprofile";
  public static GET_USER_BY_ID = environment.BaseUrl + "/userdetails";
  public static EDIT_EMP = environment.BaseUrl + "/editassignuser";

  public static TEAM_LEADERS = environment.BaseUrl + "/tllist";
  public static SINGLE_USER_DETAILS = environment.BaseUrl + "/singleuserdetails";

  public static UPDATE_USER_BASIC_DETAILS = environment.BaseUrl + "/editbasicdetails";

  public static UPDATE_USER_MANAGER = environment.BaseUrl + "/editmanager";
  public static UPDATE_USER_TEAM_LEADER = environment.BaseUrl + "/editteamleader";
  public static UPDATE_USER_EMPLOYEE = environment.BaseUrl + "/editemployee";


  public static TEMPLATES_ACCORDING_TO_POLICY = environment.BaseUrl + "/selectform";
  public static SOPS_ACCORDING_TO_POLICY = environment.BaseUrl + "/selectsop"; 
  public static POLICYIES_ACCORDING_TO_POLICY = environment.BaseUrl + "/selectpolicy";

}
