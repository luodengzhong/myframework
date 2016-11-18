 package com.brc.system.person.action;
 
 import com.brc.client.action.base.CommonAction;
 import com.brc.system.interfaceType.HRArchivesUtilService;
 import com.brc.system.opm.Operator;
 import com.brc.system.opm.service.OrgService;
 import com.brc.system.person.service.PersonOwnService;
 import com.brc.util.SDO;
 import java.util.Date;
 import java.util.List;
 import java.util.Map;
 
 public class PersonOwnAction extends CommonAction
 {
   private PersonOwnService personOwnService;
   private OrgService orgService;
   private HRArchivesUtilService hrArchivesService;
 
   public void setPersonOwnService(PersonOwnService personOwnService)
   {
     this.personOwnService = personOwnService;
   }
 
   public void setOrgService(OrgService orgService) {
     this.orgService = orgService;
   }
 
   public void setHrArchivesService(HRArchivesUtilService hrArchivesService) {
     this.hrArchivesService = hrArchivesService;
   }
 
   protected String getPagePath() {
     return "/system/personOwn/";
   }
 
   public String toMainPage()
     throws Exception
   {
     Operator operator = getOperator();
     try {
       List list = this.personOwnService.getUsersNotes(operator.getId());
       putAttr("notes", list);
     } catch (Exception e) {
       e.printStackTrace();
       logError("查询出错", e);
       putAttr("error", e.getMessage());
     }
     return forward("notes/notes");
   }
 
   public String toAddPage() throws Exception {
     return forward("notes/addNote");
   }
 
   public String addNote()
     throws Exception
   {
     SDO sdo = getSDO();
     try {
       Long id = this.personOwnService.saveNote(sdo);
       return success(id.toString());
     } catch (Exception e) {
       e.printStackTrace();
       logError("保存数据时出错", e);
       return error("保存数据时出错:" + e.getMessage());
     }
   }
 
   public String updateNote()
     throws Exception
   {
     SDO sdo = getSDO();
     try {
       this.personOwnService.updateNote(sdo);
     } catch (Exception e) {
       e.printStackTrace();
       logError("", e);
       return error("保存数据时出错:" + e.getMessage());
     }
     return success();
   }
 
   public String delNote()
     throws Exception
   {
     SDO sdo = getSDO();
     Long[] ids = sdo.getLongArray("ids");
     try {
       this.personOwnService.deleteNote(ids);
     } catch (Exception e) {
       e.printStackTrace();
       return error(e.getMessage());
     }
     return success();
   }
 
   public String toListPage()
     throws Exception
   {
     return forward("notes/noteList");
   }
 
   public String slicedQueryPersonNotes()
   {
     SDO sdo = getSDO();
     try {
       Map map = this.personOwnService.slicedQueryPersonNotes(sdo);
       return toResult(map);
     } catch (Exception e) {
       e.printStackTrace();
       return error(e.getMessage());
     }
   }
 
   public String doDeleteAll()
     throws Exception
   {
     Operator operator = getOperator();
     try {
       this.personOwnService.deleteAll(operator.getId());
       return success();
     } catch (Exception exception) {
       return error("删除数据错误:" + exception.getMessage());
     }
   }
 
   public String toCalendarPage()
     throws Exception
   {
     return forward("workcalendar/workcalendar");
   }
 
   public String queryCalendars()
     throws Exception
   {
     SDO sdo = getSDO();
     Operator operator = sdo.getOperator();
     Long sd = (Long)sdo.getProperty("start", Long.class);
     Long ed = (Long)sdo.getProperty("end", Long.class);
     sd = Long.valueOf(sd != null ? sd.longValue() : new Date().getTime());
     ed = Long.valueOf(ed != null ? ed.longValue() : new Date().getTime());
     try {
       List l = this.personOwnService.queryCalendar(operator, new Date(sd.longValue()), new Date(ed.longValue()));
       return toResult(l);
     } catch (Exception e) {
       e.printStackTrace();
       logError("", e);
       return error("查询数据时出错:" + e.getMessage());
     }
   }
 
   public String saveCalendar()
     throws Exception
   {
     SDO sdo = getSDO();
     try {
       Long id = this.personOwnService.saveCalendar(sdo);
       return success(id);
     } catch (Exception e) {
       e.printStackTrace();
       logError("", e);
       return error("保存数据时出错:" + e.getMessage());
     }
   }
 
   public String updateCalendar()
     throws Exception
   {
     SDO sdo = getSDO();
     try {
       this.personOwnService.updateCalendar(sdo);
       return success();
     } catch (Exception e) {
       e.printStackTrace();
       logError("", e);
       return error("保存数据时出错:" + e.getMessage());
     }
   }
 
   public String updateCalendarColor()
     throws Exception
   {
     SDO sdo = getSDO();
     Long id = (Long)sdo.getProperty("id", Long.class);
     String className = (String)sdo.getProperty("className", String.class);
     try {
       this.personOwnService.updateCalendarColor(id, className);
       return success();
     } catch (Exception e) {
       e.printStackTrace();
       logError("", e);
       return error("保存数据时出错:" + e.getMessage());
     }
   }
 
   public String deleteCalendar()
     throws Exception
   {
     SDO sdo = getSDO();
     Long id = (Long)sdo.getProperty("id", Long.class);
     try {
       this.personOwnService.deleteCalendar(id);
       return success();
     } catch (Exception e) {
       e.printStackTrace();
       logError("", e);
       return error("删除数据时出错:" + e.getMessage());
     }
   }
 
   public String getCalendarMap()
     throws Exception
   {
     SDO sdo = getSDO();
     Long id = (Long)sdo.getProperty("id", Long.class);
     try {
       if (id != null) {
         Map map = this.personOwnService.getCalendar(id);
         putAttr("particularMap", map);
       }
     } catch (Exception e) {
       e.printStackTrace();
       logError("", e);
     }
     return forward("workcalendar/particularCalendar");
   }
 
   public String saveParticularCalendar()
     throws Exception
   {
     SDO sdo = getSDO();
     try {
       this.personOwnService.saveParticularCalendar(sdo);
       return success();
     } catch (Exception e) {
       e.printStackTrace();
       logError("", e);
       return error("保存数据时出错:" + e.getMessage());
     }
   }
 
   public String insertTaskCollect() throws Exception
   {
     SDO sdo = getSDO();
     try {
       this.personOwnService.insertTaskCollect(sdo);
       return success();
     } catch (Exception e) {
       return error(e);
     }
   }
 
   public String deleteTaskCollect() throws Exception {
     SDO sdo = getSDO();
     try {
       this.personOwnService.deleteTaskCollect(sdo);
       return success();
     } catch (Exception e) {
       return error(e);
     }
   }
 
   public String insertInfoCollect() throws Exception
   {
     SDO sdo = getSDO();
     try {
       this.personOwnService.insertInfoCollect(sdo);
       return success();
     } catch (Exception e) {
       return error(e);
     }
   }
 
   public String deleteInfoCollect() throws Exception {
     SDO sdo = getSDO();
     try {
       this.personOwnService.deleteInfoCollect(sdo);
       return success();
     } catch (Exception e) {
       return error(e);
     }
   }
 
   public String saveQueryScheme()
     throws Exception
   {
     SDO sdo = getSDO();
     try {
       this.personOwnService.saveQueryScheme(sdo);
       return success();
     } catch (Exception e) {
       return error(e);
     }
   }
 
   public String queryQueryScheme() throws Exception {
     SDO sdo = getSDO();
     String schemeKind = (String)sdo.getProperty("schemeKind", String.class);
     try {
       List list = this.personOwnService.queryQueryScheme(sdo.getOperator().getId(), schemeKind);
       return toResult(list);
     } catch (Exception e) {
       return error(e);
     }
   }
 
   public String deleteQueryScheme() throws Exception {
     SDO sdo = getSDO();
     try {
       this.personOwnService.deleteQueryScheme((Long)sdo.getProperty("schemeId", Long.class));
       return success();
     } catch (Exception e) {
       return error(e);
     }
   }
 
   public String forwardUsercontrol()
   {
     SDO sdo = getSDO();
     try {
       String id = sdo.getOperator().getId();
       Map data = this.orgService.loadPerson(id);
       return forward("/UsercontrolPanel.jsp", data);
     } catch (Exception e) {
       return errorPage(e.getMessage());
     }
   }
 
   public String saveUsercontrolInfo()
   {
     SDO sdo = getSDO();
     try {
       sdo.putProperty("id", sdo.getOperator().getId());
       this.orgService.updatePersonSimple(sdo);
       this.hrArchivesService.updateArchivesContactWay(sdo);
       return success();
     } catch (Exception e) {
       return error(e);
     }
   }
 
   public String updateErpUserStatus()
   {
     SDO sdo = getSDO();
     try {
       this.personOwnService.updateErpUserStatus(sdo);
       return success();
     } catch (Exception e) {
       return error(e);
     }
   }
 
   public static enum CalendarViewType
   {
     day, week, workweek, month;
   }
 }

