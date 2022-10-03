export class Constants {
  /*User roles*/
  public static SUPER_ADMIN = 0;
  public static ADMIN = 1;
  public static MANAGER = 2;
  public static TEAM_TEAD = 3;
  public static EMPLOYEE = 4;

  /*Form approval status*/
  public static ASSIGNED = 0;
  public static SUBMITTED = 1;
  public static APPROVED = 3;
  public static REJECTED = 2;

  /*Organization empty placeholder*/
  public static ORGANISATION_EMPTY_PLACEHOLDER = '"$Company Name$"';

  /*Events constants*/
  public static OPEN_CONFIRMATION_OVERLAY = 1;
  public static CLOSE_CONFIRMATION_OVERLAY = 2;
  public static OPEN_LOGIN_MODAL = 3;
  public static EDIT_ORG_MODAL = 4;
  public static EDIT_EMP_OVERLAY = 5;


  /*User status*/
  public static NOT_VERIFIED = 1;
  public static VERIFIED = 2;


  /*Add new user constants*/
  public static VIEW_USER = 1;
  public static NEW_USER = 2;
  public static EDIT_USER = 3;


  /*Create organisation pages*/
  public static ORG_NEW_INFO = 0;
  public static ORG_POLICY_INFO = 1;
  public static ORG_FORM_INFO = 2;
  public static ORG_SOP_INFO = 3;
  public static ORG_CONFIRM_INFO = 4;
  public static ORG_SUCCESS_INFO = 5;
  public static ORG_VIEW_INFO = 6;
  public static ORG_NEW_ADMIN_INFO = 7;
}