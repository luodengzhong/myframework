 package com.brc.system.attachment.service.impl;
 
 import com.brc.exception.ApplicationException;
 import com.brc.system.attachment.service.AttachmentQueryService;
 import com.brc.system.attachment.service.AttachmentService;
 import com.brc.system.data.EntityParserDao;
 import com.brc.system.opm.Operator;
 import com.brc.system.share.service.SQLQuery;
 import com.brc.system.share.service.ServiceUtil;
 import com.brc.util.ClassHelper;
 import com.brc.util.FileHelper;
 import com.brc.util.QueryModel;
 import com.brc.util.SDO;
 import com.brc.util.StringUtil;
import com.brc.xmlbean.EntityDocument;
 import com.brc.xmlbean.EntityDocument.Entity;
 import java.io.File;
 import java.sql.Timestamp;
 import java.util.ArrayList;
 import java.util.Date;
 import java.util.HashMap;
 import java.util.Iterator;
 import java.util.LinkedHashMap;
 import java.util.List;
 import java.util.Map;
import java.util.Set;
 
 public class AttachmentServiceImpl
   implements AttachmentService, AttachmentQueryService
 {
   private ServiceUtil serviceUtil;
 
   public void setServiceUtil(ServiceUtil serviceUtil)
   {
     this.serviceUtil = serviceUtil;
   }
 
   private EntityDocument.Entity getEntity()
   {
     return this.serviceUtil.getEntity("config/domain/com/brc/system/attachment/attachment.xml", "attachment");
   }
 
   private EntityDocument.Entity getEntity(String name)
   {
     return this.serviceUtil.getEntity("config/domain/com/brc/system/attachment/attachment.xml", name);
   }
 
   public Long saveAttachmentConfig(SDO params)
   {
     Long attachmentConfigId = (Long)params.getProperty("attachmentConfigId", Long.class);
     if (attachmentConfigId == null) {
       attachmentConfigId = (Long)this.serviceUtil.getEntityDao().insert(getEntity("attachmentConfig"), params.getProperties());
     } else {
       params.getProperties().remove("folderId");
       this.serviceUtil.getEntityDao().update(getEntity("attachmentConfig"), params.getProperties(), new String[0]);
     }
     List detailData = params.getList("detailData");
     if ((null != detailData) && (detailData.size() > 0)) {
       List updateDetails = new ArrayList(detailData.size());
       List insertDetails = new ArrayList(detailData.size());
       for (Iterator i$ = detailData.iterator(); i$.hasNext(); ) { Object obj = i$.next();
         Map m = (Map)obj;
         if ((null == m.get("attachmentConfigId")) || (StringUtil.isBlank(m.get("attachmentConfigId").toString()))) {
           m.put("attachmentConfigId", attachmentConfigId);
           insertDetails.add(m);
         } else {
           updateDetails.add(m);
         }
       }
       if (insertDetails.size() > 0) {
         this.serviceUtil.getEntityDao().batchInsert(getEntity("attachmentConfigDetail"), insertDetails);
       }
       if (updateDetails.size() > 0) {
         this.serviceUtil.getEntityDao().batchUpdate(getEntity("attachmentConfigDetail"), updateDetails, new String[0]);
       }
     }
     return attachmentConfigId;
   }
 
   public Map<String, Object> loadAttachmentConfig(SDO params)
   {
     return this.serviceUtil.getEntityDao().load(getEntity("attachmentConfig"), params.getProperties());
   }
 
   public void deleteAttachmentConfig(SDO params)
   {
     Long[] ids = params.getLongArray("ids");
     for (Long id : ids) {
       Map map = new HashMap(1);
       map.put("attachmentConfigId", id);
       this.serviceUtil.getEntityDao().deleteByCondition(getEntity("attachmentConfigDetail"), map);
       this.serviceUtil.getEntityDao().deleteById(getEntity("attachmentConfig"), id);
     }
   }
 
   public Map<String, Object> slicedQueryAttachmentConfig(SDO params)
   {
     QueryModel query = this.serviceUtil.getEntityDao().getQueryModel(getEntity("attachmentConfig"), params.getProperties());
     return this.serviceUtil.getSQLQuery().executeSlicedQuery(query, params);
   }
 
   public Map<String, Object> slicedQueryAttachmentConfigDetail(SDO params)
   {
     QueryModel query = this.serviceUtil.getEntityDao().getQueryModel(getEntity("attachmentConfigDetail"), params.getProperties());
     return this.serviceUtil.getSQLQuery().executeSlicedQuery(query, params);
   }
 
   public void deleteAttachmentConfigDetail(Long[] ids)
   {
     this.serviceUtil.getEntityDao().deleteByIds(getEntity("attachmentConfigDetail"), ids);
   }
 
   public void updateAttachmentConfigFolderId(Long[] ids, Long parentId)
   {
     this.serviceUtil.updateById("SYS_ATTACHMENT_CONFIG", "FOLDER_ID", "ATTACHMENT_CONFIG_ID", ids, parentId);
   }
 
   public Map<String, Map<String, Object>> queryConfigByBizCode(String bizCode)
   {
     String sql = this.serviceUtil.getEntityDao().getSqlByName(getEntity("attachmentConfigDetail"), "queryByBizCode");
     List<Map<String,Object>> list = this.serviceUtil.getEntityDao().queryToListMap(sql, new Object[] { bizCode.toUpperCase() });
     if ((list == null) || (list.size() == 0)) {
       return null;
     }
     Map configs = new LinkedHashMap(list.size());
     for (Map map : list) {
       String code = (String)ClassHelper.convert(map.get("attachmentCode"), String.class);
       configs.put(code, map);
     }
     return configs;
   }
 
   private void checkNeedMoreFile(Map<String, Object> param)
   {
     String bizCode = (String)ClassHelper.convert(param.get("bizCode"), String.class, "");
     bizCode = bizCode.toUpperCase();
     String attachmentCode = (String)ClassHelper.convert(param.get("attachmentCode"), String.class, "");
     attachmentCode = attachmentCode.toUpperCase();
     if ((StringUtil.isBlank(bizCode)) || (StringUtil.isBlank(attachmentCode)))
     {
       return;
     }
     int isMoreFlag = 0;
     String isMore = (String)ClassHelper.convert(param.get("isMore"), String.class, "");
     String sql = this.serviceUtil.getEntityDao().getSqlByName(getEntity("attachmentConfigDetail"), "checkNeedcMoreFile");
     if (StringUtil.isBlank(isMore))
       isMoreFlag = this.serviceUtil.getEntityDao().queryToInt(sql, new Object[] { bizCode, attachmentCode });
     else {
       try {
         isMoreFlag = Integer.parseInt(isMore);
       } catch (Exception e) {
         isMoreFlag = 0;
       }
     }
     if (isMoreFlag > 0)
     {
       return;
     }
     String bizId = (String)ClassHelper.convert(param.get("bizId"), String.class, "");
     sql = "select t.* from sys_attachment t where upper(t.biz_code)=? and t.biz_id=? and upper(t.attachment_code)=?";
     List<Map<String,Object>> list = this.serviceUtil.getEntityDao().queryToListMap(sql, new Object[] { bizCode, bizId, attachmentCode });
 
     for (Map obj : list) {
       Long id = (Long)ClassHelper.convert(obj.get("id"), Long.class);
       String code = (String)ClassHelper.convert(obj.get("bizCode"), String.class);
       code = code + "_delete";
       updateBillCode(id, code);
     }
   }
 
   public Long save(Map<String, Object> param)
   {
     if ((StringUtil.isBlank((String)param.get("bizCode"))) || (param.get("bizId") == null) || (StringUtil.isBlank(param.get("bizId").toString()))) {
       throw new ApplicationException("业务单据信息不完整,无法保存数据,请检查bizCode,bizId!");
     }
 
     checkNeedMoreFile(param);
     String bizCode = param.get("bizCode").toString();
     param.put("bizCode", bizCode.toUpperCase());
     return (Long)this.serviceUtil.getEntityDao().insert(getEntity(), param);
   }
 
   public void updateBillCode(Long id, String bizCode)
   {
     String sql = this.serviceUtil.getEntityDao().getSqlByName(getEntity(), "updateBizCode");
     this.serviceUtil.getEntityDao().executeUpdate(sql, new Object[] { bizCode.toUpperCase(), id });
   }
 
   public List<Map<String, Object>> getAttachmentList(String bizCode, String bizId)
   {
     String sql = this.serviceUtil.getEntityDao().getSqlByName(getEntity(), "getAttachmentListByBiz");
     List<Map<String,Object>> list = this.serviceUtil.getEntityDao().queryToListMap(sql, new Object[] { bizCode.toUpperCase(), bizId });
     int isFTP = 0;
     long fileLength = 0L;
     String path = "";
     for (Map map : list) {
       isFTP = ((Integer)ClassHelper.convert(map.get("isFtp"), Integer.class, Integer.valueOf(0))).intValue();
       Date createDate = (Date)ClassHelper.convert(map.get("createDate"), Date.class, new Timestamp(System.currentTimeMillis()));
       long startdate = createDate.getTime();
       long enddate = System.currentTimeMillis();
       long interval = enddate - startdate;
       long intervalday = interval / 60000L;
       if ((isFTP == 1) && (intervalday > 1L)) {
         fileLength = ((Long)ClassHelper.convert(map.get("fileLength"), Long.class, Long.valueOf(0L))).longValue();
         path = (String)ClassHelper.convert(map.get("path"), String.class, "");
         File file = FileHelper.getFile(path);
         if ((file != null) && (file.exists())) {
           if (fileLength > file.length())
             map.put("fileKind", "error");
         }
         else {
           map.put("fileKind", "error");
         }
       }
     }
     return list;
   }
 
   public void delete(Long id, String creatorId, boolean flag)
   {
     Map map = this.serviceUtil.getEntityDao().loadById(getEntity(), id);
     if (map != null) {
       if (!StringUtil.isBlank(creatorId)) {
         String dbCreatorId = (String)ClassHelper.convert(map.get("creatorId"), String.class, "");
         if ((flag) && (!dbCreatorId.startsWith(creatorId))) {
           throw new ApplicationException("不能删除其他人上传的文件!");
         }
       }
       String code = (String)ClassHelper.convert(map.get("bizCode"), String.class);
       code = code + "_delete";
       updateBillCode(id, code);
     }
   }
 
   public void deleteAll(String bizCode, String bizId, String creatorId, boolean flag)
   {
     List<Map<String,Object>> objs = getAttachmentList(bizCode, bizId);
     for (Map obj : objs)
       if (!StringUtil.isBlank(creatorId))
       {
         String dbCreatorId = (String)ClassHelper.convert(obj.get("creatorId"), String.class, "");
         if ((flag) && (!dbCreatorId.startsWith(creatorId)));
       }
       else
       {
         Long id = (Long)ClassHelper.convert(obj.get("id"), Long.class);
         String code = (String)ClassHelper.convert(obj.get("bizCode"), String.class);
         code = code + "_delete";
         updateBillCode(id, code);
       }
   }
 
   public Map<String, Object> getAttachmentFile(Long id)
   {
     if (id == null) throw new ApplicationException("文件不存在,可能被其他用户删除或修改！");
     Map map = this.serviceUtil.getEntityDao().loadById(getEntity(), id);
     if ((map == null) || (map.size() == 0)) throw new ApplicationException("文件不存在,可能被其他用户删除或修改！");
     return map;
   }
 
   public List<Map<String, Object>> getAttachmentGroupList(String bizCode, String bizId)
   {
     List fileList = null;
     if (bizId != null) {
       fileList = getAttachmentList(bizCode, bizId);
     }
     return makeGroupList(bizCode, fileList);
   }
 
   private List<Map<String, Object>> makeGroupList(String code, List<Map<String, Object>> fileList)
   {
     Map configMap = queryConfigByBizCode(code);
     if (configMap == null) {
       return null;
     }
     List configList = new ArrayList(configMap.size());
				Set<String> set = configMap.keySet();
     for (String key : set) {
       Map config = (Map)configMap.get(key);
 
       config.put("fileList", getFileByAttachmentCode(key, fileList));
       configList.add(config);
     }
     return configList;
   }
 
   private List<Map<String, Object>> getFileByAttachmentCode(String code, List<Map<String, Object>> list)
   {
     if ((list == null) || (list.size() == 0)) {
       return null;
     }
     List fileList = new ArrayList();
     String attachmentCode = null;
     for (Map m : list) {
       attachmentCode = (String)ClassHelper.convert(m.get("attachmentCode"), String.class, "other");
       if (attachmentCode.equals(code)) {
         fileList.add(m);
       }
     }
     return fileList;
   }
 
   public void updateClearCache(Long id)
   {
     String sql = "update sys_attachment t set t.clear_cache=1 where t.id=?";
     this.serviceUtil.getEntityDao().executeUpdate(sql, new Object[] { id });
   }
 
   public void saveAttachmentSort(SDO sdo)
   {
     Map datas = sdo.getLongMap("datas");
     this.serviceUtil.updateSequence("config/domain/com/brc/system/attachment/attachment.xml", "attachment", "id", datas);
   }
 
   public void saveFTPFileList(SDO sdo)
   {
     String bizCode = (String)sdo.getProperty("bizCode", String.class);
     String bizId = (String)sdo.getProperty("bizId", String.class);
     String attachmentCode = (String)sdo.getProperty("attachmentCode", String.class);
     String isMore = (String)sdo.getProperty("isMore", String.class);
     List fileData = sdo.getList("fileListData");
     String fileName = ""; String fileExt = "";
     Long fileLength = null;
     for (Iterator i$ = fileData.iterator(); i$.hasNext(); ) { Object obj = i$.next();
       Map map = (Map)obj;
       Map param = new HashMap();
       fileName = (String)ClassHelper.convert(map.get("fileName"), String.class);
       fileExt = FileHelper.getFileExtName(fileName);
       fileLength = (Long)ClassHelper.convert(map.get("fileLength"), Long.class);
       param.put("path", map.get("savePath"));
       param.put("bizCode", bizCode);
       param.put("bizId", bizId);
       param.put("attachmentCode", attachmentCode);
       param.put("isMore", isMore);
       param.put("fileName", fileName);
       param.put("fileSize", FileHelper.formetFileSize(fileLength.longValue()));
       param.put("fileKind", fileExt);
       param.put("fileLength", fileLength);
       param.put("isFtp", Integer.valueOf(1));
       param.put("creatorId", sdo.getOperator().getPersonMemberId());
       param.put("creatorName", sdo.getOperator().getPersonMemberName());
       param.put("createDate", new Timestamp(System.currentTimeMillis()));
 
       save(param);
     }
   }
 
   public void deleteFileByIds(SDO sdo)
   {
     Long[] ids = sdo.getLongArray("fileIds");
     String personId = sdo.getOperator().getId();
     String isCheck = (String)sdo.getProperty("isCheck", String.class, "true");
     for (Long id : ids)
       delete(id, personId, Boolean.valueOf(isCheck).booleanValue());
   }
 }

