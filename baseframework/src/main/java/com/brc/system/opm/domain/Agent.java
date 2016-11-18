 package com.brc.system.opm.domain;
 
 import com.brc.exception.ApplicationException;
 import java.util.Date;
 import java.util.List;
 
 public class Agent
 {
   private long id;
   private String orgId;
   private String orgName;
   private String orgFullId;
   private String orgFullName;
   private String agentId;
   private String agentName;
   private int procAgentKindId;
   private Date startDate;
   private Date finishDate;
   private String creatorId;
   private String creatorName;
   private String createDate;
   private int canTranAgent;
   private int status;
   private Long version;
   private List<AgentProc> agentProcs;
 
   public long getId()
   {
     return this.id;
   }
 
   public void setId(long id) {
     this.id = id;
   }
 
   public String getOrgId() {
     return this.orgId;
   }
 
   public void setOrgId(String orgId) {
     this.orgId = orgId;
   }
 
   public String getOrgName() {
     return this.orgName;
   }
 
   public void setOrgName(String orgName) {
     this.orgName = orgName;
   }
 
   public String getOrgFullId() {
     return this.orgFullId;
   }
 
   public void setOrgFullId(String orgFullId) {
     this.orgFullId = orgFullId;
   }
 
   public String getOrgFullName() {
     return this.orgFullName;
   }
 
   public void setOrgFullName(String orgFullName) {
     this.orgFullName = orgFullName;
   }
 
   public String getAgentId() {
     return this.agentId;
   }
 
   public void setAgentId(String agentId) {
     this.agentId = agentId;
   }
 
   public String getAgentName() {
     return this.agentName;
   }
 
   public int getProcAgentKindId() {
     return this.procAgentKindId;
   }
 
   public void setProcAgentKindId(int procAgentKindId) {
     this.procAgentKindId = procAgentKindId;
   }
 
   public void setAgentName(String agentName) {
     this.agentName = agentName;
   }
 
   public Date getStartDate() {
     return this.startDate;
   }
 
   public void setStartDate(Date startDate) {
     this.startDate = startDate;
   }
 
   public Date getFinishDate() {
     return this.finishDate;
   }
 
   public void setFinishDate(Date finishDate) {
     this.finishDate = finishDate;
   }
 
   public String getCreatorId() {
     return this.creatorId;
   }
 
   public void setCreatorId(String creatorId) {
     this.creatorId = creatorId;
   }
 
   public String getCreatorName() {
     return this.creatorName;
   }
 
   public void setCreatorName(String creatorName) {
     this.creatorName = creatorName;
   }
 
   public String getCreateDate() {
     return this.createDate;
   }
 
   public void setCreateDate(String createDate) {
     this.createDate = createDate;
   }
 
   public int getCanTranAgent() {
     return this.canTranAgent;
   }
 
   public void setCanTranAgent(int canTranAgent) {
     this.canTranAgent = canTranAgent;
   }
 
   public int getStatus() {
     return this.status;
   }
 
   public void setStatus(int status) {
     this.status = status;
   }
 
   public Long getVersion() {
     return this.version;
   }
 
   public void setVersion(Long version) {
     this.version = version;
   }
 
   public ProcAgentKind getProcAgentKind() {
     return ProcAgentKind.fromId(this.procAgentKindId);
   }
 
   public boolean contains(String ProcessDefinitionId)
   {
     boolean result = false;
     for (AgentProc agentProc : this.agentProcs) {
       if (agentProc.isSpecifiedProc(ProcessDefinitionId)) {
         result = true;
         break;
       }
     }
     return result;
   }
 
   public List<AgentProc> getAgentProcs()
   {
     return this.agentProcs;
   }
 
   public void setAgentProcs(List<AgentProc> agentProc) {
     this.agentProcs = agentProc;
   }
 
   public static enum ProcAgentKind
   {
     ALL(1, "全部"), CUSTOM(2, "自定义");
 
     private final int id;
     private final String displayName;
 
     private ProcAgentKind(int id, String displayName) { this.id = id;
       this.displayName = displayName; }
 
     public int getId()
     {
       return this.id;
     }
 
     public String getDisplayName() {
       return this.displayName;
     }
 
     public static ProcAgentKind fromId(int id) {
       switch (id) {
       case 1:
         return ALL;
       case 2:
         return CUSTOM;
       }
       throw new ApplicationException(String.format("无效的流程代理方式“%s”！", new Object[] { Integer.valueOf(id) }));
     }
   }
 }

