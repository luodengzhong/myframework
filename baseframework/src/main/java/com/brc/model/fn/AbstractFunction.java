 package com.brc.model.fn;
 
 import com.brc.system.opm.Operator;
 import com.brc.util.ThreadLocalUtil;
 
 public abstract class AbstractFunction
 {
   public Operator getOperator()
   {
     return (Operator)ThreadLocalUtil.getVariable("operator", Operator.class);
   }
 
   public Object getVariable(String name)
   {
     return VariableContainer.getVariable(name);
   }
 
   public <T> T getVariable(String name, Class<T> cls)
   {
     return VariableContainer.getVariable(name, cls);
   }
 }

