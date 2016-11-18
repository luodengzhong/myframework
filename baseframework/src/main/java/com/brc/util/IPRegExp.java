 package com.brc.util;
 
 import java.util.Date;
 import org.apache.log4j.Logger;
 
 public class IPRegExp
 {
   private String reg;
   private Long address = Long.valueOf(0L);
   private Long mask = Long.valueOf(0L);
   private String timebegin;
   private String timeend;
 
   public String getTimebegin()
   {
     return this.timebegin;
   }
 
   public void setTimebegin(String timebegin) {
     this.timebegin = timebegin;
   }
 
   public String getTimeend() {
     return this.timeend;
   }
 
   public void setTimeend(String timeend) {
     this.timeend = timeend;
   }
 
   public Long ipStringToLong(String ip) {
     if (ip == null) {
       return null;
     }
 
     String[] ss = ip.split("\\.");
     if (ss.length != 4)
       return null;
     try {
       return new Long(Long.parseLong(ss[0]) * Math.round(Math.pow(2.0D, 24.0D)) + Long.parseLong(ss[1]) * Math.round(Math.pow(2.0D, 16.0D)) + Long.parseLong(ss[2]) * Math.round(Math.pow(2.0D, 8.0D)) + Long.parseLong(ss[3]));
     }
     catch (Exception e)
     {
     }
 
     return Long.valueOf(0L);
   }
 
   public IPRegExp parse(String rep)
   {
     this.reg = rep;
     if (rep == null)
       return null;
     String str = rep.trim();
     if (str.equals(""))
       return null;
     int p = str.indexOf('/');
     if (p > -1) {
       String addr = str.substring(0, p);
       String mask = str.substring(p + 1);
       this.address = ipStringToLong(addr);
       this.mask = Long.valueOf(mask);
       long lmask = 0L;
       for (long i = 31L; i > 32L - this.mask.longValue() - 1L; i -= 1L) {
         lmask += Math.round(Math.pow(2.0D, i));
       }
       this.mask = Long.valueOf(lmask);
     } else {
       this.address = ipStringToLong(str);
       this.mask = new Long(-1L);
     }
     if ((this.address == null) || (this.mask == null))
       return null;
     this.address = Long.valueOf(this.address.longValue() & this.mask.longValue());
     return this;
   }
 
   public boolean match(String ip) {
     return match(ipStringToLong(ip));
   }
 
   public boolean match(Long l)
   {
     if (l == null)
       return false;
     long laddress = l.longValue() & this.mask.longValue();
     boolean flag = this.address.equals(Long.valueOf(laddress));
     if (flag) {
       Long nowtime = Long.valueOf(System.currentTimeMillis());
       String dateStr = DateUtil.getDateFormat(DateUtil.getDate());
       if ((this.timebegin != null) && (!this.timebegin.equals(""))) {
         String dateTime = dateStr + " " + this.timebegin + ":00";
         try {
           Date d = DateUtil.getDateParse(3, dateTime);
           if (d.getTime() > nowtime.longValue())
             return false;
         } catch (Exception e) {
           LogHome.getLog(this).error(e);
         }
       }
 
       if ((this.timeend != null) && (!this.timeend.equals(""))) {
         String dateTime = dateStr + " " + this.timeend + ":00";
         try {
           Date d = DateUtil.getDateParse(3, dateTime);
           if (d.getTime() < nowtime.longValue())
             return false;
         } catch (Exception e) {
           LogHome.getLog(this).error(e);
         }
       }
     }
     return flag;
   }
 
   public int hashCode() {
     return this.address.hashCode() * 198001 + this.mask.hashCode();
   }
 
   public boolean equals(Object o) {
     if (!(o instanceof IPRegExp))
       return false;
     IPRegExp rhs = (IPRegExp)o;
     return (this.address.equals(rhs.address)) && (this.mask.equals(rhs.mask));
   }
 
   public String toSting() {
     return new StringBuilder().append("[reg=").append(this.reg).toString() + new StringBuilder().append(",address=").append(this.address).toString() + new StringBuilder().append(",mask=").append(this.mask).toString() + "]";
   }
 }

