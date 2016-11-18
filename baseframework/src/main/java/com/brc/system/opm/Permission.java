 package com.brc.system.opm;
 
 import com.brc.system.util.Util;
 import java.io.Serializable;
 
 public class Permission
   implements Serializable
 {
   private static final long serialVersionUID = 7999216234901748751L;
   public static final String KIND_EXPRESS = "expr";
   public static final String KIND_LIST = "list";
   public static final String NULL_ACTION = "_NULLACTION_";
   int id = 0;
 
   String process = null;
 
   String activity = null;
 
   int permissionType = -1;
 
   public Permission(int id, String process, String activity, int permissionType) {
     Util.check((id > 0) && (Util.isNotEmptyString(process)) && (Util.isNotEmptyString(activity)), "创建permission时参数不能为空！");
     this.id = id;
     this.process = process;
     this.activity = activity;
     this.permissionType = permissionType;
   }
 }

