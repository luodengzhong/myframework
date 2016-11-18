 package com.brc.system.opm.action;
 
 import com.brc.client.action.base.CommonAction;
 import com.brc.system.ValidStatus;
 import com.brc.system.opm.Operator;
 import com.brc.system.opm.service.AgentService;
 import com.brc.system.util.CommonUtil;
 import com.brc.util.SDO;
 import java.util.Map;
 
 public class AgentAction extends CommonAction
 {
   private static final long serialVersionUID = 1L;
   private static final String AGENT_PAGE = "Agent";
   private static final String AGENT_DETAIL_PAGE = "AgentDetail";
   private AgentService agentService;
 
   public void setAgentService(AgentService agentService)
   {
     this.agentService = agentService;
   }
 
   protected String getPagePath()
   {
     return "/system/opm/agent/";
   }
 
   public String forwardAgent() {
     return forward("Agent");
   }
 
   public String showInsertAgent() {
     SDO params = getSDO();
     try {
       Operator opr = getOperator();
 
       params.putProperty("creatorId", opr.getPersonMemberId());
       params.putProperty("creatorName", opr.getName());
       params.putProperty("createDate", CommonUtil.getCurrentDateTime());
 
       params.putProperty("orgId", opr.getPersonMemberId());
       params.putProperty("orgName", opr.getName());
       params.putProperty("orgFullId", opr.getFullId());
       params.putProperty("orgFullName", opr.getFullName());
       params.putProperty("status", Integer.valueOf(ValidStatus.ENABLED.getId()));
 
       return forward("AgentDetail", params);
     } catch (Exception e) {
       return error(e);
     }
   }
 
   public String showUpdateAgent() {
     SDO params = getSDO();
     try {
       Long id = (Long)params.getProperty("id", Long.class);
       Map data = this.agentService.loadAgent(id);
       return forward("AgentDetail", data);
     } catch (Exception e) {
       return errorPage(e.getMessage());
     }
   }
 
   public String insertAgent() {
     SDO params = getSDO();
     try {
       this.agentService.insertAgent(params);
       return success();
     } catch (Exception e) {
       return error(e);
     }
   }
 
   public String updateAgent() {
     SDO params = getSDO();
     try {
       this.agentService.updateAgent(params);
       return success();
     } catch (Exception e) {
       return error(e);
     }
   }
 
   public String deleteAgent() {
     SDO params = getSDO();
     try {
       Long[] ids = params.getLongArray("ids");
       this.agentService.deleteAgent(ids);
       return success();
     } catch (Exception e) {
       return error(e);
     }
   }
 
   public String slicedQueryAgents() {
     SDO params = getSDO();
     try {
       Map data = this.agentService.slicedQueryAgents(params);
       return toResult(data);
     } catch (Exception e) {
       return error(e);
     }
   }
 
   public String slicedQueryAgentProcs() {
     SDO params = getSDO();
     try {
       Map data = this.agentService.slicedQueryAgentProcs(params);
       return toResult(data);
     } catch (Exception e) {
       return error(e);
     }
   }
 
   public String deleteAgentProc() {
     SDO params = getSDO();
     try {
       Long[] ids = params.getLongArray("ids");
       this.agentService.deleteAgentProc(ids);
       return success();
     } catch (Exception e) {
       return error(e);
     }
   }
 }

