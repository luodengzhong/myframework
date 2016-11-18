 package com.brc.system.opm;
 
 import com.brc.system.util.Util;
 import com.brc.util.ClassHelper;
 import java.io.Serializable;
 import java.util.HashMap;
 import java.util.Map;
 import org.apache.log4j.Logger;
 import org.jsoup.helper.StringUtil;
 
 public class OrgUnit
   implements Serializable
 {
   private static final long serialVersionUID = 6809247788310053987L;
   public static final Logger logger = Logger.getLogger(OrgUnit.class);
   private String fullId;
   private String fullName;
   private boolean isBuildAttribute;
   protected Map<String, Object> attributes = new HashMap();
 
   public OrgUnit()
   {
   }
 
   public OrgUnit(String fullId, String fullName)
   {
     Util.check((Util.isNotEmptyString(fullId)) && (Util.isNotEmptyString(fullId)), "创建OrgUnit时fullId，fullName参数不能为空。");
     this.fullId = fullId;
     this.fullName = fullName;
   }
 
   public boolean contains(OrgUnit obj)
   {
     if ((obj != null) && (obj.getFullId() != null)) {
       return obj.getFullId().startsWith(this.fullId);
     }
     return false;
   }
 
   public int hashCode() {
     return getFullId() == null ? 221 : getFullId().hashCode();
   }
 
   public boolean equals(Object obj) {
     if ((obj != null) && ((obj instanceof OrgUnit))) return ((OrgUnit)obj).getFullId() == null ? true : this.fullId == null ? false : this.fullId.equals(((OrgUnit)obj).getFullId());
 
     return false;
   }
 
   public String getFullId() {
     return this.fullId;
   }
 
   public void setFullId(String fullId) {
     this.fullId = fullId;
   }
 
   public String getFullName() {
     return this.fullName;
   }
 
   public void setFullName(String fullName) {
     this.fullName = fullName;
   }
 
   public void setAttributeValue(String key, Object value) {
     this.attributes.put(key, value);
   }
 
   public Object getAttributeValue(String key) {
     if (!this.isBuildAttribute) {
       OpmUtil.buildOrgIdNameExtInfo(this.fullId, this.fullName, this.attributes);
       String psmId = (String)ClassHelper.convert(this.attributes.get("psmId"), String.class);
       if (!StringUtil.isBlank(psmId)) {
         String personId = OpmUtil.getPersonIdFromPersonMemberId(psmId);
         this.attributes.put("personId", personId);
         this.attributes.put("personName", this.attributes.get("psmName"));
       }
       this.isBuildAttribute = true;
     }
     return this.attributes.get(key);
   }
 
   public String toString() {
     return "(" + this.fullId + "," + this.fullName + ")@OrgUnit";
   }
 }

