 package com.brc.biz.common;
 
 import com.brc.exception.ApplicationException;
 import com.brc.model.fn.impl.OrgFun;
 import com.brc.system.opm.OrgUnit;
 import java.util.HashMap;
 import java.util.List;
 import java.util.Map;
 import javax.annotation.Resource;
 import org.springframework.stereotype.Service;
 
 @Service("manageAuthorityCommon")
 public class ManageAuthorityCommonImpl
   implements ManageAuthorityCommon
 {
 
   @Resource
   private OrgFun orgFun;
 
   public Map<String, Object> queryManageAuthorityByOrganAndManageType(String organId, String manageType)
   {
     Map v = new HashMap();
     List<OrgUnit> m = this.orgFun.findManagers(organId, manageType, false, null);
     List personMembers = null;
 
     if (m.size() < 1) {
       throw new ApplicationException("在系统用户中未找到权限" + manageType);
     }
     for (OrgUnit ou : m) {
       personMembers = this.orgFun.findPersonMembersInOrg(ou.getFullId(), true);
       if ((personMembers != null) && (personMembers.size() > 0)) {
         break;
       }
     }
     if ((personMembers == null) || (personMembers.size() == 0)) {
       throw new ApplicationException("在系统用户中未找到权限" + manageType);
     }
 
     v.put("fullId", ((OrgUnit)personMembers.get(0)).getFullId());
     v.put("fullName", ((OrgUnit)personMembers.get(0)).getFullName());
     return v;
   }
 }

