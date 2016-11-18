 package com.brc.system.plugIn;
 
 import com.brc.model.fn.ExpressManager;
 import com.brc.model.fn.ExpressUtil;
 import com.brc.util.ApplicationContextWrapper;
 import com.brc.util.FreemarkerUtil;
 import com.brc.util.Singleton;
 import com.brc.util.SpringBeanFactory;
 import java.io.File;
 import java.io.FileOutputStream;
 import java.io.IOException;
 import java.io.OutputStream;
 import javax.servlet.Filter;
 import javax.servlet.FilterChain;
 import javax.servlet.FilterConfig;
 import javax.servlet.ServletContext;
 import javax.servlet.ServletException;
 import javax.servlet.ServletRequest;
 import javax.servlet.ServletResponse;
 import javax.servlet.http.HttpServletRequest;
 import net.sf.ehcache.Cache;
 import org.apache.struts2.dispatcher.StrutsRequestWrapper;
 import org.springframework.web.context.support.WebApplicationContextUtils;
 
 public class PlugInFilter
   implements Filter
 {
   public void init(FilterConfig filterconfig)
     throws ServletException
   {
     System.setProperty("org.apache.cxf.stax.allowInsecureParser", "1");
 
     ServletContext servletContext = filterconfig.getServletContext();
     String contextPath = servletContext.getContextPath();
     String realPath = servletContext.getRealPath("/");
     FreemarkerUtil.setTemplateLoading(servletContext);
     ApplicationContextWrapper.init(WebApplicationContextUtils.getWebApplicationContext(servletContext));
     try
     {
       Singleton.setCache((Cache)SpringBeanFactory.getBean(servletContext, "sysDataCache"));
       Singleton.setRealPath(realPath);
       Singleton.setContextPath(contextPath);
       initPath(Singleton.getContextPath(), Singleton.getRealPath());
       ExpressManager.initExpress((ExpressUtil)SpringBeanFactory.getBean(servletContext, "expressUtil", ExpressUtil.class));
       PlugInManager pm = (PlugInManager)SpringBeanFactory.getBean(servletContext, "plugInManager", PlugInManager.class);
       pm.executePlugInInit();
     } catch (Exception e) {
       e.printStackTrace();
       throw new ServletException(e);
     }
   }
 
   public void doFilter(ServletRequest servletrequest, ServletResponse servletresponse, FilterChain filterchain) throws IOException, ServletException
   {
     filterchain.doFilter(new StrutsRequestWrapper((HttpServletRequest)servletrequest), servletresponse);
   }
 
   public void destroy()
   {
   }
 
   private void initPath(String contextPath, String realPath)
   {
     com.brc.util.Constants.WEB_APP = contextPath;
     OutputStream fout = null;
     StringBuffer sb = new StringBuffer();
     sb.append("var web_app={name:'");
     sb.append(contextPath);
     sb.append("'};");
     try {
       File f1 = new File(realPath + "/javaScript/WEB_APP.js");
       f1.createNewFile();
       fout = new FileOutputStream(f1);
       fout.write(sb.toString().getBytes());
     } catch (Exception e) {
       e.printStackTrace();
     } finally {
       try {
         if (fout != null)
           fout.close();
       }
       catch (IOException e) {
         e.printStackTrace();
       }
     }
   }
 }

