 package com.brc.client.service.impl;
 
 import com.brc.client.service.HomePageService;
 import com.brc.exception.ApplicationException;
 import com.brc.model.fn.impl.OrgFun;
 import com.brc.system.data.impl.SQLServerJDBCDaoImpl;
 import com.brc.system.opm.Operator;
 import com.brc.system.opm.OrgUnit;
 import com.brc.system.opm.Person;
 import com.brc.system.opm.domain.Org;
 import com.brc.system.opm.service.OrgService;
 import com.brc.util.ClassHelper;
 import com.brc.util.DateUtil;
 import com.brc.util.SDO;
 import java.text.SimpleDateFormat;
 import java.util.ArrayList;
 import java.util.Date;
 import java.util.HashMap;
 import java.util.Iterator;
 import java.util.List;
 import java.util.Map;
 import org.springframework.jdbc.core.JdbcTemplate;
 import org.springframework.jdbc.core.SqlParameter;
 
 
 
 public class HomePageServiceImpl
   implements HomePageService
 {
   private SQLServerJDBCDaoImpl amsJDBCDaoImpl;
   private SQLServerJDBCDaoImpl erpJDBCDaoImpl;
   private JdbcTemplate whJDBCTemplate;
   private OrgService orgService;
   private OrgFun orgFun;
   protected static final String GROUP_FULL_ID = "/C232482A7AEA42C0B53A7AE628A9B7E2.ogn";
   
   public void setErpJDBCDaoImpl(SQLServerJDBCDaoImpl erpJDBCDaoImpl)
   {
     this.erpJDBCDaoImpl = erpJDBCDaoImpl;
   }
   
   public void setAmsJDBCDaoImpl(SQLServerJDBCDaoImpl amsJDBCDaoImpl) {
     this.amsJDBCDaoImpl = amsJDBCDaoImpl;
   }
   
   public void setWhJDBCTemplate(JdbcTemplate whJDBCTemplate) {
     this.whJDBCTemplate = whJDBCTemplate;
   }
   
   public void setOrgService(OrgService orgService) {
     this.orgService = orgService;
   }
   
   public void setOrgFun(OrgFun orgFun) {
     this.orgFun = orgFun;
   }
   //页面调用已注释
   public Map<String, Object> queryOtherSystemTasks(SDO sdo)
   {
     String userId = sdo.getOperator().getLoginPerson().getLoginName();
     
     String sql = "select sm.ID,sm.dayTime as day_time,sm.USERID as user_id,sm.TYPE,sm.USERID1 as user_id1,sm.URL,sm.STATE,sm.TITILE,sm.FQR from S_MIDAPPROVEINFO sm where upper(sm.USERID1) = '" + userId.toUpperCase() + "'";
     
     final List<Map<String, Object>> amsSystemList = amsJDBCDaoImpl.queryToListMap(sql, new Object[0]);
     
     List<SqlParameter> erpQueryParam = new ArrayList();
     SqlParameter sqlParameter = new SqlParameter(12);
     erpQueryParam.add(sqlParameter);
     List<Map<String, Object>> erpSystemList = (List)erpJDBCDaoImpl.call("{call cd_usp_GetDqrTaskWake(?)}", erpQueryParam, new Object[] { userId }).get("#result-set-1");
     
 
     if ((erpSystemList != null) && (erpSystemList.size() > 0)) {
       for (Map<String, Object> erpToDo : erpSystemList) {
         Map<String, Object> erpToDoTmp = new HashMap();
         erpToDoTmp.put("kindName", "明源系统");
         erpToDoTmp.put("url", erpToDo.get("页面地址"));
         erpToDoTmp.put("title", erpToDo.get("标题"));
         erpToDoTmp.put("dayTime", erpToDo.get("激活时间"));
         erpToDoTmp.put("name", erpToDo.get("发起人名称"));
         amsSystemList.add(erpToDoTmp);
       }
     }
return new HashMap()
     {
       private static final long serialVersionUID = -8759168721026896699L;
     };   }
   
 
 
 
 
 
 
 
 
 
 
 
 
   private String a(Date date)
   {
     SimpleDateFormat sdf = new SimpleDateFormat("yy");
     
     if (sdf.format(date).equals("14")) {
       return "PKG_STTS_FOR_WEIXIN";
     }
     return "PKG_STTS_FOR_WEIXIN_" + sdf.format(date);
   }
   
   private List<OrgUnit> a(String loginName, String manageType)
   {
     List<Org> orgs = orgService.loadOrgListByLoginName(loginName);
     if (orgs.size() == 0) {
       return null;
     }
     List<String> orgFullIds = new ArrayList(orgs.size());
     for (Org org : orgs) {
       orgFullIds.add(org.getFullId());
     }
     
     List<OrgUnit> subordinations = orgFun.findSubordinationsByOrgManageType(orgFullIds, manageType);
     return subordinations;
   }
   
 
 
 
 
 
   protected boolean assertReportAuthorityGranted(List<OrgUnit> subordinations)
   {
     boolean granted = false;
     for (OrgUnit ou : subordinations) {
       if (ou.getFullId().equals("/C232482A7AEA42C0B53A7AE628A9B7E2.ogn")) {
         granted = true;
         break;
       }
     }
     return granted;
   }
   
 
 
 
 
 
 
 
   protected Map<String, Object> assertReportAuthorityCompany(List<OrgUnit> subordinations, String orgFullId)
   {
     List<Map<String, Object>> companyList = a();
     List<Map<String, Object>> newCompanyList = new ArrayList();
     for (Iterator i$ = companyList.iterator(); i$.hasNext();) { Map<String,Object> company = (Map)i$.next();
       String fullId = company.get("FULL_ID").toString();
       for (OrgUnit ou : subordinations)
       {
         if (ou.getFullId().equals(fullId)) {
           if (orgFullId.equals(fullId)) {
             return company;
           }
           newCompanyList.add(company);
           break;
         } } }
     Map<String, Object> company;
     String fullId;
     if (newCompanyList.size() > 0) {
       return (Map)newCompanyList.get(0);
     }
     return null;
   }
   
   private List<Map<String, Object>> a() {
     StringBuffer sb = new StringBuffer();
     sb.append("select c.comp_id,");
     sb.append("       c.comp_code,");
     sb.append("       c.comp_name,");
     sb.append("       c.xt_comp_id   as full_id,");
     sb.append("       c.xt_comp_name as name,");
     sb.append("       c.sequence");
     sb.append("  from company c");
     sb.append(" where c.kind_id = 1");
     sb.append(" order by c.sequence");
     List<Map<String, Object>> companyList = whJDBCTemplate.queryForList(sb.toString());
     return companyList;
   }
   
 
 
 
 
  //从数据仓库查询销售报表数据 页面调用已注释
   public Map<String, Object> querySaleReportForWh(SDO sdo)
   {
     String loginName = sdo.getOperator().getLoginName();
     String personId = sdo.getOperator().getId();
     
     String orgId = sdo.getOperator().getOrgId();
     Map<String, Object> orgMap = orgService.loadOrg(orgId);
     String orgFullId = (String)ClassHelper.convert(orgMap.get("fullId"), String.class);
     List<OrgUnit> subordinations = a(loginName, "statistics");
     Date date = DateUtil.getStepDay(new Date(), -1);
     if ((subordinations == null) || (subordinations.size() == 0)) {
       throw new ApplicationException("没有访问权限!");
     }
     Map<String, Object> map = new HashMap();
     if (assertReportAuthorityGranted(subordinations)) {
       List<Map<String, Object>> saleDatas = queryGroupReportData(loginName, date);
       Map<String, Object> resourceDatas = b(loginName, date);
       map.put("name", "集团");
       map.put("saleDatas", saleDatas);
       map.put("resourceDatas", resourceDatas);
     } else {
       Map<String, Object> company = assertReportAuthorityCompany(subordinations, orgFullId);
       if ((company == null) || (company.size() == 0)) {
         throw new ApplicationException("没有访问权限!");
       }
       map.put("name", company.get("COMP_NAME"));
       String companyId = company.get("COMP_ID").toString();
       List<Map<String, Object>> saleDatas = a(companyId, loginName, date);
       Map<String, Object> resourceDatas = b(companyId, loginName, date);
       map.put("saleDatas", saleDatas);
       map.put("resourceDatas", resourceDatas);
     }
     String lastTime = b();
     map.put("lastTime", lastTime);
     return map;
   }
   
   private String b() {
     SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm");
     String sql = "SELECT * FROM T_EXTRACT_TIMESTAMP ORDER BY LAST_TIME DESC";
     Map<String, Object> obj = (Map)whJDBCTemplate.queryForList(sql).get(0);
     return sdf.format(obj.get("LAST_TIME"));
   }
   
 
 
 
 
 
 
   public List<Map<String, Object>> queryGroupReportData(String userName, Date date)
   {
     SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
     String dateString = sdf.format(date);
     String sql = "CALL " + a(date) + ".P_STTS_DAY_SALES_FOR_GROUP(?,?)";
     
     whJDBCTemplate.update(sql, new Object[] { userName, dateString }, new int[] { 12, 91 });
     
     sql = "SELECT * FROM T_DAY_SALES_FOR_WEIXIN T WHERE T.COMP_NAME = '总部' AND CACHE_NO='" + dateString + "_group' ORDER BY ITEM_SORT_ID ";
     return whJDBCTemplate.queryForList(sql);
   }
   
 
 
 
 
 
 
 
   private List<Map<String, Object>> a(String companyId, String userName, Date date)
   {
     SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
     String dateString = sdf.format(date);
     String sql = "CALL " + a(date) + ".P_STTS_DAY_SALES_FOR_COMP(?,?)";
     String cacheType = "_comp";
     if (companyId.equals("00000")) {
       cacheType = "_tpre";
       sql = "CALL " + a(date) + ".P_STTS_DAY_SALES_FOR_TPRE(?,?)";
     }
     
     whJDBCTemplate.update(sql, new Object[] { userName, dateString }, new int[] { 12, 91 });
     
     sql = "SELECT * FROM T_DAY_SALES_FOR_WEIXIN T WHERE T.COMP_ID = '" + companyId + "' AND SORT_ID=2 AND CACHE_NO='" + dateString + cacheType + "' ORDER BY ITEM_SORT_ID";
     
     return whJDBCTemplate.queryForList(sql);
   }
   
   private void a(String userName, Date date) {
     String sql = "CALL " + a(date) + ".P_STTS_RESOURCE_INVENTORY(?)";
     whJDBCTemplate.update(sql, new Object[] { userName }, new int[] { 12 });
   }
   
 
 
 
 
 
 
   private Map<String, Object> b(String userName, Date date)
   {
     a(userName, date);
     StringBuffer sb = new StringBuffer();
     sb.append("SELECT sum(t.resource_qty) as resource_qty,");
     sb.append("       sum(t.base_amount) as base_amount");
     sb.append("  FROM T_RESOURCE_INVENTORY t");
     sb.append(" WHERE t.SORT_ID = 3");
     sb.append("   AND t.CACHE_NO = 'P_STTS_RESOURCE_INVENTORY'");
     return whJDBCTemplate.queryForMap(sb.toString());
   }
   
 
 
 
 
 
 
 
   private Map<String, Object> b(String companyId, String userName, Date date)
   {
     a(userName, date);
     StringBuffer sb = new StringBuffer();
     sb.append("SELECT sum(t.resource_qty) as resource_qty,");
     sb.append("       sum(t.base_amount) as base_amount");
     sb.append("  FROM T_RESOURCE_INVENTORY t");
     sb.append(" WHERE t.SORT_ID = 2");
     sb.append("   AND t.COMP_ID = ''");
     sb.append("   AND t.CACHE_NO = 'P_STTS_RESOURCE_INVENTORY'");
     return whJDBCTemplate.queryForMap(sb.toString());
   }
 }

/* Location:           G:\Source\STSWorkspaces\mxt\WebContent\WEB-INF\lib\brc-system-1.0.0.jar
 * Qualified Name:     com.brc.client.service.impl.HomePageServiceImpl
 * Java Class Version: 7 (51.0)
 * JD-Core Version:    0.7.1
 */