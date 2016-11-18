 package com.brc.client.action;
 
 import com.brc.client.action.base.CommonAction;
 import com.brc.system.opm.Operator;
 import com.brc.system.share.service.WorkTableService;
 import com.brc.system.share.service.model.UserScreen;
 import com.brc.util.LogHome;
 import com.brc.util.SDO;
 import java.util.ArrayList;
 import java.util.List;
 import org.apache.log4j.Logger;
 
 public class WorkTableAction extends CommonAction
 {
   private WorkTableService service;
 
   public void setService(WorkTableService service)
   {
     this.service = service;
   }
 
   public String query()
     throws Exception
   {
     SDO sdo = getSDO();
     try {
       List screens = this.service.getUserScreens(sdo.getOperator().getId());
       if ((null == screens) || (screens.size() == 0)) {
         Long id = this.service.saveScreen(sdo.getOperator().getPersonMemberId(), sdo.getOperator().getId());
         screens = new ArrayList(1);
         screens.add(new UserScreen(id));
       }
       putAttr("screens", screens);
     } catch (Exception e) {
       e.printStackTrace();
       LogHome.getLog(this).error(e);
       return "error";
     }
     return "success";
   }
 
   public String add()
     throws Exception
   {
     SDO sdo = getSDO();
     try {
       Long id = this.service.saveScreen(sdo.getOperator().getPersonMemberId(), sdo.getOperator().getId());
       return success(id);
     } catch (Exception e) {
       LogHome.getLog(this).error(e);
       return error(e.getMessage());
     }
   }
 
   public String del()
     throws Exception
   {
     SDO sdo = getSDO();
     Long id = (Long)sdo.getProperty("id", Long.class);
     try {
       if (id != null) this.service.deleteScreen(id); 
     }
     catch (Exception e) { e.printStackTrace();
       return error(e.getMessage());
     }
     return blank(CommonAction.Status.SUCCESS, null, null);
   }
 
   public String update()
     throws Exception
   {
     SDO sdo = getSDO();
     String fids = (String)sdo.getProperty("functionids", String.class);
     Long id = (Long)sdo.getProperty("id", Long.class);
     try {
       this.service.updateScreen(id, fids);
     } catch (Exception e) {
       LogHome.getLog(this).error(e);
       return error(e.getMessage());
     }
     return blank(CommonAction.Status.SUCCESS, null, null);
   }
 
   public String queryFunction()
     throws Exception
   {
     SDO sdo = getSDO();
     Long parentId = (Long)sdo.getProperty("parentId", Long.class, new Long(0L));
     try {
       List list = this.service.getFunctionByPersonId(sdo.getOperator().getId(), parentId);
       return toResult(list);
     } catch (Exception e) {
       LogHome.getLog(this).error(e);
       return error(e.getMessage());
     }
   }
 
   public String queryJobFunction()
     throws Exception
   {
     SDO sdo = getSDO();
     Long parentId = (Long)sdo.getProperty("parentId", Long.class, new Long(0L));
     try {
       List list = this.service.getJobFunctionByPersonId(sdo.getOperator().getId(), parentId);
       return toResult(list);
     } catch (Exception e) {
       LogHome.getLog(this).error(e);
       return error(e.getMessage());
     }
   }
 
   public String queryGroupFunctionByPerson()
     throws Exception
   {
     SDO sdo = getSDO();
     Long parentId = (Long)sdo.getProperty("parentId", Long.class, new Long(0L));
     try {
       List list = this.service.getGroupFunctionByPersonId(sdo.getOperator().getId(), parentId);
       return toResult(list);
     } catch (Exception e) {
       LogHome.getLog(this).error(e);
       return error(e.getMessage());
     }
   }
 
   public String queryOftenUseFunction()
     throws Exception
   {
     SDO sdo = getSDO();
     try {
       List list = this.service.queryOftenUseFunction(sdo.getOperator().getId());
       return toResult(list);
     } catch (Exception e) {
       LogHome.getLog(this).error(e);
       return error(e.getMessage());
     }
   }
 }

