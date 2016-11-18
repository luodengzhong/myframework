 package com.brc.client.action.base;
 
 import com.brc.exception.ApplicationException;
 import com.brc.exception.PageForwardException;
 import com.brc.system.attachment.model.RangeSettings;
 import com.brc.system.data.EntityParserDao;
 import com.brc.system.share.service.ServiceUtil;
 import com.brc.util.ClassHelper;
 import com.brc.util.ContentTypeHelper;
 import com.brc.util.FileHelper;
 import com.brc.util.JSONParseConfig;
 import com.brc.util.LogHome;
 import com.brc.util.PDFCreater;
 import com.brc.util.SDO;
 import com.brc.util.Singleton;
 import com.brc.util.SpringBeanFactory;
 import com.brc.util.StringUtil;
 import com.brc.util.ThreadLocalUtil;
import com.brc.xmlbean.EntityDocument;
 import com.brc.xmlbean.EntityDocument.Entity;
 import com.opensymphony.xwork2.ActionContext;
 import java.io.BufferedInputStream;
 import java.io.BufferedOutputStream;
 import java.io.File;
 import java.io.FileInputStream;
 import java.io.IOException;
 import java.io.PrintWriter;
 import java.io.RandomAccessFile;
 import java.lang.reflect.Field;
 import java.util.Collection;
 import java.util.Map;
 import javax.servlet.RequestDispatcher;
 import javax.servlet.ServletException;
 import javax.servlet.ServletOutputStream;
 import javax.servlet.http.HttpServletRequest;
 import javax.servlet.http.HttpServletResponse;
 import net.sf.json.JSONArray;
 import net.sf.json.JSONObject;
 import org.apache.log4j.Logger;
 import org.apache.struts2.ServletActionContext;
 
 public class CommonAction extends BaseAction
 {
   private static final long serialVersionUID = 330428273603794944L;
 
   protected String getPagePath()
   {
     return null;
   }
 
   private String composePagePath(String page) {
     if (StringUtil.isBlank(page)) return null;
     if (page.endsWith(".jsp")) {
       return page;
     }
     return getPagePath() + page + ".jsp";
   }
 
   protected String forward(String page, Object obj)
   {
     if (obj != null)
     {
       if ((obj instanceof Map)) {
         putAttr((Map)obj);
       } else if ((obj instanceof SDO)) {
         putAttr(((SDO)obj).getProperties());
       } else {
         Class cls = obj.getClass();
         Field[] fields = cls.getDeclaredFields();
         String fieldName = null; String value = null;
         for (Field field : fields) {
           fieldName = field.getName();
           value = ClassHelper.getProperty(obj, fieldName);
           if (!StringUtil.isBlank(value)) {
             putAttr(fieldName, value);
           }
         }
       }
     }
     if ((isAppJob()) || (isWebApp())) {
       Object attribute = ThreadLocalUtil.getVariable("requestAttributeMap");
 
       return success(attribute);
     }
     try {
       getRequest().getRequestDispatcher(composePagePath(page)).forward(getRequest(), getResponse());
     } catch (ServletException e) {
       throw new PageForwardException(e);
     } catch (IOException e) {
       throw new PageForwardException(e);
     }
     return "none";
   }
 
   protected String redirectReport(String page)
   {
     try
     {
       getResponse().sendRedirect(page);
     } catch (IOException e) {
       throw new PageForwardException(e);
     }
     return "none";
   }
 
   protected boolean isAppJob()
   {
     String currentURL = getRequest().getRequestURI();
     return currentURL.indexOf(".appJob") > 0;
   }
 
   protected boolean isWebApp() {
     String currentURL = getRequest().getRequestURI();
     return currentURL.indexOf(".webApp") > 0;
   }
 
   protected boolean isJsonpCall() {
     String callback = (String)ClassHelper.convert(ActionContext.getContext().getParameters().get("callback"), String.class);
     return (isWebApp()) && (!StringUtil.isBlank(callback));
   }
 
   protected boolean isPrintRequest()
   {
     String currentURL = getRequest().getRequestURI();
     return currentURL.indexOf(".print") > 0;
   }
 
   protected String forward(String page)
   {
     return forward(page, null);
   }
 
   public String blank(Status status, String message, Object data)
   {
     JSONObject object = new JSONObject();
     object.put("status", Integer.valueOf(status.ordinal()));
     if (!StringUtil.isBlank(message)) {
       object.put("message", message);
     }
     if (data != null) {
       if ((data instanceof SDO))
         object.put("data", JSONObject.fromObject(((SDO)data).getProperties(), JSONParseConfig.jc));
       else if ((data instanceof Collection))
         object.put("data", JSONArray.fromObject(data, JSONParseConfig.jc));
       else if (ClassHelper.isBaseType(data.getClass()))
         object.put("data", data.toString());
       else {
         object.put("data", JSONObject.fromObject(data, JSONParseConfig.jc));
       }
     }
     return blank(object.toString());
   }
 
   public String success() {
     return blank(Status.SUCCESS_TIPS, null, "ok");
   }
 
   public String success(Object data) {
     return blank(Status.SUCCESS_TIPS, null, data);
   }
 
   public String success(String message, Object data) {
     return blank(Status.SUCCESS_TIPS, message, data);
   }
 
   public String error(String message) {
     return blank(Status.ERROR, message, null);
   }
 
   public String error(Throwable throwable) {
     LogHome.getLog(this).error(throwable.getMessage(), throwable);
     return error(throwable.getMessage());
   }
 
   public String error(String message, Object data) {
     return blank(Status.ERROR, message, data);
   }
 
   public String toResult(Object data) {
     return blank(Status.SUCCESS, null, data);
   }
 
   public String alert(String s)
   {
     return blank("<script>alert('" + s + "');</script>");
   }
 
   public String blank(String msg)
   {
     String outMsg = msg;
     if (isJsonpCall()) {
       String callback = (String)ClassHelper.convert(ActionContext.getContext().getParameters().get("callback"), String.class);
       outMsg = String.format("%s(%s)", new Object[] { callback, msg });
     }
     HttpServletResponse response = getResponse();
     response.setContentType("text/html; charset=UTF-8");
     response.setCharacterEncoding("utf-8");
     LogHome.getLog(this).debug(msg);
     try {
       response.getWriter().write(outMsg);
       response.getWriter().flush();
       response.getWriter().close();
     } catch (IOException e) {
       e.printStackTrace();
     }
     return "none";
   }
 
   public String blank(Map<String, Object> map)
     throws Exception
   {
     JSONObject object = JSONObject.fromObject(map, JSONParseConfig.jc);
     return blank(object.toString());
   }
 
   public String blank(Collection<?> collection)
     throws Exception
   {
     JSONArray object = JSONArray.fromObject(collection, JSONParseConfig.jc);
     return blank(object.toString());
   }
 
   public String errorPage(String msg)
   {
     if ((isAppJob()) || (isWebApp()))
     {
       return error(msg);
     }
     putAttr("tip", msg);
     return "ErrorPage";
   }
 
   public String errorPage(Throwable throwable)
   {
     LogHome.getLog(this).error(throwable.getMessage(), throwable);
     return errorPage(throwable.getMessage());
   }
 
   public void logError(String message, Throwable t)
   {
     LogHome.getLog(this).error(message, t);
   }
 
   protected Object getSpringBean(String name)
   {
     return SpringBeanFactory.getBean(ServletActionContext.getServletContext(), name);
   }
 
   protected void excludeRootCriteria(Map<String, Object> params, String name)
   {
     if (params.containsKey(name)) {
       String value = (String)ClassHelper.convert(params.get(name), String.class, "0");
       if (value.equals("0"))
         params.remove(name);
     }
   }
 
   protected Map<String, Object> getDefaultExprValues(String modelFile, String entityName)
   {
     ServiceUtil serviceUtil = (ServiceUtil)SpringBeanFactory.getBean(ServletActionContext.getServletContext(), "serviceUtil", ServiceUtil.class);
     EntityDocument.Entity entity = serviceUtil.getEntity(modelFile, entityName);
     return serviceUtil.getEntityDao().getDefaultExprValues(entity);
   }
 
   public String outputFile(File file, String type)
     throws Exception
   {
     HttpServletResponse res = getResponse();
     ServletOutputStream out = null;
     res.setContentType(ContentTypeHelper.getContentType(type));
     BufferedInputStream bis = null;
     BufferedOutputStream bos = null;
     try {
       out = res.getOutputStream();
       bis = new BufferedInputStream(new FileInputStream(file));
       bos = new BufferedOutputStream(out);
       byte[] buff = new byte[2048];
       int bytesRead;
       while (-1 != (bytesRead = bis.read(buff, 0, buff.length))) {
         bos.write(buff, 0, bytesRead);
       }
       res.flushBuffer();
     } catch (Exception e) {
       throw new ApplicationException(e);
     } finally {
       if (bis != null) bis.close();
       if (bos != null) bos.close();
       if (out != null) out.close();
     }
     return null;
   }
 
   public String outputPDF(String template, Map<String, Object> variables)
   {
     String imgHttpUrl = getRequest().getScheme() + "://" + getRequest().getServerName() + ":" + getRequest().getServerPort() + Singleton.getContextPath();
 
     variables.put("imgHttpUrl", imgHttpUrl);
     String path = PDFCreater.createByFreemarker(template, variables);
     File file = new File(FileHelper.getTmpdir(), path);
     if ((file != null) && (file.exists())) {
       try {
         return outputFile(file, "pdf");
       } catch (Exception e) {
         return errorPage(e);
       } finally {
         file.delete();
       }
     }
     return null;
   }
 
   public String outputWord(String template, Map<String, Object> variables)
   {
     String imgHttpUrl = getRequest().getScheme() + "://" + getRequest().getServerName() + ":" + getRequest().getServerPort() + Singleton.getContextPath();
 
     variables.put("imgHttpUrl", imgHttpUrl);
     String path = PDFCreater.createWord(template, variables);
     File file = new File(FileHelper.getTmpdir(), path);
     if ((file != null) && (file.exists())) {
       try {
         return outputFile(file, "doc");
       } catch (Exception e) {
         return errorPage(e);
       } finally {
         file.delete();
       }
     }
     return null;
   }
 
   public void downloadByBreakpoint(HttpServletRequest request, HttpServletResponse response, File downloadFile, String contentType, String downFileName)
     throws Exception
   {
     response.addHeader("Content-Disposition", "attachment; filename=\"" + downFileName + "\"");
     response.setContentType(contentType);
     ServletOutputStream os = null;
     BufferedOutputStream out = null;
     RandomAccessFile raf = null;
     byte[] b = new byte[1024];
     try {
       long pos = getHeaderSetting(request, response, downloadFile.length());
       os = response.getOutputStream();
       out = new BufferedOutputStream(os);
       raf = new RandomAccessFile(downloadFile, "r");
       raf.seek(pos);
       try {
         int n = 0;
         while ((n = raf.read(b, 0, 1024)) != -1) {
           out.write(b, 0, n);
         }
         out.flush();
       } catch (IOException ie) {
       }
     } catch (Exception e) {
       e.printStackTrace();
       throw new ApplicationException(e);
     } finally {
       if (out != null) {
         try {
           out.close();
         } catch (IOException e) {
           e.printStackTrace();
         }
       }
       if (raf != null)
         try {
           raf.close();
         } catch (IOException e) {
           e.printStackTrace();
         }
     }
   }
 
   private long getHeaderSetting(HttpServletRequest request, HttpServletResponse response, long fileLength)
     throws Exception
   {
     if (null == request.getHeader("Range")) {
       setResponse(new RangeSettings(fileLength), response);
       return 0L;
     }
     String range = request.getHeader("Range").replaceAll("bytes=", "");
     RangeSettings settings = getSettings(fileLength, range);
     setResponse(settings, response);
     return settings.getStart();
   }
 
   private void setResponse(RangeSettings settings, HttpServletResponse response)
     throws Exception
   {
     if (!settings.isRange()) {
       response.addHeader("Content-Length", String.valueOf(settings.getTotalLength()));
     } else {
       long start = settings.getStart();
       long end = settings.getEnd();
       long contentLength = settings.getContentLength();
       response.setStatus(206);
       response.addHeader("Content-Length", String.valueOf(contentLength));
       String contentRange = "bytes " + start + "-" + end + "/" + settings.getTotalLength();
       response.setHeader("Content-Range", contentRange);
     }
   }
 
   private RangeSettings getSettings(long len, String range)
   {
     long contentLength = 0L;
     long start = 0L;
     long end = 0L;
     if (range.startsWith("-"))
     {
       contentLength = Long.parseLong(range.substring(1));
       end = len - 1L;
       start = len - contentLength;
     } else if (range.endsWith("-"))
     {
       start = Long.parseLong(range.replace("-", ""));
       end = len - 1L;
       contentLength = len - start;
     }
     else {
       String[] se = range.split("-");
       start = Long.parseLong(se[0]);
       end = Long.parseLong(se[1]);
       contentLength = end - start + 1L;
     }
     return new RangeSettings(start, end, contentLength, len);
   }
 
   protected static enum Status
   {
     SUCCESS, SUCCESS_TIPS, ERROR, ERROR_DIALOG;
   }
 }

