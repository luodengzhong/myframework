 package com.brc.system.opm;
 
 import com.brc.system.util.Util;
 
 public enum NodeKind
 {
   leaf, limb;
 
   public static NodeKind fromString(String value) {
     NodeKind nodeKind = null;
     if (leaf.toString().equals(value))
       nodeKind = leaf;
     else if (Util.isEmptyString(value)) {
       nodeKind = limb;
     }
     Util.check(nodeKind != null, "无效的NodeKind“%s”！", new Object[] { value });
     return nodeKind;
   }
 }

