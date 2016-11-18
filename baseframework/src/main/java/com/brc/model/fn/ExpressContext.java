 package com.brc.model.fn;
 
 import com.ql.util.express.IExpressContext;
 import java.util.HashMap;
 import java.util.Map;
 import org.springframework.context.ApplicationContext;
 
 public class ExpressContext extends HashMap<String, Object>
   implements IExpressContext<String, Object>
 {
   private ApplicationContext context;
 
   public ExpressContext(ApplicationContext aContext)
   {
     this.context = aContext;
   }
 
   public ExpressContext(Map<String, Object> aProperties, ApplicationContext aContext)
   {
     super(aProperties);
     this.context = aContext;
   }
 
   public Object get(Object name)
   {
     Object result = null;
     result = super.get(name);
     try {
       if ((result == null) && (this.context != null) && (this.context.containsBean((String)name)))
       {
         result = this.context.getBean((String)name);
       }
     } catch (Exception e) {
       throw new RuntimeException(e);
     }
     return result;
   }
 
   public Object put(String name, Object object) {
     return super.put(name, object);
   }
 }

