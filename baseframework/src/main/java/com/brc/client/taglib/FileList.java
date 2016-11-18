 package com.brc.client.taglib;
 
 import com.brc.system.attachment.service.AttachmentQueryService;
 import com.brc.util.ClassHelper;
 import com.brc.util.Singleton;
 import com.brc.util.SpringBeanFactory;
 import com.brc.util.StringUtil;
 import com.opensymphony.xwork2.util.ValueStack;
 import java.util.List;
 import java.util.Map;
 import javax.servlet.http.HttpServletRequest;
 import javax.servlet.http.HttpServletResponse;
 import javax.servlet.http.HttpSession;
 import org.apache.struts2.components.UIBean;
 import org.apache.struts2.views.annotations.StrutsTag;
 import org.apache.struts2.views.annotations.StrutsTagAttribute;
 
 @StrutsTag(name="FileList", tldTagClass="com.brc.client.taglib.FileList", description="FileList")
 public class FileList extends UIBean
 {
   private AttachmentQueryService service;
   private String bizId;
   private String bizCode;
   private String readOnly;
   private String isWrap;
   private String isClass;
   private String inTable;
   private String proportion;
   private boolean isClassFlag = false;
 
   @StrutsTagAttribute(description="bizId", type="String")
   public void setBizId(String bizId) {
     this.bizId = bizId;
   }
 
   @StrutsTagAttribute(description="bizCode", type="String")
   public void setBizCode(String bizCode) {
     this.bizCode = bizCode;
   }
 
   @StrutsTagAttribute(description="readOnly", type="String")
   public void setReadOnly(String readOnly) {
     this.readOnly = readOnly;
   }
 
   @StrutsTagAttribute(description="isWrap", type="String")
   public void setIsWrap(String isWrap) {
     this.isWrap = isWrap;
   }
 
   @StrutsTagAttribute(description="isClass", type="String")
   public void setIsClass(String isClass) {
     this.isClass = isClass;
   }
 
   @StrutsTagAttribute(description="inTable", type="String")
   public void setInTable(String inTable) {
     this.inTable = inTable;
   }
 
   @StrutsTagAttribute(description="proportion", type="String")
   public void setProportion(String proportion) {
     this.proportion = proportion;
   }
 
   public FileList(ValueStack vs, HttpServletRequest req, HttpServletResponse res, String springBean) {
     super(vs, req, res);
     springBean = StringUtil.isBlank(springBean) ? "attachmentService" : springBean;
     this.service = ((AttachmentQueryService)SpringBeanFactory.getBean(this.request.getSession().getServletContext(), springBean, AttachmentQueryService.class));
   }
 
   protected String getDefaultTemplate() {
     return this.isClassFlag ? "fileTable" : "fileList";
   }
 
   protected void evaluateExtraParams() {
     super.evaluateExtraParams();
 
     String id = (String)ClassHelper.convert(this.request.getParameter(this.bizId), String.class);
     if (id == null) {
       id = (String)ClassHelper.convert(findValue(this.bizId), String.class);
       if (StringUtil.isBlank(id)) {
         id = null;
       }
     }
 
     String code = (String)ClassHelper.convert(this.request.getParameter(this.bizCode), String.class);
     if (code == null) {
       code = findValue(this.bizCode) != null ? (String)ClassHelper.convert(findValue(this.bizCode), String.class) : this.bizCode;
     }
 
     String requestIsClass = (String)ClassHelper.convert(this.request.getParameter(this.isClass), String.class);
     if (StringUtil.isBlank(requestIsClass)) {
       requestIsClass = this.isClass;
     }
     this.isClassFlag = ((Boolean)ClassHelper.convert(requestIsClass, Boolean.class)).booleanValue();
 
     String requestProportion = (String)ClassHelper.convert(this.request.getParameter(this.proportion), String.class);
     if (!StringUtil.isBlank(requestProportion)) {
       this.proportion = requestProportion;
     }
     if (this.proportion != null) {
       if (this.proportion.equals("proportion"))
         this.proportion = null;
       else {
         this.proportion = (findValue(this.proportion) != null ? (String)ClassHelper.convert(findValue(this.proportion), String.class) : this.proportion);
       }
     }
 
     if (this.isClassFlag) {
       List groupList = makeGroupList(code, id);
       if (null != groupList) {
         addParameter("groupList", groupList);
       }
       if (null != this.inTable) {
         addParameter("inTable", Boolean.valueOf(this.inTable));
       }
       String[] proportions = null;
       if ((null == this.proportion) || (this.proportion.trim().equals("")))
         proportions = "14%,19%,14%,19%,14%,19%".split(",");
       else {
         proportions = this.proportion.split(",");
       }
       addParameter("proportions", proportions);
     }
     else if (null != id) {
       List fileList = makeFileList(code, id);
       if (null != fileList) {
         addParameter("fileList", fileList);
       }
 
     }
 
     if (null != code) {
       addParameter("bizCode", code);
     }
     if (null != id) {
       addParameter("bizId", id);
     }
     if (null != this.readOnly) {
       addParameter("readonly", findValue(this.readOnly, Boolean.class));
     }
 
     String requestIsWrap = (String)ClassHelper.convert(this.request.getParameter(this.isWrap), String.class);
     if (StringUtil.isBlank(requestIsWrap)) {
       requestIsWrap = this.isWrap;
       if (requestIsWrap.equals("isWrap")) {
         requestIsWrap = "true";
       }
     }
     boolean isWrapFlag = ((Boolean)ClassHelper.convert(requestIsWrap, Boolean.class, Boolean.valueOf(true))).booleanValue();
     if (null != this.isWrap) {
       addParameter("isWrap", Boolean.valueOf(isWrapFlag));
     }
     if (null != this.title) {
       addParameter("title", this.title);
     }
     addParameter("attachmentConvertUrl", Singleton.getParameter("SYS.Convert.URL", String.class));
   }
 
   private List<Map<String, Object>> makeFileList(String code, String id)
   {
     return this.service.getAttachmentList(code, id);
   }
 
   private List<Map<String, Object>> makeGroupList(String code, String id)
   {
     return this.service.getAttachmentGroupList(code, id);
   }
 }

