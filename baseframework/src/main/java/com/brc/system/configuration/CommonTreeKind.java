 package com.brc.system.configuration;
 
 public class CommonTreeKind
 {
   public static final int ORGTYPE = 1;
   public static final int DPTTYPE = 2;
   public static final int POSTYPE = 3;
   public static final int ROLE = 4;
   public static final int EXTENDEDFIELDDEFINE = 5;
   public static final int EXTENDEDFIELDGROUP = 6;
   public static final int PARAMETER = 7;
   public static final int SERIALNUMBER = 8;
   public static final int DICTIONARY = 9;
   public static final int HRDETAILDEFINE = 11;
   public static final int HRARCHIVESFIELDGROUP = 12;
   public static final int RECRUITPOS = 14;
   public static final int MESSAGEREMIND = 15;
   public static final int PERMISSIONFIELD = 16;
   public static final int BASEMANAGEMENTTYPE = 17;
   public static final int BIZMANAGEMENTTYPE = 18;
   public static final int PAINDEXTYPE = 19;
   public static final int PERSONREGISTERTYPE = 20;
   public static final int ATTACHMENTCONFIG = 21;
   public static final int TASKKIND = 22;
   public static final int ATTKIND = 23;
   public static final int RESHUFFLETYPE = 24;
   public static final int USERGROUPKIND = 25;
   public static final int INFOFEEDBACKTEMPLATE = 26;
   public static final int MEETINGKIND = 29;
   public static final int ASKREPORTKIND = 30;
   public static final int TRAININGCOURSETYPE = 31;
   public static final int RESPONSIBILITIYKIND = 32;
   public static final int RESIGNATIONTYPE = 34;
   public static final int DISPATCHKINDTYPE = 37;
   public static final int AUDITREPORTKIND = 38;
   public static final int PROJECTTYPICALCASEKIND = 39;
   public static final int OPERATIONMAPKIND = 40;
   public static final int LAWRISKCHECKINDEXKIND = 41;
   public static final int WEIXINMESSAGEKIND = 50;
   public static final int CSMPROBLEMTASK = 60;
   public static final int CSMPROBLEMLIB = 61;
 
   public static String[] getBusinessTableInfo(Integer kindId)
   {
     switch (kindId.intValue()) {
     case 1:
     case 2:
     case 3:
       return new String[] { "SA_OPORGTYPE", "FOLDER_ID" };
     case 4:
       return new String[] { "SA_OPROLE", "FOLDER_ID" };
     case 5:
       return new String[] { "SYS_EXTENDED_FIELD_DEFINE", "PARENT_ID" };
     case 6:
       return new String[] { "SYS_EXTENDED_FIELD_GROUP", "PARENT_ID" };
     case 7:
       return new String[] { "SYS_PARAMETER", "PARENT_ID" };
     case 8:
       return new String[] { "SYS_SERIAL_NUMBER", "PARENT_ID" };
     case 9:
       return new String[] { "SYS_DICTIONARY", "PARENT_ID" };
     case 11:
       return new String[] { "HR_DETAIL_DEFINE", "PARENT_ID" };
     case 12:
       return new String[] { "HR_ARCHIVES_FIELD_DEFINE", "GROUP_ID" };
     case 14:
       return new String[] { "HR_RECRUIT_POSITION", "PARENT_ID" };
     case 19:
       return new String[] { "hr_perform_assess_index", "PARENT_ID" };
     case 20:
       return new String[] { "HR_PERSON_REGISTER", "PARENT_ID" };
     case 15:
       return new String[] { "SYS_MESSAGE_REMIND", "PARENT_ID" };
     case 16:
       return new String[] { "SA_OPPERMISSIONFIELD", "PARENT_ID" };
     case 17:
       return new String[] { "SA_OPBASEMANAGEMENTTYPE", "FOLDER_ID" };
     case 18:
       return new String[] { "SA_OPBIZMANAGEMENTTYPE", "FOLDER_ID" };
     case 21:
       return new String[] { "SYS_ATTACHMENT_CONFIG", "FOLDER_ID" };
     case 22:
       return new String[] { "OA_TASK_KIND", "FOLDER_ID" };
     case 23:
       return new String[] { "ZK_WEB_MACHINES", "FOLDER_KIND_ID" };
     case 25:
       return new String[] { "OA_USER_GROUP", "FOLDER_ID" };
     case 26:
       return new String[] { "OA_INFO_FEEDBACK_TEMPLATE", "FOLDER_ID" };
     case 29:
       return new String[] { "OA_MEETING_KIND", "PARENT_ID" };
     case 30:
       return new String[] { "OA_ASK_REPORT_KIND", "PARENT_ID" };
     case 31:
       return new String[] { "HR_TRAINING_COURSE", "PARENT_ID" };
     case 32:
       return new String[] { "HR_RESPONSIBILITIY_DEFINE", "PARENT_ID" };
     case 37:
       return new String[] { "OA_DISPATCH_KIND", "DISPATCH_KIND_TYPE_ID" };
     case 38:
       return new String[] { "AM_AUDIT_REPORT_KIND", "PARENT_ID" };
     case 39:
       return new String[] { "AM_PROJECT_TYPICAL_CASE_KIND", "PARENT_ID" };
     case 40:
       return new String[] { "SYS_OPERATION_MAP", "FOLDER_ID" };
     case 41:
       return new String[] { "AM_LAW_RISK_CHECK_INDEX", "PARENT_ID" };
     case 50:
       return new String[] { "SYS_WEIXIN_MESSAGE_KIND", "PARENT_ID" };
     case 60:
       return new String[] { "CSM_PROBLEM_TASK_KIND", "PARENT_ID" };
     case 61:
       return new String[] { "CSM_STANDARD_PROBLEM_LIB", "PARENT_ID" };
     case 10:
     case 13:
     case 24:
     case 27:
     case 28:
     case 33:
     case 34:
     case 35:
     case 36:
     case 42:
     case 43:
     case 44:
     case 45:
     case 46:
     case 47:
     case 48:
     case 49:
     case 51:
     case 52:
     case 53:
     case 54:
     case 55:
     case 56:
     case 57:
     case 58:
     case 59: } return null;
   }
 }

