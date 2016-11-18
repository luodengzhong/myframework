 package com.brc.system.opm;
 
 public enum OrgAdminKind
 {
   HQ(1, "总部"), LEAD(2, "领跑型"), PIONEER(3, "开拓型"), GROWTH(4, "成长型"), MATURE(5, "成熟型");
 
   private final int id;
   private final String displayName;
 
   private OrgAdminKind(int id, String displayName) {
     this.id = id;
     this.displayName = displayName;
   }
 
   public int getId() {
     return this.id;
   }
 
   public String getDisplayName() {
     return this.displayName;
   }
 }

