 package com.brc.system.opm;
 
 import com.brc.system.util.CommonUtil;
 import com.brc.system.util.Util;
 import java.io.Serializable;
 import java.util.ArrayList;
 import java.util.Collections;
 import java.util.Iterator;
 import java.util.List;
 
 public class OrgNode extends OrgUnit
   implements Serializable
 {
   private static final long serialVersionUID = 8465574914802539992L;
   public static final String PERSONMEMBER = "psm";
   public static final String POSITION = "pos";
   public static final String DEPT = "dpt";
   public static final String CENTER = "ctr";
   public static final String ORGAN = "ogn";
   public static final String FOLDER = "fld";
   public static final String PROJECT = "prj";
   public static final String GROUP = "grp";
   public static final String SALE_TEAM = "stm";
   public static final String FUNCTION = "fun";
   private String id = null;
 
   private String name = null;
 
   private String code = null;
 
   private String fullCode = null;
 
   private String type = null;
 
   private OrgNode parent = null;
 
   private List<OrgNode> children = new ArrayList();
 
   private boolean isRoot = false;
 
   public static OrgNode createOrgNode(String id, String name, String code, String fullId, String fullName, String fullCode, String type)
   {
     Util.check(("psm".equals(type)) || ("pos".equals(type)) || ("dpt".equals(type)) || ("ogn".equals(type)) || ("grp".equals(type)), "创建OrgUnit类型不支持，", type);
 
     if ("psm".equals(type)) {
       return new PersonMember(id, name, code, fullId, fullName, fullCode);
     }
     return new OrgNode(id, name, code, fullId, fullName, fullCode, type);
   }
 
   public static OrgNode createOrgNode(String fullId, String fullName, String fullCode, String type)
   {
     Util.check(("psm".equals(type)) || ("pos".equals(type)) || ("dpt".equals(type)) || ("ogn".equals(type)) || ("grp".equals(type)), "创建OrgUnit类型不支持，", type);
 
     if ("psm".equals(type)) {
       return new PersonMember(CommonUtil.getNameNoExtOfFile(fullId), CommonUtil.getNameOfFile(fullName), CommonUtil.getNameOfFile(fullCode), fullId, fullName, fullCode);
     }
 
     return new OrgNode(CommonUtil.getNameNoExtOfFile(fullId), CommonUtil.getNameOfFile(fullName), CommonUtil.getNameOfFile(fullCode), fullId, fullName, fullCode, type);
   }
 
   public static OrgNode createRoot()
   {
     OrgNode orgNode = new OrgNode();
     orgNode.isRoot = true;
     return orgNode;
   }
 
   public static OrgNode createWorkGroup(String id, String name, String code, String fullId, String fullName, String fullCode)
   {
     return new OrgNode(id, name, code, fullId, fullName, fullCode, "grp");
   }
 
   public static OrgNode createOrgan(String id, String name, String code, String fullId, String fullName, String fullCode)
   {
     return new OrgNode(id, name, code, fullId, fullName, fullCode, "ogn");
   }
 
   public static PersonMember createPersonMember(String id, String name, String code, String fullId, String fullName, String fullCode)
   {
     return new PersonMember(id, name, code, fullId, fullName, fullCode);
   }
 
   public static OrgNode createDept(String id, String name, String code, String fullId, String fullName, String fullCode)
   {
     return new OrgNode(id, name, code, fullId, fullName, fullCode, "dpt");
   }
 
   public static OrgNode createPosition(String id, String name, String code, String fullId, String fullName, String fullCode)
   {
     return new OrgNode(id, name, code, fullId, fullName, fullCode, "pos");
   }
 
   public OrgNode(String id, String name, String code, String fullId, String fullName, String fullCode, String type)
   {
     super(fullId, fullName);
     this.id = id;
     this.name = name;
     this.type = type;
     this.code = code;
     this.fullCode = fullCode;
   }
 
   private OrgNode() {
     super("/", "/");
   }
 
   public String getName()
   {
     return this.name;
   }
 
   public String getCode()
   {
     return this.code;
   }
 
   public String getId()
   {
     return this.id;
   }
 
   public String getType()
   {
     return this.type;
   }
 
   public OrgNode getParent()
   {
     return this.parent;
   }
 
   public void addChildren(OrgNode child)
   {
     if (Util.isNotNull(child)) {
       this.children.add(child);
       if (!this.isRoot) child.parent = this;
     }
   }
 
   public void removeChildren(OrgNode child)
   {
     if (Util.isNotNull(child)) {
       this.children.remove(child);
       child.parent = null;
     }
   }
 
   public List<OrgNode> getChildren()
   {
     return Collections.unmodifiableList(this.children);
   }
 
   public OrgNode getChild(String id, String type)
   {
     if ((Util.isNotEmptyString(id)) && (Util.isNotEmptyString(type)))
     {
       OrgNode item;
       for (Iterator i$ = this.children.iterator(); i$.hasNext(); ) { 
					item = (OrgNode)i$.next();
					if(id.equals(item.getId())&&type.equals(item.getType())){
						return item;
					}
        }
     }return null;
   }
 
   public boolean existChild(String id, String type)
   {
     return null != getChild(id, type);
   }
 
   public String getFullCode()
   {
     return this.fullCode;
   }
 }

