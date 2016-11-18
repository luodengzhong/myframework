 package com.brc.system.validator;
 
 import com.brc.exception.ApplicationException;
 import com.brc.system.data.EntityParserDao;
 import com.brc.system.share.service.ServiceUtil;
 import com.brc.system.util.Util;
 import com.brc.util.ClassHelper;
 import com.brc.util.SDO;
 import com.brc.util.SpringBeanFactory;
import com.brc.xmlbean.EntityDocument;
 import com.brc.xmlbean.EntityDocument.Entity;
import com.brc.xmlbean.IdDocument;
 import com.brc.xmlbean.IdDocument.Id;
 import java.util.ArrayList;
 import java.util.List;
 import java.util.Map;
 import org.apache.struts2.ServletActionContext;
 import org.jsoup.helper.StringUtil;
 
 public class Validator
 {
   private SDO data;
   private EntityDocument.Entity entity;
   private String parentFieldName;
   private List<ValidationItem> validationItems;
 
   public Validator(EntityDocument.Entity entity, SDO data)
   {
     this.data = data;
     this.entity = entity;
     this.validationItems = new ArrayList();
   }
 
   public Validator(EntityDocument.Entity entity, SDO data, String parentFieldName) {
     this(entity, data);
     this.parentFieldName = parentFieldName;
   }
 
   public SDO getData() {
     return this.data;
   }
 
   public void setData(SDO data) {
     this.data = data;
   }
 
   public String getParentFieldName() {
     return this.parentFieldName;
   }
 
   public void setParentFieldName(String parentFieldName) {
     this.parentFieldName = parentFieldName;
   }
 
   public List<ValidationItem> getValidationItems() {
     return this.validationItems;
   }
 
   public EntityDocument.Entity getEntity() {
     return this.entity;
   }
 
   public void setEntity(EntityDocument.Entity entity) {
     this.entity = entity;
   }
 
   private void validateNotNull()
   {
     for (ValidationItem item : this.validationItems)
       if (item.isNotNull()) {
         String fieldValue = (String)this.data.getProperty(item.getFieldName(), String.class);
         if (StringUtil.isBlank(fieldValue))
           throw new ApplicationException(String.format("%s不能为空。", new Object[] { item.getDisplayName() }));
       }
   }
 
   private boolean isInsert()
   {
     boolean result = false;
 
     for (IdDocument.Id id : this.entity.getIdArray()) {
       if (StringUtil.isBlank((String)this.data.getProperty(id.getName(), String.class))) {
         result = true;
         break;
       }
     }
     return result;
   }
 
   private String buildUniqueSql(List<Object> params) {
     StringBuilder sb = new StringBuilder();
 
     sb.append("select %s from ");
     sb.append(getEntity().getTable());
     sb.append(" where 1 = 1 ");
 
     if (!isInsert()) {
       for (IdDocument.Id id : this.entity.getIdArray()) {
         sb.append(" and ").append(id.getColumn());
         sb.append(" != ").append("?");
         params.add(this.data.getProperty(id.getName()));
       }
     }
 
     if (!StringUtil.isBlank(this.parentFieldName)) {
       sb.append(String.format(" and %s = ?) ", new Object[] { this.parentFieldName }));
       params.add(this.data.getProperty(this.parentFieldName));
     }
 
     String fields = ""; String condition = "";
 
     for (ValidationItem item : this.validationItems) {
       if (item.isUnique()) {
         String fieldValue = (String)this.data.getProperty(item.getFieldName(), String.class);
         params.add(fieldValue.toUpperCase());
         if (StringUtil.isBlank(fields)) {
           fields = item.getFieldName();
           condition = String.format(" upper(%s) = ? ", new Object[] { item.getFieldName() });
         } else {
           fields = new StringBuilder().append(fields).append(",").append(item.getFieldName()).toString();
           condition = String.format(" %s or upper(%s) = ? ", new Object[] { condition, item.getFieldName() });
         }
       }
     }
     sb.append(" and (").append(condition).append(")");
     return String.format(sb.toString(), new Object[] { fields });
   }
 
   private void validateUnique() {
     boolean validateUnique = false;
 
     for (ValidationItem item : this.validationItems)
       if (item.isUnique()) {
         String fieldValue = (String)this.data.getProperty(item.getFieldName(), String.class);
         if (StringUtil.isBlank(fieldValue)) {
           throw new ApplicationException(String.format("验证唯一性出错，%s为空。", new Object[] { item.getDisplayName() }));
         }
         if (!validateUnique);
         validateUnique = true;
       }
     Map map;
     if (validateUnique) {
       List params = new ArrayList();
       String sql = buildUniqueSql(params);
       ServiceUtil serviceUtil = (ServiceUtil)SpringBeanFactory.getBean(ServletActionContext.getServletContext(), "serviceUtil");
       map = serviceUtil.getEntityDao().queryToMap(sql, params.toArray());
       if (map.size() > 0)
         for (ValidationItem item : this.validationItems) {
           String inputValue = (String)this.data.getProperty(item.getFieldName(), String.class);
           String dbValue = (String)ClassHelper.convert(map.get(item.getFieldName()), String.class, "");
           Util.check(!dbValue.equalsIgnoreCase(inputValue), "%s“%s”重复，不能保存。", new Object[] { item.getDisplayName(), dbValue });
         }
     }
   }
 
   public void validate()
   {
     if (this.data == null) {
       throw new ApplicationException("验证数据出错，data为空。");
     }
     if (this.entity == null) {
       throw new ApplicationException("验证数据出错，entity为空。");
     }
     if (this.validationItems == null) {
       throw new ApplicationException("验证数据出错，validatorItems为空。");
     }
 
     validateNotNull();
     validateUnique();
   }
 
   public static Validator newInstance(EntityDocument.Entity entity, SDO data) {
     Validator validator = new Validator(entity, data);
     return validator;
   }
 
   public static Validator newInstance(EntityDocument.Entity entity, SDO data, String parentFieldName) {
     Validator validator = new Validator(entity, data, parentFieldName);
     return validator;
   }
 
   private void addCodeAndNameItems()
   {
     ValidationItem validationItem = new ValidationItem("code", "编码", ValidationKind.NOT_NULL_AND_UNIQUE);
     this.validationItems.add(validationItem);
     validationItem = new ValidationItem("name", "名称", ValidationKind.NOT_NULL_AND_UNIQUE);
     this.validationItems.add(validationItem);
   }
 
   public static void validateCodeAndNameConstraints(EntityDocument.Entity entity, SDO params) {
     Validator validator = newInstance(entity, params);
     validator.addCodeAndNameItems();
     validator.validate();
   }
 }

