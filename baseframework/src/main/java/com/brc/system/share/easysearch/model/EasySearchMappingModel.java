 package com.brc.system.share.easysearch.model;
 
 import com.brc.util.ClassHelper;
 import com.brc.util.ConfigFileVersions;
import com.brc.xmlbean.EasySearchMappingDocument;
 import com.brc.xmlbean.EasySearchMappingDocument.EasySearchMapping;
import com.brc.xmlbean.FieldDocument;
 import com.brc.xmlbean.FieldDocument.Field;
 import com.brc.xmlbean.FieldDocument.Field.Align.Enum;
 import com.brc.xmlbean.FieldDocument.Field.IsCondition;
import com.brc.xmlbean.QuerySchemeDocument;
 import com.brc.xmlbean.QuerySchemeDocument.QueryScheme;
 import com.brc.xmlbean.QuerySchemeDocument.QueryScheme.Authority;
 import java.io.Serializable;
 import java.util.HashMap;
 import java.util.Map;
 import java.util.regex.Matcher;
 import java.util.regex.Pattern;
 
 public class EasySearchMappingModel
   implements Serializable, ConfigFileVersions
 {
   private static final long serialVersionUID = 173704882069216812L;
   private Map<String, QuerySchemeModel> querySchemes;
   private Long versions;
   private String configFilePath;
   private static final Pattern pattern = Pattern.compile("\t|\r|\n");
 
   public EasySearchMappingModel(EasySearchMappingDocument.EasySearchMapping mapping) {
     this.querySchemes = new HashMap(mapping.getQuerySchemeArray().length);
     for (QuerySchemeDocument.QueryScheme queryScheme : mapping.getQuerySchemeArray())
       this.querySchemes.put(queryScheme.getName(), parseQueryScheme(queryScheme));
   }
 
   private QuerySchemeModel parseQueryScheme(QuerySchemeDocument.QueryScheme queryScheme)
   {
     QuerySchemeModel model = new QuerySchemeModel(queryScheme.getFieldArray().length);
     model.setName(queryScheme.getName());
     model.setDesc(queryScheme.getDesc());
     model.setAuthority((queryScheme.getAuthority() != null) && (queryScheme.getAuthority() == QuerySchemeDocument.QueryScheme.Authority.TRUE));
     Matcher matcher = pattern.matcher(queryScheme.getSql());
     model.setSql(matcher.replaceAll(""));
     model.setFolderIdName(queryScheme.getFolderIdName());
     model.setFolderKindId(queryScheme.getFolderKindId());
     model.setSqlBeanName(queryScheme.getSqlBeanName());
     int length = queryScheme.getFieldArray().length;
     boolean isCondition = true;
     for (int i = 0; i < length; i++) {
       FieldDocument.Field f = queryScheme.getFieldArray()[i];
       isCondition = true;
       if ((f.getIsCondition() != null) && (f.getIsCondition() == FieldDocument.Field.IsCondition.FALSE)) {
         isCondition = false;
       }
       QuerySchemeField field = new QuerySchemeField();
       field.setName(f.getName());
       field.setCode(f.getCode());
       field.setMask(f.getMask());
       field.setSequence(((Integer)ClassHelper.convert(f.getSequence(), Integer.class, Integer.valueOf(i))).intValue());
       field.setType(f.getType().toString());
       field.setAlign(f.getAlign().toString());
       field.setWidth((Long)ClassHelper.convert(f.getWidth(), Long.class, new Long(60L)));
       field.setDictionary(f.getDictionary());
       field.setCondition(isCondition);
       model.addHeard(field);
     }
     model.setOrderby(queryScheme.getOrderby());
     return model;
   }
 
   public QuerySchemeModel getQuerySchemeModel(String name)
   {
     return (QuerySchemeModel)this.querySchemes.get(name);
   }
 
   public Long getVersions() {
     return this.versions;
   }
 
   public void setVersions(Long versions) {
     this.versions = versions;
   }
 
   public void setConfigFilePath(String configFilePath) {
     this.configFilePath = configFilePath;
   }
 
   public String getConfigFilePath()
   {
     return this.configFilePath;
   }
 }

