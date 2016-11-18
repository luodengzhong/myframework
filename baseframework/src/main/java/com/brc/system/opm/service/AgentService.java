package com.brc.system.opm.service;

import com.brc.system.opm.domain.Agent;
import com.brc.util.SDO;
import java.util.Map;

public abstract interface AgentService
{
  public static final String AGENT_ENTITY = "agent";
  public static final String AGENT_PROC_ENTITY = "agentProc";
  public static final String MODEL_FILE_NAME = "config/domain/com/brc/system/opm/agent.xml";

  public abstract Long insertAgent(SDO paramSDO);

  public abstract void updateAgent(SDO paramSDO);

  public abstract void deleteAgent(Long[] paramArrayOfLong);

  public abstract Map<String, Object> loadAgent(Long paramLong);

  public abstract Agent loadAgentObject(Long paramLong);

  public abstract Map<String, Object> slicedQueryAgents(SDO paramSDO);

  public abstract Map<String, Object> slicedQueryAgentProcs(SDO paramSDO);

  public abstract void deleteAgentProc(Long[] paramArrayOfLong);

  public abstract Agent loadValidAgent(String paramString);
}

