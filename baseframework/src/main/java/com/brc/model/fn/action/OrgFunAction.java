 package com.brc.model.fn.action;
 
 import com.brc.client.action.base.CommonAction;
 import com.brc.model.fn.ExpressManager;
 import java.util.List;
 
 public class OrgFunAction extends CommonAction
 {
   private static final long serialVersionUID = 1L;
 
   public String execute(String org, String manageType, boolean includeAllParent, String inOrg)
   {
     List result = null;
     try {
       result = (List)ExpressManager.evaluate("findManagers(" + org + "," + manageType + ",false," + inOrg + ")");
     }
     catch (Exception e)
     {
       e.printStackTrace();
     }
     return toResult(result);
   }
 }

