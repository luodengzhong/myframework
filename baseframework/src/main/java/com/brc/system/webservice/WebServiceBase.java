 package com.brc.system.webservice;
 
 import com.brc.system.opm.Operator;
 import com.brc.system.opm.domain.Org;
 import com.brc.system.opm.service.OrgService;
 import com.brc.util.ClassHelper;
 import com.brc.util.JSONParseConfig;
 import com.brc.util.LogHome;
 import com.brc.util.SDO;
 import com.brc.util.StringUtil;
 import com.brc.util.ThreadLocalUtil;
 import java.util.Collection;
 import net.sf.json.JSONArray;
 import net.sf.json.JSONObject;
 import org.apache.log4j.Logger;
 
 public class WebServiceBase
 {
   public static String SDO_VARIABLE_NAME = "sdo";
 
   protected OrgService getOrgService()
   {
     return null;
   }
 
   protected void setOperator(String loginName) {
     Operator opr = new Operator();
 
     Org org = getOrgService().loadMainOrgByLoginName(loginName);
 
     opr.setFullId(org.getFullId());
     opr.setFullName(org.getFullName());
     opr.setFullCode(org.getFullCode());
 
     opr.setOrgId(org.getOrgId());
     opr.setOrgCode(org.getOrgCode());
     opr.setOrgName(org.getOrgName());
 
     opr.setCenterId(org.getCenterId());
     opr.setCenterCode(org.getCenterCode());
     opr.setCenterName(org.getCenterName());
 
     opr.setDeptId(org.getDeptId());
     opr.setDeptCode(org.getDeptCode());
     opr.setDeptName(org.getDeptName());
 
     opr.setPositionId(org.getPositionId());
     opr.setPositionCode(org.getPositionCode());
     opr.setPositionName(org.getPositionName());
 
     opr.setPersonMemberId(org.getId());
     opr.setPersonMemberCode(org.getPersonMemberCode());
     opr.setPersonMemberName(org.getPersonMemberName());
 
     ThreadLocalUtil.addVariable("operator", opr);
   }
 
   protected String blank(Status status, String message, Object data) {
     JSONObject object = new JSONObject();
 
     object.put("status", Integer.valueOf(status.ordinal()));
     if (!StringUtil.isBlank(message)) {
       object.put("message", message);
     }
 
     if (data != null) {
       if ((data instanceof SDO))
         object.put("data", JSONObject.fromObject(((SDO)data).getProperties(), JSONParseConfig.jc));
       else if ((data instanceof Collection))
         object.put("data", JSONArray.fromObject(data, JSONParseConfig.jc));
       else if (ClassHelper.isBaseType(data.getClass()))
         object.put("data", data.toString());
       else {
         object.put("data", JSONObject.fromObject(data, JSONParseConfig.jc));
       }
     }
 
     return object.toString();
   }
 
   protected String success() {
     return blank(Status.SUCCESS_TIPS, null, "ok");
   }
 
   protected String success(Object data) {
     return blank(Status.SUCCESS_TIPS, null, data);
   }
 
   protected String success(String message, Object data) {
     return blank(Status.SUCCESS_TIPS, message, data);
   }
 
   public String toResult(Object data) {
     return blank(Status.SUCCESS, null, data);
   }
 
   public String error(String message) {
     return blank(Status.ERROR, message, null);
   }
 
   protected String error(Throwable throwable) {
     LogHome.getLog(this).error(throwable.getMessage(), throwable);
     return error(throwable.getMessage());
   }
 
   protected String error(String message, Object data) {
     return blank(Status.ERROR, message, data);
   }
 
   protected static enum Status
   {
     SUCCESS, SUCCESS_TIPS, ERROR;
   }
 }

