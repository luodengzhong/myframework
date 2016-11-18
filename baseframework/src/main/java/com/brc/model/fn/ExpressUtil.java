 package com.brc.model.fn;
 
 import com.brc.exception.ExpressExecuteException;
 import com.brc.util.LogHome;
 import com.ql.util.express.ExpressRunner;
 import com.ql.util.express.IExpressContext;
 import java.util.List;
 import java.util.Map;
 import org.apache.log4j.Logger;
 import org.springframework.beans.BeansException;
 import org.springframework.context.ApplicationContext;
 import org.springframework.context.ApplicationContextAware;
 
 public class ExpressUtil
   implements ApplicationContextAware
 {
   private static ExpressRunner runner = new ExpressRunner();
   private List<Object> beanNames;
   private ApplicationContext applicationContext;
 
   public List<Object> getBeanNames()
   {
     return this.beanNames;
   }
 
   public void setBeanNames(List<Object> beanNames) {
     this.beanNames = beanNames;
   }
 
   public void setApplicationContext(ApplicationContext aContext) throws BeansException {
     this.applicationContext = aContext;
   }
 
   public ApplicationContext getApplicationContext() {
     return this.applicationContext;
   }
 
   public Object execute(String statement, Map<String, Object> context)
     throws Exception
   {
     try
     {
       IExpressContext expressContext = new ExpressContext(context, this.applicationContext);
       statement = initStatement(statement);
       return runner.execute(statement, expressContext, null, true, false);
     } catch (Exception e) {
       e.printStackTrace();
       LogHome.getLog(this).error(e);
       throw new ExpressExecuteException("表达式：\"" + statement + "\" 执行异常", e);
     }
     finally {
       VariableContainer.removeVariableMap();
     }
   }
 
   public Object execute(String statement) throws Exception
   {
     try {
       IExpressContext expressContext = new ExpressContext(this.applicationContext);
       statement = initStatement(statement);
       return runner.execute(statement, expressContext, null, true, false);
     } catch (Exception e) {
       e.printStackTrace();
       LogHome.getLog(this).error(e);
       throw new ExpressExecuteException("表达式：\"" + statement + "\" 执行异常" + e.getMessage(), e);
     }
     finally {
       VariableContainer.removeVariableMap();
     }
   }
 
   private String initStatement(String statement)
   {
     return statement.replace("（", "(").replace("）", ")").replace("；", ";").replace("，", ",").replace("“", "\"").replace("”", "\"");
   }
 
   protected void addFunction(String name, Object object, String functionName, Class<?>[] parameterClassTypes) {
     synchronized (runner) {
       try {
         runner.addFunctionOfServiceMethod(name, object, functionName, parameterClassTypes, null);
       } catch (Exception e) {
         e.printStackTrace();
         throw new RuntimeException("初始化失败表达式", e);
       }
     }
   }
 }

