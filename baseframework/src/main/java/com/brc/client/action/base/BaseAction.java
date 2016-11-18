 package com.brc.client.action.base;
 
 import com.brc.system.opm.Operator;
 import com.brc.util.SDO;
 import com.brc.util.StringUtil;
 import com.brc.util.ThreadLocalUtil;
 import com.opensymphony.xwork2.ActionContext;
 import com.opensymphony.xwork2.ActionSupport;
 import java.util.HashMap;
 import java.util.Iterator;
 import java.util.Map;
 import java.util.Set;
 import javax.servlet.http.HttpServletRequest;
 import javax.servlet.http.HttpServletResponse;
 import javax.servlet.http.HttpSession;
 import org.apache.struts2.ServletActionContext;
 
 public class BaseAction extends ActionSupport
 {
   public static final String MAIN = "main";
   public static final String ADD = "add";
   public static final String EDIT = "edit";
   public static final String VIEW = "view";
   private static final long serialVersionUID = 1L;
 
   public String execute()
     throws Exception
   {
     Map session = ActionContext.getContext().getSession();
     if (session != null) session.clear();
     HttpServletRequest request = ServletActionContext.getRequest();
     HttpSession session1 = request.getSession();
 
     return "LoginPage";
   }
 
   public Map<String, Object> getSession()
   {
     return ActionContext.getContext().getSession();
   }
 
   public SDO getSDO() {
     SDO sdo = new SDO(true);
     Map map = ActionContext.getContext().getParameters();
     Iterator it = map.keySet().iterator();
     while (it.hasNext()) {
       String key = (String)it.next();
       String[] values = (String[])map.get(key);
       if ((values != null) && (values.length > 0)) {
         if (values.length == 1)
           sdo.putProperty(key, StringUtil.decode(values[0]));
         else {
           sdo.putProperty(key, values);
         }
       }
     }
     sdo.setOperator(getOperator());
     return sdo;
   }
 
   public String[] getParameterArray(String key)
   {
     return (String[])ActionContext.getContext().getParameters().get(key);
   }
 
   public String getParameter(String key)
   {
     String[] para = (String[])ActionContext.getContext().getParameters().get(key);
     if ((para != null) && (para.length > 0)) return para[0];
     return null;
   }
 
   public Map<String, Object> getContextMap()
   {
     return ActionContext.getContext().getContextMap();
   }
 
   public Object getAttr(String key)
   {
     return ActionContext.getContext().get(key);
   }
 
   public void putAttr(String key, Object value)
   {
     Map noaccessField = (Map)ThreadLocalUtil.getVariable("noaccessField");
     if ((noaccessField != null) && 
       (noaccessField.containsKey(key))) {
       value = "********";
     }
 
     Map attributeMap = (Map)ThreadLocalUtil.getVariable("requestAttributeMap");
     if (attributeMap == null) {
       attributeMap = new HashMap();
     }
     attributeMap.put(key, value);
     ThreadLocalUtil.addVariable("requestAttributeMap", attributeMap);
     ActionContext.getContext().put(key, value);
   }
 
   public void putAttr(Map<String, Object> map)
   {
     if ((map != null) && (map.size() > 0)) {
       Iterator it = map.keySet().iterator();
       String key = null;
       while (it.hasNext()) {
         key = (String)it.next();
         putAttr(key, map.get(key));
       }
     }
   }
 
   public String getRequestIP()
   {
     HttpServletRequest request = getRequest();
     String ip = request.getHeader("x-forwarded-for");
     if ((StringUtil.isBlank(ip)) || ("unknown".equalsIgnoreCase(ip))) {
       ip = request.getHeader("Proxy-Client-IP");
     }
     if ((StringUtil.isBlank(ip)) || ("unknown".equalsIgnoreCase(ip))) {
       ip = request.getHeader("WL-Proxy-Client-IP");
     }
     if ((StringUtil.isBlank(ip)) || ("unknown".equalsIgnoreCase(ip))) {
       ip = request.getHeader("http_client_ip");
     }
     if ((StringUtil.isBlank(ip)) || ("unknown".equalsIgnoreCase(ip))) {
       ip = request.getHeader("HTTP_X_FORWARDED_FOR");
     }
     if ((StringUtil.isBlank(ip)) || ("unknown".equalsIgnoreCase(ip))) {
       ip = request.getRemoteAddr();
     }
     if (ip.equals("0:0:0:0:0:0:0:1")) ip = "127.0.0.1";
     return ip.split(",")[0];
   }
 
   public HttpServletRequest getRequest() {
     return ServletActionContext.getRequest();
   }
 
   public HttpServletResponse getResponse() {
     return ServletActionContext.getResponse();
   }
 
   public Operator getOperator()
   {
     Operator operator = getSession().get("sessionOperatorAttribute") != null ? (Operator)getSession().get("sessionOperatorAttribute") : null;
 
     return operator;
   }
 }

