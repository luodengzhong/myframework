 package com.brc.system.util;
 
 import com.brc.system.data.EntityParserDao;
 import com.brc.system.share.service.ServiceUtil;
 import com.brc.util.SDO;
 import com.brc.util.SpringBeanFactory;
import com.brc.xmlbean.EntityDocument;
 import com.brc.xmlbean.EntityDocument.Entity;
 import java.util.Map;
 import org.apache.struts2.ServletActionContext;
 import org.jsoup.helper.StringUtil;
 
 public class NameCodeUniqueValidator
 {
   private EntityDocument.Entity entity;
   private SDO data;
   private String keyFieldName;
   private String checkUniqueSqlName;
   private String parentFieldName;
   private Long parentId;
 
   public void setEntity(EntityDocument.Entity entity)
   {
     this.entity = entity;
   }
 
   public void setData(SDO data) {
     this.data = data;
   }
 
   public void setKeyFieldName(String keyFieldName) {
     this.keyFieldName = keyFieldName;
   }
 
   public void setCheckUniqueSqlName(String checkUniqueSqlName) {
     this.checkUniqueSqlName = checkUniqueSqlName;
   }
 
   private Long getId() {
     return (Long)this.data.getProperty(this.keyFieldName, Long.class, Long.valueOf(0L));
   }
 
   private String getCode() {
     return (String)this.data.getProperty("code", String.class);
   }
 
   private String getName() {
     return (String)this.data.getProperty("name", String.class);
   }
 
   public String getParentFieldName() {
     return this.parentFieldName;
   }
 
   public void setParentFieldName(String parentFieldName) {
     this.parentFieldName = parentFieldName;
   }
 
   public Long getParentId() {
     return this.parentId;
   }
 
   public void setParentId(Long parentId) {
     this.parentId = parentId;
   }
 
   public static NameCodeUniqueValidator newInstance(EntityDocument.Entity entity, SDO params, String keyFieldName, String sqlName) {
     NameCodeUniqueValidator nameCodeUniqueValidator = new NameCodeUniqueValidator();
 
     nameCodeUniqueValidator.setEntity(entity);
     nameCodeUniqueValidator.setData(params);
     nameCodeUniqueValidator.setKeyFieldName(keyFieldName);
     nameCodeUniqueValidator.setCheckUniqueSqlName(sqlName);
 
     return nameCodeUniqueValidator;
   }
 
   public static NameCodeUniqueValidator newInstance(EntityDocument.Entity entity, SDO params, String keyFieldName, String sqlName, String parentFieldName, Long parentId) {
     NameCodeUniqueValidator nameCodeUniqueValidator = newInstance(entity, params, keyFieldName, sqlName);
     nameCodeUniqueValidator.setParentFieldName(parentFieldName);
     nameCodeUniqueValidator.setParentId(parentId);
     return nameCodeUniqueValidator;
   }
 
   public void validate() {
     validateNotNull();
     validateUnique();
   }
 
   private void validateNotNull() {
     Util.check(Util.isNotEmptyString(getCode()), "编码不能为空。");
     Util.check(Util.isNotEmptyString(getName()), "名称不能为空。");
   }
 
   private void validateUnique() {
     ServiceUtil serviceUtil = (ServiceUtil)SpringBeanFactory.getBean(ServletActionContext.getServletContext(), "serviceUtil", ServiceUtil.class);
 
     String sql = serviceUtil.getEntityDao().getSqlByName(this.entity, this.checkUniqueSqlName);
     Map map;
     if (!StringUtil.isBlank(this.parentFieldName)) {
       sql = sql + " and " + this.parentFieldName + " = ?";
       map = serviceUtil.getEntityDao().queryToMap(sql, new Object[] { getId(), getCode().toUpperCase(), getName().toUpperCase(), this.parentId });
     } else {
       map = serviceUtil.getEntityDao().queryToMap(sql, new Object[] { getId(), getCode().toUpperCase(), getName().toUpperCase() });
     }
 
     if (map.size() > 0) {
       String dbCode = (String)map.get("code");
       String dbName = (String)map.get("name");
       Util.check(!dbCode.equalsIgnoreCase(getCode()), "编码“%s”重复，不能保存。", new Object[] { getCode() });
       Util.check(!dbName.equalsIgnoreCase(getName()), "名称“%s”重复，不能保存。", new Object[] { getName() });
     }
   }
 }

