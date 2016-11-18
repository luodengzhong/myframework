 package com.brc.system;
 
 import com.brc.exception.ApplicationException;
 import java.util.HashMap;
 import java.util.Map;
 
 public enum ValidStatus
 {
   LOGIC_DELETE(-1, "删除"), DISABLED(0, "禁用"), ENABLED(1, "启用");
 
   private final int id;
   private final String displayName;
 
   private ValidStatus(int id, String displayName) {
     this.id = id;
     this.displayName = displayName;
   }
 
   public String toString() {
     return String.valueOf(this.id);
   }
 
   public int getId() {
     return this.id;
   }
 
   public String getDisplayName() {
     return this.displayName;
   }
 
   public static ValidStatus fromId(int id) {
     switch (id) {
     case 0:
       return DISABLED;
     case 1:
       return ENABLED;
     case -1:
       return LOGIC_DELETE;
     }
     throw new ApplicationException(String.format("无效的组织状态“%s”！", new Object[] { Integer.valueOf(id) }));
   }
 
   public static Map<Integer, String> getData()
   {
     Map result = new HashMap(2);
     for (ValidStatus item : values()) {
       if (item != LOGIC_DELETE) {
         result.put(Integer.valueOf(item.getId()), item.getDisplayName());
       }
     }
     return result;
   }
 }

