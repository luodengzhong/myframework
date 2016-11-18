 package com.brc.system.opm.domain;
 
 public class AgentProc
 {
   private long agentId;
   private long id;
   private String procId;
   private long version;
 
   public long getAgentId()
   {
     return this.agentId;
   }
 
   public void setAgentId(long agentId) {
     this.agentId = agentId;
   }
 
   public long getId() {
     return this.id;
   }
 
   public void setId(long id) {
     this.id = id;
   }
 
   public String getProcId() {
     return this.procId;
   }
 
   public void setProcId(String procId) {
     this.procId = procId;
   }
 
   public long getVersion() {
     return this.version;
   }
 
   public void setVersion(long version) {
     this.version = version;
   }
 
   public boolean isSpecifiedProc(String ProcessDefinitionId) {
     String[] splits = ProcessDefinitionId.split(":");
     return this.procId.equals(splits[0]);
   }
 }

