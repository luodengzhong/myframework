 package com.brc.system.remind.action;
 
 import com.brc.client.action.base.CommonAction;
 import com.brc.system.remind.service.MessageRemindService;
 import com.brc.util.LogHome;
 import com.brc.util.SDO;
 import java.io.Serializable;
 import java.util.List;
 import java.util.Map;
 import org.apache.log4j.Logger;
 
 public class MessageRemindAction extends CommonAction
 {
   private static final long serialVersionUID = 1L;
   private MessageRemindService messageRemindService;
 
   public void setMessageRemindService(MessageRemindService messageRemindService)
   {
     this.messageRemindService = messageRemindService;
   }
 
   protected String getPagePath() {
     return "/system/remind/";
   }
 
   public String forwardList()
   {
     return forward("MessageRemindList");
   }
 
   public String slicedQuery()
   {
     SDO sdo = getSDO();
     try {
       Map map = this.messageRemindService.slicedQuery(sdo);
       return toResult(map);
     } catch (Exception e) {
       e.printStackTrace();
       LogHome.getLog(this).error(e);
       return error(e.getMessage());
     }
   }
 
   public String showInsert()
   {
     SDO sdo = getSDO();
     Long parentId = (Long)sdo.getProperty("parentId", Long.class);
     putAttr("sequence", this.messageRemindService.getNextSequence(parentId));
     return forward("MessageRemindDetail");
   }
 
   public String insert()
   {
     SDO sdo = getSDO();
     try {
       Serializable id = this.messageRemindService.insert(sdo);
       return success(id);
     } catch (Exception e) {
       e.printStackTrace();
       LogHome.getLog(this).error(e);
       return error(e.getMessage());
     }
   }
 
   public String update()
   {
     SDO sdo = getSDO();
     try {
       this.messageRemindService.update(sdo);
     } catch (Exception e) {
       e.printStackTrace();
       LogHome.getLog(this).error(e);
       return error(e.getMessage());
     }
     return success();
   }
 
   public String showUpdate()
   {
     SDO sdo = getSDO();
     try {
       Map map = this.messageRemindService.load(sdo);
       return forward("MessageRemindDetail", map);
     } catch (Exception e) {
       e.printStackTrace();
       LogHome.getLog(this).error(e);
       return errorPage(e.getMessage());
     }
   }
 
   public String delete()
   {
     SDO sdo = getSDO();
     Long[] ids = sdo.getLongArray("ids");
     try {
       this.messageRemindService.delete(ids);
     } catch (Exception e) {
       e.printStackTrace();
       LogHome.getLog(this).error(e);
       return error(e.getMessage());
     }
     return success();
   }
 
   public String updateStatus()
   {
     SDO sdo = getSDO();
     Integer status = (Integer)sdo.getProperty("status", Integer.class);
     Long[] ids = sdo.getLongArray("ids");
     try {
       this.messageRemindService.updateStatus(ids, status.intValue());
     } catch (Exception e) {
       e.printStackTrace();
       LogHome.getLog(this).error(e);
       return error(e.getMessage());
     }
     return success();
   }
 
   public String updateSequence()
   {
     Map data = getSDO().getLongMap("data");
     try {
       this.messageRemindService.updateSequence(data);
       return success();
     } catch (Exception e) {
       LogHome.getLog(this).error(e);
       return error(e.getMessage());
     }
   }
 
   public String updateParentId()
   {
     SDO sdo = getSDO();
     Long parentId = (Long)sdo.getProperty("parentId", Long.class);
     Long[] ids = sdo.getLongArray("ids");
     try {
       this.messageRemindService.updateParentId(ids, parentId);
     } catch (Exception e) {
       e.printStackTrace();
       LogHome.getLog(this).error(e);
       return error(e.getMessage());
     }
     return success();
   }
 
   public String testParseRemindFun()
   {
     SDO sdo = getSDO();
     Long remindId = (Long)sdo.getProperty("remindId", Long.class);
     try {
       List list = this.messageRemindService.testParseRemindFun(remindId);
       return toResult(list);
     } catch (Exception e) {
       e.printStackTrace();
       LogHome.getLog(this).error(e);
       return error(e.getMessage());
     }
   }
 }

