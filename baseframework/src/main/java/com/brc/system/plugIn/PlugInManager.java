 package com.brc.system.plugIn;
 
 import com.brc.exception.ApplicationException;
 import java.util.List;
 
 public class PlugInManager
 {
   private List<StartPlugIn> plugIns;
 
   public void setPlugIns(List<StartPlugIn> plugIns)
   {
     this.plugIns = plugIns;
   }
 
   public void executePlugInInit()
     throws ApplicationException
   {
     if ((this.plugIns == null) || (this.plugIns.size() <= 0))
       return;
     for (StartPlugIn pi : this.plugIns)
       pi.init();
   }
 }

