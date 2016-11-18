 package com.brc.system.opm.service.impl;
 
 import com.brc.exception.ApplicationException;
 import com.brc.system.data.EntityParserDao;
 import com.brc.system.opm.Operator;
 import com.brc.system.opm.Person;
 import com.brc.system.opm.domain.Agent;
 import com.brc.system.opm.domain.Agent.ProcAgentKind;
 import com.brc.system.opm.domain.AgentProc;
 import com.brc.system.opm.service.AgentService;
 import com.brc.system.share.service.SQLQuery;
 import com.brc.system.share.service.ServiceUtil;
 import com.brc.system.util.CommonUtil;
 import com.brc.system.util.Util;
 import com.brc.util.QueryModel;
 import com.brc.util.SDO;
 import com.brc.util.ThreadLocalUtil;
import com.brc.xmlbean.EntityDocument;
 import com.brc.xmlbean.EntityDocument.Entity;
 import java.util.ArrayList;
 import java.util.Date;
 import java.util.HashMap;
 import java.util.Iterator;
 import java.util.List;
 import java.util.Map;
 
 public class AgentServiceImpl
   implements AgentService
 {
   private ServiceUtil serviceUtil;
 
   public void setServiceUtil(ServiceUtil serviceUtil)
   {
     this.serviceUtil = serviceUtil;
   }
 
   private EntityDocument.Entity getAgentEntity() {
     return this.serviceUtil.getEntity("config/domain/com/brc/system/opm/agent.xml", "agent");
   }
 
   private EntityDocument.Entity getAgentProcEntity() {
     return this.serviceUtil.getEntity("config/domain/com/brc/system/opm/agent.xml", "agentProc");
   }
 
   private void checkAgentConstraints(SDO params) {
     String orgId = (String)params.getProperty("orgId", String.class);
     String agentId = (String)params.getProperty("agentId", String.class);
 
     Util.check(Util.isNotEmptyString(agentId), "代理人不能为空。");
     Util.check(Util.isNotEmptyString(orgId), "委托人不能为空。");
     Util.check(!orgId.equalsIgnoreCase(agentId), "代理人和委托人不能相同。");
 
     Date startTime = (Date)params.getProperty("startDate", Date.class);
     Date finishTime = (Date)params.getProperty("finishDate", Date.class);
     Date createTime = (Date)params.getProperty("createDate", Date.class);
 
     Util.check(startTime.compareTo(finishTime) < 0, "代理开始时间不能大于结束时间。");
     Util.check(createTime.compareTo(startTime) < 0, "创建时间不能大于代理开始时间。");
   }
 
   private void deleteRepeatedAgentProc(List<Object> details)
   {
     if ((details == null) || (details.size() == 0)) {
       return;
     }
 
     for (int i = details.size() - 1; i >= 0; i--) {
       Map item = (Map)details.get(i);
       if (item.get("procId") != null) {
         for (int j = i - 1; j >= 0; j--) {
           Map currentItem = (Map)details.get(j);
           if (item.get("procId").equals(currentItem.get("procId")))
             details.remove(j);
         }
       }
       else
         details.remove(i);
     }
   }
 
   private void insertAgentProc(Long agentId, List<Object> details)
   {
     deleteRepeatedAgentProc(details);
     if ((details != null) && (details.size() > 0)) {
       List list = new ArrayList(details.size());
       for (Iterator i$ = details.iterator(); i$.hasNext(); ) { Object item = i$.next();
 
         Map m = (Map)item;
         m.put("agentId", agentId);
         list.add(m);
       }
       this.serviceUtil.getEntityDao().batchInsert(getAgentProcEntity(), list);
     }
   }
 
   public Long insertAgent(SDO params)
   {
     checkAgentConstraints(params);
 
     Long id = (Long)this.serviceUtil.getEntityDao().insert(getAgentEntity(), params.getProperties());
     List details = params.getList("detailData");
     deleteRepeatedAgentProc(details);
     insertAgentProc(id, details);
 
     return id;
   }
 
   public void updateAgent(SDO params)
   {
     checkAgentConstraints(params);
 
     Long id = (Long)params.getProperty("id", Long.class);
     Util.check(!CommonUtil.isLongNull(id), "ID为空。");
 
     Long[] ids = { id };
     checkCreator(ids, "修改");
     this.serviceUtil.getEntityDao().update(getAgentEntity(), params.getProperties(), new String[0]);
 
     Map deleteparams = new HashMap(1);
     deleteparams.put("agentId", id);
     this.serviceUtil.getEntityDao().deleteByCondition(getAgentProcEntity(), deleteparams);
 
     List details = params.getList("detailData");
     deleteRepeatedAgentProc(details);
     Integer procAgentKindId = (Integer)params.getProperty("procAgentKindId", Integer.class);
     if (procAgentKindId.equals(Integer.valueOf(Agent.ProcAgentKind.CUSTOM.getId())))
       insertAgentProc(id, details);
   }
 
   private void checkCreator(Long[] ids, String operateKind)
   {
     Operator operator = (Operator)ThreadLocalUtil.getVariable("operator", Operator.class);
 
     for (Long id : ids) {
       Agent agent = loadAgentObject(id);
       if ((agent != null) && 
         (!agent.getOrgId().contains(operator.getLoginPerson().getId())))
         throw new ApplicationException(String.format("您不能%s“%s”创建的代理。", new Object[] { operateKind, agent.getOrgName() }));
     }
   }
 
   public void deleteAgent(Long[] ids)
   {
     Map deleteParams = new HashMap(1);
 
     checkCreator(ids, "删除");
 
     for (Long id : ids) {
       deleteParams.put("agentId", id);
       this.serviceUtil.getEntityDao().deleteByCondition(getAgentProcEntity(), deleteParams);
     }
     this.serviceUtil.getEntityDao().deleteByIds(getAgentEntity(), ids);
   }
 
   public Agent loadAgentObject(Long id)
   {
     return (Agent)this.serviceUtil.getEntityDao().loadObjectById(getAgentEntity(), Agent.class, id);
   }
 
   public Map<String, Object> loadAgent(Long id)
   {
     return this.serviceUtil.getEntityDao().loadById(getAgentEntity(), id);
   }
 
   public Map<String, Object> slicedQueryAgents(SDO params)
   {
     String personId = params.getOperator().getLoginPerson().getId() + "%";
 
     QueryModel queryModel = this.serviceUtil.getEntityDao().getQueryModelByName(getAgentEntity(), "selectAgent", params.getProperties());
     queryModel.putParam("personId", personId);
     queryModel.putParam("agentPersonId", personId);
     return this.serviceUtil.getSQLQuery().executeSlicedQuery(queryModel, params);
   }
 
   public Map<String, Object> slicedQueryAgentProcs(SDO params)
   {
     QueryModel queryModel = this.serviceUtil.getEntityDao().getQueryModel(getAgentProcEntity(), params.getProperties());
     return this.serviceUtil.getSQLQuery().executeSlicedQuery(queryModel, params);
   }
 
   public void deleteAgentProc(Long[] ids)
   {
     this.serviceUtil.getEntityDao().deleteByIds(getAgentProcEntity(), ids);
   }
 
   public Agent loadValidAgent(String orgId)
   {
     String sql = this.serviceUtil.getEntityDao().getSqlByName(getAgentEntity(), "loadValidAgent");
     Agent agent = (Agent)this.serviceUtil.getEntityDao().queryToObject(sql, Agent.class, new Object[] { orgId });
     if ((agent != null) && (agent.getProcAgentKind() == Agent.ProcAgentKind.CUSTOM))
     {
       StringBuilder sb = new StringBuilder();
 
       sb.append("select ap.id, ap.agent_id, ap.version, d.key proc_id");
       sb.append(" from SA_OPAgentProc ap, act_re_procdef_tree d, act_re_procdef_tree p");
       sb.append(" where ap.agent_id = ?");
       sb.append(" and ap.proc_id = p.re_procdef_tree_id");
       sb.append(" and d.full_id like p.full_id || '%'");
       sb.append(" and d.node_kind_id = 'proc'");
 
       List agentProcs = this.serviceUtil.getEntityDao().queryToList(sb.toString(), AgentProc.class, new Object[] { Long.valueOf(agent.getId()) });
       agent.setAgentProcs(agentProcs);
     }
     return agent;
   }
 }

