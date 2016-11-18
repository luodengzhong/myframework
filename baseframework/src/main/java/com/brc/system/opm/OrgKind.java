 package com.brc.system.opm;
 
 public enum OrgKind
 {
   root("root", 0), ogn("机构", 1), fld("组织分类", 2), prj("项目组织", 3), stm("销售团队", 4), dpt("部门", 5), grp("分组", 6), pos("岗位", 7), psm("人员", 8), fun("职能角色", 9);
 
   private final String displayName;
   private final int level;
 
   private OrgKind(String displayName, int level) {
     this.displayName = displayName;
     this.level = level;
   }
 
   public String getDisplayName() {
     return this.displayName;
   }
 
   public int getLevel() {
     return this.level;
   }
 }

