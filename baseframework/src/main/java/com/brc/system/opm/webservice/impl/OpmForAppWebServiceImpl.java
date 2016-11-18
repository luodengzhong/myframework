 package com.brc.system.opm.webservice.impl;
 
 import com.brc.system.opm.service.OrgService;
 import com.brc.system.opm.webservice.OpmForAppWebService;
 import com.brc.system.webservice.WebServiceForAppBase;
 import com.brc.util.SDO;
 import java.util.Map;
 import javax.jws.WebService;
 
 @WebService(serviceName="opmForAppWebService", endpointInterface="com.brc.system.opm.webservice.OpmForAppWebService")
 public class OpmForAppWebServiceImpl extends WebServiceForAppBase
   implements OpmForAppWebService
 {
   private OrgService orgService;
 
   public void setOrgService(OrgService orgService)
   {
     this.orgService = orgService;
   }
 
   public String queryDeltaOrg(String params)
   {
     SDO sdo = getSDO(params);
     Long version = (Long)sdo.getProperty("version", Long.class);
     try {
       Map data = this.orgService.queryDeltaOrg(version);
       return toResult(data);
     } catch (Exception e) {
       return error(e);
     }
   }
 
   public String slicedQueryDeltaOrg(String params)
   {
     SDO sdo = getSDO(params);
     try {
       Map data = this.orgService.slicedQueryDeltaOrg(sdo);
       return toResult(data);
     } catch (Exception e) {
       return error(e);
     }
   }
 
   public String queryDeltaPerson(String params)
   {
     SDO sdo = getSDO(params);
     Long version = (Long)sdo.getProperty("version", Long.class);
     try {
       Map data = this.orgService.queryDeltaPerson(version);
       return toResult(data);
     } catch (Exception e) {
       return error(e);
     }
   }
 
   public String slicedQueryDeltaPerson(String params)
   {
     SDO sdo = getSDO(params);
     try {
       Map data = this.orgService.slicedQueryDeltaPerson(sdo);
       return toResult(data);
     } catch (Exception e) {
       return error(e);
     }
   }
 
   public String updatePersonContactInfo(String params)
   {
     SDO sdo = getSDO(params);
     try {
       this.orgService.updatePersonContactInfo(sdo);
       return success();
     } catch (Exception e) {
       return error(e);
     }
   }
 }

