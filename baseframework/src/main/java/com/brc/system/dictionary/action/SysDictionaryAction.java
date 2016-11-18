 package com.brc.system.dictionary.action;
 
 import com.brc.client.action.base.CommonAction;
 import com.brc.system.dictionary.service.SysDictionaryService;
 import com.brc.util.DictUtil;
 import com.brc.util.SDO;
 import com.brc.util.StringUtil;
 import java.io.Serializable;
 import java.util.HashMap;
 import java.util.List;
 import java.util.Map;
 
 public class SysDictionaryAction extends CommonAction
 {
   private static final long serialVersionUID = 1L;
   private SysDictionaryService sysDictionaryService;
 
   public void setSysDictionaryService(SysDictionaryService sysDictionaryService)
   {
     this.sysDictionaryService = sysDictionaryService;
   }
 
   protected String getPagePath() {
     return "/system/dictionary/";
   }
 
   public String forwardListDictionary()
   {
     return forward("DictionaryList");
   }
 
   public String slicedQueryDictionary()
   {
     SDO sdo = getSDO();
     try {
       Map map = this.sysDictionaryService.slicedQueryDictionary(sdo);
       return toResult(map);
     } catch (Exception e) {
       e.printStackTrace();
       return error(e.getMessage());
     }
   }
 
   public String showInsertDictionary()
   {
     return forward("DictionaryDetail");
   }
 
   public String insertDictionary()
   {
     SDO sdo = getSDO();
     List detailData = sdo.getList("detailData");
     try {
       Serializable id = this.sysDictionaryService.insertDictionary(sdo, detailData);
       return success(id);
     } catch (Exception e) {
       e.printStackTrace();
       return error(e.getMessage());
     }
   }
 
   public String updateDictionary()
   {
     SDO sdo = getSDO();
     List detailData = sdo.getList("detailData");
     try {
       this.sysDictionaryService.updateDictionary(sdo, detailData);
     } catch (Exception e) {
       e.printStackTrace();
       return error(e.getMessage());
     }
     return success();
   }
 
   public String showUpdateDictionary()
   {
     SDO sdo = getSDO();
     try {
       Map map = this.sysDictionaryService.loadDictionary(sdo);
       return forward("DictionaryDetail", map);
     } catch (Exception e) {
       e.printStackTrace();
       return errorPage(e.getMessage());
     }
   }
 
   public String deleteDictionary()
   {
     SDO sdo = getSDO();
     Long[] ids = sdo.getLongArray("ids");
     try {
       this.sysDictionaryService.deleteDictionary(ids);
     } catch (Exception e) {
       e.printStackTrace();
       return error(e.getMessage());
     }
     return success();
   }
 
   public String moveDictionary()
   {
     SDO sdo = getSDO();
     Long parentId = (Long)sdo.getProperty("parentId", Long.class);
     Long[] ids = sdo.getLongArray("ids");
     try {
       this.sysDictionaryService.updateDictionaryParentId(ids, parentId);
     } catch (Exception e) {
       e.printStackTrace();
       return error(e.getMessage());
     }
     return success();
   }
 
   public String updateDictionaryStatus()
   {
     SDO sdo = getSDO();
     Integer status = (Integer)sdo.getProperty("status", Integer.class);
     Long[] ids = sdo.getLongArray("ids");
     try {
       this.sysDictionaryService.updateDictionaryStatus(ids, status.intValue());
     } catch (Exception e) {
       e.printStackTrace();
       return error(e.getMessage());
     }
     return success();
   }
 
   public String forwardListDictionaryDetail()
   {
     return forward("DictionaryDetailList");
   }
 
   public String slicedQueryDictionaryDetail()
   {
     SDO sdo = getSDO();
     try {
       Map map = this.sysDictionaryService.slicedQueryDictionaryDetail(sdo);
       return toResult(map);
     } catch (Exception e) {
       e.printStackTrace();
       return error(e.getMessage());
     }
   }
 
   public String showInsertDictionaryDetail()
   {
     return forward("DictionaryDetailDetal");
   }
 
   public String deleteDictionaryDetail()
   {
     SDO sdo = getSDO();
     Long[] ids = sdo.getLongArray("ids");
     try {
       this.sysDictionaryService.deleteDictionaryDetail(ids);
     } catch (Exception e) {
       e.printStackTrace();
       return error(e.getMessage());
     }
     return success();
   }
 
   public String updateDictionaryDetailStatus()
   {
     SDO sdo = getSDO();
     Integer status = (Integer)sdo.getProperty("status", Integer.class);
     Long[] ids = sdo.getLongArray("ids");
     try {
       this.sysDictionaryService.updateDictionaryDetailStatus(ids, status.intValue());
     } catch (Exception e) {
       e.printStackTrace();
       return error(e.getMessage());
     }
     return success();
   }
 
   public String syncCache()
   {
     try
     {
       this.sysDictionaryService.syncCache();
     } catch (Exception e) {
       e.printStackTrace();
       return error(e.getMessage());
     }
     return success("同步缓存已完成!", "");
   }
 
   public String queryDictionaryByCode()
   {
     SDO sdo = getSDO();
     String codes = (String)sdo.getProperty("code", String.class);
     if (!StringUtil.isBlank(codes)) {
       String[] cs = codes.split(",");
       Map map = new HashMap(cs.length);
       for (String code : cs) {
         map.put(code, DictUtil.getDictionary(code));
       }
       return success(map);
     }
     return success();
   }
 }

