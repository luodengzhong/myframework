 package com.brc.system.person.action;
 
 import com.brc.client.action.base.CommonAction;
 import com.brc.system.person.service.SuggestionBoxService;
 import com.brc.util.LogHome;
 import com.brc.util.SDO;
 import java.io.Serializable;
 import java.util.Map;
 import org.apache.log4j.Logger;
 
 public class SuggestionBoxAction extends CommonAction
 {
   private static final long serialVersionUID = 1L;
   private SuggestionBoxService suggestionBoxService;
 
   public void setSuggestionBoxService(SuggestionBoxService suggestionBoxService)
   {
     this.suggestionBoxService = suggestionBoxService;
   }
 
   protected String getPagePath() {
     return "/system/suggestion/";
   }
 
   public String forwardList()
   {
     return forward("SuggestionBoxList");
   }
 
   public String slicedQuery()
   {
     SDO sdo = getSDO();
     try {
       Map map = this.suggestionBoxService.slicedQuery(sdo);
       return toResult(map);
     } catch (Exception e) {
       e.printStackTrace();
       LogHome.getLog(this).error(e);
       return error(e.getMessage());
     }
   }
 
   public String showInsert()
   {
     return forward("SuggestionBoxDetail");
   }
 
   public String insert()
   {
     SDO sdo = getSDO();
     try {
       Serializable id = this.suggestionBoxService.insert(sdo);
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
       this.suggestionBoxService.update(sdo);
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
       Map map = this.suggestionBoxService.load(sdo);
       return forward("updateSuggestionBox", map);
     } catch (Exception e) {
       e.printStackTrace();
       LogHome.getLog(this).error(e);
       return errorPage(e.getMessage());
     }
   }
 
   public String delete()
   {
     SDO sdo = getSDO();
     try {
       this.suggestionBoxService.delete(sdo);
     } catch (Exception e) {
       e.printStackTrace();
       LogHome.getLog(this).error(e);
       return error(e.getMessage());
     }
     return success();
   }
 }

