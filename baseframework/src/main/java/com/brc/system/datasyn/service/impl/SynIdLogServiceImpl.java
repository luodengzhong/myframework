 package com.brc.system.datasyn.service.impl;
 
 import com.brc.system.data.EntityParserDao;
 import com.brc.system.datasyn.service.SynIdLogService;
 import com.brc.system.share.service.ServiceUtil;
 
 public class SynIdLogServiceImpl
   implements SynIdLogService
 {
   private ServiceUtil serviceUtil;
 
   public void setServiceUtil(ServiceUtil serviceUtil)
   {
     this.serviceUtil = serviceUtil;
   }
 
   public long getLastSynId(String tableName)
   {
     String sql = "select t.last_id from syn_id_log t where t.table_name = ?";
     Long result = this.serviceUtil.getEntityDao().queryToLong(sql, new Object[] { tableName });
     return result == null ? 0L : result.longValue();
   }
 
   public void updateSynId(String tableName, Long id)
   {
     if (id == null) {
       id = Long.valueOf(0L);
     }
     String sql = "select count(*) from syn_id_log where table_name = ?";
     int count = this.serviceUtil.getEntityDao().queryToInt(sql, new Object[] { tableName });
     if (count == 0)
       sql = "insert into syn_id_log(id, last_id, table_name) values(seq_id.nextval, ?, ?)";
     else {
       sql = "update  syn_id_log  t set t.last_id = ? where  t.table_name = ? ";
     }
     this.serviceUtil.getEntityDao().executeUpdate(sql, new Object[] { id, tableName });
   }
 }

