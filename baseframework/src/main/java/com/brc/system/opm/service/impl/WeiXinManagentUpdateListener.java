 package com.brc.system.opm.service.impl;
 
 import com.brc.system.data.EntityParserDao;
 import com.brc.system.opm.ManagmentEvent;
 import com.brc.system.opm.domain.BizManagementType;
 import com.brc.system.opm.service.ManagementService;
 import com.brc.system.share.service.ServiceUtil;
 import com.brc.util.LogHome;
 import java.util.List;
 import me.chanjar.weixin.common.exception.WxErrorException;
 import me.chanjar.weixin.cp.api.WxCpService;
 import org.apache.log4j.Logger;
 import org.springframework.context.ApplicationListener;
 
 public class WeiXinManagentUpdateListener
   implements ApplicationListener<ManagmentEvent>
 {
   private static Logger LOGGER = LogHome.getLog(WeiXinManagentUpdateListener.class);
 
   private static String STATISTICAL_ANALYSIS_TAG_ID = "1";
 
   private static String BIZ_MANAGEMENT_TYPE_STATISTICS = "statistics";
   private WxCpService wxCpService;
   private ServiceUtil serviceUtil;
 
   public void setWxCpService(WxCpService wxCpService)
   {
     this.wxCpService = wxCpService;
   }
 
   public void setServiceUtil(ServiceUtil serviceUtil) {
     this.serviceUtil = serviceUtil;
   }
 
   public void onApplicationEvent(ManagmentEvent event)
   {
     StringBuilder sb;
     switch (event.getEventKind().ordinal()) {
     case 1:
       String[] managerIds = event.getManagerIds();
       if ((managerIds == null) || (managerIds.length == 0)) {
         return;
       }
 
       Long manageTypeId = event.getManageTypeId();
       if (manageTypeId == null) {
         return;
       }
 
       ManagementService managementService = (ManagementService)event.getSource();
       BizManagementType bizManagementType = managementService.loadBizManagementTypeObject(manageTypeId);
       if (bizManagementType == null) {
         return;
       }
       if (!BIZ_MANAGEMENT_TYPE_STATISTICS.equalsIgnoreCase(bizManagementType.getCode())) {
         return;
       }
 
       sb = new StringBuilder();
       sb.append("select distinct p.login_name");
       sb.append("  from sa_oporg pt, sa_oporg c, sa_opperson p");
       sb.append(" where pt.id = ?");
       sb.append("   and c.full_id like pt.full_id || '%'");
       sb.append("   and c.org_kind_id = 'psm'");
       sb.append("   and pt.status = 1");
       sb.append("   and c.status = 1");
       sb.append("   and c.person_id = p.id");
       sb.append("   and p.status = 1");
       sb.append("   and p.is_operator = 1");
       sb.append("   and nvl(p.is_hidden, 0) = 0");
 
       for (String id : managerIds) {
         List userIds = this.serviceUtil.getEntityDao().queryToList(sb.toString(), String.class, new Object[] { id });
         try {
           this.wxCpService.tagAddUsers(STATISTICAL_ANALYSIS_TAG_ID, userIds, null);
         } catch (WxErrorException e) {
           LOGGER.error(e.getMessage(), e);
         }
       }
 
       break;
     case 2:
       Long[] ids = event.getManagmentIds();
       if ((ids == null) || (ids.length == 0)) {
         return;
       }
 
       sb = new StringBuilder();
       sb.append("select p.login_name");
       sb.append("  from sa_opbizmanagement pt, sa_opbizmanagementtype bt,sa_oporg c, sa_opperson p");
       sb.append(" where pt.id = ?");
       sb.append(" and pt.manage_type_id = bt.id");
       sb.append("   and bt.code = ?");
       sb.append("   and c.full_id like pt.org_full_id || '%'");
       sb.append("   and c.org_kind_id = 'psm'");
       sb.append("   and c.person_id = p.id");
 
       for (Long id : ids) {
         List userIds = this.serviceUtil.getEntityDao().queryToList(sb.toString(), String.class, new Object[] { id, BIZ_MANAGEMENT_TYPE_STATISTICS });
         if (userIds.size() > 0)
           try {
             this.wxCpService.tagRemoveUsers(STATISTICAL_ANALYSIS_TAG_ID, userIds);
           } catch (WxErrorException e) {
             LOGGER.error(e.getMessage(), e);
           }
       }
     }
   }
 }

