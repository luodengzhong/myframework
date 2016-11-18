 package com.brc.client.taglib;
 
 import com.brc.system.extendedfield.service.ExtendedFieldService;
 import com.brc.util.ClassHelper;
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
 
 @StrutsTag(name="ExtendedFieldList", tldTagClass="com.brc.client.taglib.ExtendedFieldList", description="ExtendedFieldList")
 public class ExtendedFieldList extends UIBean
 {
   private String bizId;
   private String bizCode;
 
   @StrutsTagAttribute(description="bizId", type="String")
   public void setBizId(String bizId)
   {
     this.bizId = bizId;
   }
 
   @StrutsTagAttribute(description="bizCode", type="String")
   public void setBizCode(String bizCode) {
     this.bizCode = bizCode;
   }
 
   public ExtendedFieldList(ValueStack vs, HttpServletRequest req, HttpServletResponse res) {
     super(vs, req, res);
   }
 
   protected String getDefaultTemplate() {
     return "extendedField";
   }
 
   protected void evaluateExtraParams() {
     super.evaluateExtraParams();
     if ((StringUtil.isBlank(this.bizCode)) || (StringUtil.isBlank(this.bizId))) {
       return;
     }
     String id = (String)ClassHelper.convert(this.request.getParameter(this.bizId), String.class);
     if (id == null) {
       id = (String)ClassHelper.convert(findValue(this.bizId), String.class);
       if (StringUtil.isBlank(id)) {
         id = null;
       }
     }
     Long idl = (Long)ClassHelper.convert(id, Long.class);
     if (idl == null) {
       return;
     }
 
     String code = (String)ClassHelper.convert(this.request.getParameter(this.bizCode), String.class);
     if (code == null) {
       code = findValue(this.bizCode) != null ? (String)ClassHelper.convert(findValue(this.bizCode), String.class) : this.bizCode;
     }
     List group = queryExtendedField(idl, code);
     if ((null != group) && (group.size() > 0))
       addParameter("tagExtendedFieldGroupList", group);
   }
 
   private List<Map<String, Object>> queryExtendedField(Long id, String code)
   {
     ExtendedFieldService service = (ExtendedFieldService)SpringBeanFactory.getBean(this.request.getSession().getServletContext(), "extendedFieldService", ExtendedFieldService.class);
     List group = service.queryExtendedFieldForView(code, id);
     return group;
   }
 }

