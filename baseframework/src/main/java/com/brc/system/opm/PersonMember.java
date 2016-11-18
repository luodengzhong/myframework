 package com.brc.system.opm;
 
 import com.brc.system.opm.domain.Management;
 import com.brc.system.util.Util;
 import java.io.Serializable;
 import java.util.ArrayList;
 import java.util.Collections;
 import java.util.HashMap;
 import java.util.List;
 
 public class PersonMember extends OrgNode
   implements Serializable
 {
   private static final long serialVersionUID = -8669681671148390563L;
   protected HashMap<String, List<Management>> managements = new HashMap();
 
   protected Person owner = null;
 
   protected String agentProcess = null;
 
   public PersonMember(Person person, String id, String name, String code, String fullId, String fullName, String fullCode) {
     super(id, name, code, fullId, fullName, fullCode, "psm");
     this.owner = person;
   }
 
   public PersonMember(String id, String name, String code, String fullId, String fullName, String fullCode) {
     super(id, name, code, fullId, fullName, fullCode, "psm");
   }
 
   public Person getPerson()
   {
     return this.owner;
   }
 
   public OrgNode getPosition()
   {
     for (Object parent = this; parent != null; parent = ((OrgNode)parent).getParent())
       if ("pos".equals(((OrgNode)parent).getType())) return (OrgNode)parent;
     return null;
   }
 
   public OrgNode getDept()
   {
     for (Object parent = this; parent != null; parent = ((OrgNode)parent).getParent())
       if ("dpt".equals(((OrgNode)parent).getType())) return (OrgNode)parent;
     return null;
   }
 
   public OrgNode getOrgn()
   {
     for (Object parent = this; parent != null; parent = ((OrgNode)parent).getParent())
       if ("ogn".equals(((OrgNode)parent).getType())) return (OrgNode)parent;
     return null;
   }
 
   public OrgNode getOrg() {
     return getParent();
   }
 
   List<Management> getManagements(String key) {
     if (this.managements.containsKey(key)) return Collections.unmodifiableList((List)this.managements.get(key));
     return Collections.emptyList();
   }
 
   public String getAgentProcess() {
     return this.agentProcess;
   }
 
   void addManagement(Management management) {
     Util.check(management != null, "添加的管理权限不能为空！");
     List list = (List)this.managements.get(management.getCode());
     if (list == null) {
       list = new ArrayList();
       this.managements.put(management.getCode(), list);
     }
     list.add(management);
   }
 }

