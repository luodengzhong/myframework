 package com.brc.system.contact.action;
 
 import com.brc.client.action.base.CommonAction;
 import com.brc.system.contact.service.ContactService;
 import com.brc.util.SDO;
 import com.brc.util.StringUtil;
 import java.io.Serializable;
 import java.util.Map;
 
 public class ContactAction extends CommonAction
 {
   private static final long serialVersionUID = -4602328802341419406L;
   private ContactService contactService;
 
   public void setContactService(ContactService contactService)
   {
     this.contactService = contactService;
   }
 
   protected String getPagePath() {
     return "/system/contact/";
   }
 
   public String forwardToShowContact() {
     String bizCode = (String)getSDO().getProperty("bizCode");
     String bizId = (String)getSDO().getProperty("bizId");
     if ((StringUtil.isBlank(bizCode)) && (StringUtil.isBlank(bizId))) {
       return forward("ShowContact", getSDO());
     }
     Map contactInfo = this.contactService.loadContactByBizCodeAndBizId(bizCode, bizId);
     contactInfo.put("bizCode", bizCode);
     contactInfo.put("bizId", bizId);
     return forward("ShowContact", contactInfo);
   }
 
   public String forwardToConfigurationList()
   {
     return forward("ContactConfiguration", getSDO());
   }
 
   public String sliceQueryConfiguration() {
     try {
       Map data = this.contactService.sliceQueryConfiguration(getSDO());
       return toResult(data);
     } catch (Exception e) {
       return error(e);
     }
   }
 
   public String saveConfiguration() {
     try {
       this.contactService.saveConfiguration(getSDO());
       return success();
     } catch (Exception e) {
       return error(e);
     }
   }
 
   public String queryContactWay() {
     try {
       Map data = this.contactService.queryContactWay(getSDO());
       return toResult(data);
     } catch (Exception e) {
       return error(e);
     }
   }
 
   public String saveContactWay() {
     try {
       Serializable contactId = this.contactService.saveContactWay(getSDO());
       return success(contactId);
     } catch (Exception e) {
       return error(e);
     }
   }
 
   public String queryAvailableContactWay() {
     try {
       Map data = this.contactService.queryAvailableContactWay(getSDO());
       return toResult(data);
     } catch (Exception e) {
       return error(e);
     }
   }
 
   public String loadFirstContactWay() {
     try {
       Map data = this.contactService.loadFirstContactWay(getSDO());
       return toResult(data);
     } catch (Exception e) {
       return error(e);
     }
   }
 
   public String updateStatus() {
     try {
       SDO sdo = getSDO();
       Integer status = (Integer)sdo.getProperty("status", Integer.class);
       Long[] ids = sdo.getLongArray("ids");
       this.contactService.updateStatus(status, ids);
       return success();
     } catch (Exception e) {
       return error(e);
     }
   }
 }

