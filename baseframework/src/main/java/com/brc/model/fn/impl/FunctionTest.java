 package com.brc.model.fn.impl;
 
 import com.brc.model.fn.AbstractFunction;
 import com.brc.system.opm.Operator;
 import java.util.ArrayList;
 import java.util.HashMap;
 import java.util.List;
 import java.util.Map;
 
 public class FunctionTest extends AbstractFunction
 {
   public String a1(String name)
   {
     return "a1" + name;
   }
 
   public String a2(String name) {
     return "a2" + name;
   }
 
   public String a3(String name) {
     return "a3" + name;
   }
 
   public int a4(Integer b) {
     return 4 + b.intValue();
   }
 
   public Map a5() {
     Map m = new HashMap();
     m.put("aaaa", "哈哈");
     return m;
   }
 
   public List a6(String name) {
     List l = new ArrayList();
     l.add("dadada");
     l.add(name);
     return l;
   }
 
   public String a7() {
     Operator o = getOperator();
     return o.getName();
   }
 
   public Object a8(Map<String, Object> map, String key) {
     try {
       return map.get(key);
     } catch (Exception e) {
       e.printStackTrace();
     }
     return null;
   }
 }

