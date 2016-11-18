 package com.brc.system.opm.webservice.impl;
 
 import com.brc.model.fn.impl.OrgFun;
 import com.brc.system.opm.domain.Org;
 import com.brc.system.opm.service.OrgService;
 import com.brc.system.opm.webservice.OpmWebService;
 import com.brc.util.JSONParseConfig;
 import java.util.ArrayList;
 import java.util.List;
 import javax.jws.WebService;
 import net.sf.json.JSONArray;
 
 @WebService(serviceName="opmWebService", endpointInterface="com.brc.system.opm.webservice.OpmWebService")
 public class OpmWebServiceImpl
   implements OpmWebService
 {
   private OrgService orgService;
   private OrgFun orgFun;
 
   public void setOrgService(OrgService orgService)
   {
     this.orgService = orgService;
   }
 
   public void setOrgFun(OrgFun orgFun) {
     this.orgFun = orgFun;
   }
 
   public String findSubordinationsByLoginName(String loginName, String manageType)
   {
     List<Org> orgs = this.orgService.loadOrgListByLoginName(loginName);
     if (orgs.size() == 0) {
       return null;
     }
     List orgFullIds = new ArrayList(orgs.size());
     for (Org org : orgs) {
       orgFullIds.add(org.getFullId());
     }
 
     List subordinations = this.orgFun.findSubordinationsByOrgManageType(orgFullIds, manageType);
 
     JSONArray jsonArray = JSONArray.fromObject(subordinations, JSONParseConfig.jc);
     return jsonArray.toString();
   }
 }

