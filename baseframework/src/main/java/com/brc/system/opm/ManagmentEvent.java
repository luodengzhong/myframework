 package com.brc.system.opm;
 
 import org.springframework.context.ApplicationEvent;
 
 public class ManagmentEvent extends ApplicationEvent
 {
   private static final long serialVersionUID = 3483582757232858941L;
   private EventKind eventKind;
   private String[] managerIds;
   private Long manageTypeId;
   private Long[] managmentIds;
 
   public ManagmentEvent(Object source)
   {
     super(source);
   }
 
   public EventKind getEventKind() {
     return this.eventKind;
   }
 
   public void setEventKind(EventKind eventKind) {
     this.eventKind = eventKind;
   }
 
   public String[] getManagerIds() {
     return this.managerIds;
   }
 
   public void setManagerIds(String[] managerIds) {
     this.managerIds = managerIds;
   }
 
   public Long getManageTypeId() {
     return this.manageTypeId;
   }
 
   public void setManageTypeId(Long manageTypeId) {
     this.manageTypeId = manageTypeId;
   }
 
   public Long[] getManagmentIds()
   {
     return this.managmentIds;
   }
 
   public void setManagmentIds(Long[] managmentIds) {
     this.managmentIds = managmentIds;
   }
 
   public static enum EventKind
   {
     ALLOCATE, DELETE;
   }
 }

