 package com.brc.system.about.service.impl;
 
 import com.brc.exception.ApplicationException;
 import com.brc.system.about.service.AboutService;
 import com.brc.system.data.EntityParserDao;
 import com.brc.system.data.util.BuildSQLUtil;
 import com.brc.system.opm.Operator;
 import com.brc.system.share.service.SQLQuery;
 import com.brc.system.share.service.ServiceUtil;
 import com.brc.util.ClassHelper;
 import com.brc.util.DataUtil;
 import com.brc.util.FileHelper;
 import com.brc.util.ListUtil;
 import com.brc.util.LogHome;
 import com.brc.util.QueryModel;
 import com.brc.util.SDO;
 import com.brc.util.Singleton;
 import com.brc.util.StringUtil;
import com.brc.xmlbean.EntityDocument;
 import com.brc.xmlbean.EntityDocument.Entity;
 import java.io.File;
 import java.io.FileOutputStream;
 import java.io.IOException;
 import java.io.OutputStreamWriter;
 import java.util.ArrayList;
 import java.util.HashMap;
 import java.util.Iterator;
 import java.util.List;
 import java.util.Map;
 import org.apache.log4j.Logger;
 import org.jsoup.Jsoup;
 import org.jsoup.nodes.Document;
 import org.jsoup.nodes.Element;
 import org.jsoup.select.Elements;
 
 public class AboutServiceImpl
   implements AboutService
 {
   public static final String MODEL_FILE_NAME = "config/domain/com/brc/system/about/help.xml";
   public static final String SYS_HELP_ENTITY = "help";
   public static final String SYS_HELP_DETAIL_ENTITY = "helpDetail";
   private ServiceUtil serviceUtil;
 
   public void setServiceUtil(ServiceUtil serviceUtil)
   {
     this.serviceUtil = serviceUtil;
   }
 
   private EntityDocument.Entity getEntity(String name)
   {
     return this.serviceUtil.getEntity("config/domain/com/brc/system/about/help.xml", name);
   }
 
   public Map<String, Object> loadTrees(SDO params)
   {
     QueryModel queryModel = this.serviceUtil.getEntityDao().getQueryModel(getEntity("help"), params.getProperties());
     return this.serviceUtil.getSQLQuery().executeQuery(queryModel, params);
   }
 
   public Long saveHelp(SDO sdo)
   {
     Long helpId = (Long)sdo.getProperty("helpId", Long.class);
 
     if ((helpId == null) || (helpId.compareTo(new Long(0L)) == 0))
       helpId = (Long)this.serviceUtil.getEntityDao().insert(getEntity("help"), sdo.getProperties());
     else {
       this.serviceUtil.getEntityDao().update(getEntity("help"), sdo.getProperties(), new String[0]);
     }
     List insertedDetails = new ArrayList();
     List updatedDetails = new ArrayList();
 
     DataUtil.getDetails(sdo, "helpId", helpId, insertedDetails, updatedDetails);
 
     if (insertedDetails.size() > 0) {
       this.serviceUtil.getEntityDao().batchInsert(getEntity("helpDetail"), insertedDetails);
     }
     if (updatedDetails.size() > 0) {
       this.serviceUtil.getEntityDao().batchUpdate(getEntity("helpDetail"), updatedDetails, new String[0]);
     }
     return helpId;
   }
 
   public Map<String, Object> loadHelp(SDO params)
   {
     return this.serviceUtil.getEntityDao().load(getEntity("help"), params.getProperties());
   }
 
   public void deleteHelp(SDO params)
   {
     this.serviceUtil.getEntityDao().deleteByCondition(getEntity("helpDetail"), params.getProperties());
     this.serviceUtil.getEntityDao().delete(getEntity("help"), params.getProperties());
   }
 
   public void deleteHelpDetail(Long[] ids)
   {
     this.serviceUtil.getEntityDao().deleteByIds(getEntity("helpDetail"), ids);
   }
 
   public Map<String, Object> slicedQueryHelpDetail(SDO params)
   {
     QueryModel query = this.serviceUtil.getEntityDao().getQueryModel(getEntity("helpDetail"), params.getProperties());
     return this.serviceUtil.getSQLQuery().executeSlicedQuery(query, params);
   }
 
   public void updateHelpDetailStatus(Long[] ids, int status)
   {
     this.serviceUtil.updateById("SYS_HELP_DETAIL", "status", "HELP_DETAIL_ID", ids, Integer.valueOf(status));
   }
 
   public List<Map<String, String>> loadHelpByCode(SDO sdo)
   {
     String code = (String)sdo.getProperty("code", String.class);
     String sql = this.serviceUtil.getEntityDao().getSqlByName(getEntity("helpDetail"), "loadHelpByCode");
     List<Map<String,Object>> list = this.serviceUtil.getEntityDao().queryToListMap(sql, new Object[] { code });
 
     File file = null;
     List rl = new ArrayList();
     for (Map map : list) {
       String tagId = (String)ClassHelper.convert(map.get("tagId"), String.class);
       String filePath = (String)ClassHelper.convert(map.get("filePath"), String.class);
       String helpId = (String)ClassHelper.convert(map.get("helpId"), String.class);
       file = FileHelper.getHelpFile(filePath);
       if ((file != null) && (file.exists())) {
         try {
           rl.addAll(readFile(filePath, file, tagId, helpId));
         } catch (Exception e) {
           LogHome.getLog(this).error(e);
         }
       }
     }
     return rl;
   }
 
   private List<Map<String, String>> readFile(String filePath, File file, String elementIds, String helpId)
     throws IOException
   {
     Document doc = Jsoup.parse(file, "utf-8", Singleton.getRealPath());
     Elements es = null;
     if (StringUtil.isBlank(elementIds)) {
       es = doc.getElementsByTag("help");
     } else {
       String[] ids = elementIds.split(",");
       es = new Elements();
       Element e = null;
       for (String id : ids) {
         e = doc.getElementById(id);
         es.add(e);
       }
     }
     List list = new ArrayList(es.size());
     Iterator it = es.iterator();
     Elements imgs = null;
     while (it.hasNext()) {
       Element e = (Element)it.next();
       imgs = e.getElementsByTag("img");
       for (Element img : imgs) {
         img.attr("file", img.attr("src"));
         img.attr("src", getViewImagesUrl(filePath, img.attr("src")));
       }
       String title = e.attr("title");
       String id = e.attr("id");
       String html = e.html();
       Map map = new HashMap(2);
       map.put("title", title);
       map.put("html", html);
       map.put("helpId", helpId);
       map.put("tagId", id);
       list.add(map);
     }
     return list;
   }
 
   public List<Map<String, Object>> queryHelpByKeyWork(SDO sdo)
     throws Exception
   {
     String keyword = (String)sdo.getProperty("keyword", String.class);
     int startPos = ((Integer)sdo.getProperty("total", Integer.class, Integer.valueOf(0))).intValue();
     int pagesize = ((Integer)sdo.getProperty("size", Integer.class, Integer.valueOf(20))).intValue();
     StringBuffer sb = new StringBuffer();
     sb.append(this.serviceUtil.getEntityDao().getSqlByName(getEntity("help"), "queryHelpByKeyWord"));
     Map map = new HashMap();
     if (!StringUtil.isBlank(keyword)) {
       String[] flag = keyword.toUpperCase().split(" ");
       for (int i = 0; i < flag.length; i++) {
         if ((flag[i] != null) && (!flag[i].equals(""))) {
           sb.append(" and (").append("upper(a.help_name) like :").append("keyword" + i);
           sb.append(" or ").append("upper(a.help_title) like :").append("keyword" + i);
           sb.append(" or ").append("upper(a.help_keyword) like :").append("keyword" + i);
           sb.append(")");
           map.put("keyword" + i, "%" + flag[i] + "%");
         }
       }
     }
     sb.append(" order by a.sequence asc");
 
     String pageSql = BuildSQLUtil.getOracleOptimizeSQL(startPos, pagesize, sb.toString());
     return this.serviceUtil.getEntityDao().queryToMapListByMapParam(pageSql, map);
   }
 
   public String queryParentIds(SDO sdo)
     throws Exception
   {
     Long helpId = (Long)sdo.getProperty("helpId", Long.class);
     if ((helpId == null) || (helpId.compareTo(new Long(0L)) <= 0)) {
       return "";
     }
     String sql = this.serviceUtil.getEntityDao().getSqlByName(getEntity("help"), "queryParentIds");
     List list = this.serviceUtil.getEntityDao().queryToList(sql, String.class, new Object[] { helpId });
     return ListUtil.join(list, ",");
   }
 
   public boolean hasModifPermissions(SDO sdo)
     throws Exception
   {
     String personId = sdo.getOperator().getId();
     StringBuffer sb = new StringBuffer();
     sb.append("select count(0)");
     sb.append("  from SA_OPOrg        o,");
     sb.append("       SA_OPAuthorize  a,");
     sb.append("       SA_OPRole       r,");
     sb.append("       SA_OPPermission p,");
     sb.append("       sa_opfunction   f");
     sb.append(" where o.person_id = ?");
     sb.append("   and o.status = 1");
     sb.append("   and o.org_kind_id = 'psm'");
     sb.append("   and o.full_id like a.org_full_id || '%'");
     sb.append("   and r.status = 1");
     sb.append("   and a.role_id = r.id");
     sb.append("   and p.role_id = r.id");
     sb.append("   and p.function_id = f.id");
     sb.append("   and p.permission_kind = 'fun'");
     sb.append("   and f.code = 'sysHelpManager'");
     int count = this.serviceUtil.getEntityDao().queryToInt(sb.toString(), new Object[] { personId });
     return count > 0;
   }
 
   public void saveHelpById(SDO sdo)
     throws Exception
   {
     Long helpId = (Long)sdo.getProperty("helpId", Long.class);
     String tagId = (String)sdo.getProperty("tagId", String.class);
     if (StringUtil.isBlank(tagId)) {
       throw new ApplicationException("编辑的帮助文件无标识ID,无法保存!");
     }
     Map help = this.serviceUtil.getEntityDao().loadById(getEntity("help"), helpId);
     String filePath = (String)ClassHelper.convert(help.get("filePath"), String.class);
     File file = FileHelper.getHelpFile(filePath);
     if ((file == null) || (!file.exists())) {
       throw new ApplicationException("帮助文件不存在,无法保存!");
     }
     Document doc = Jsoup.parse(file, "utf-8", Singleton.getRealPath());
     Element e = doc.getElementById(tagId);
     if (e == null) {
       throw new ApplicationException("帮助文件" + tagId + "不存在,无法保存!");
     }
     String title = (String)sdo.getProperty("title", String.class, "");
     String content = (String)sdo.getProperty("content", String.class, "");
     e.attr("title", title);
     e.html(content);
     Elements imgs = e.getElementsByTag("img");
     for (Element img : imgs) {
       img.attr("src", img.attr("file"));
       img.removeAttr("file");
       img.removeAttr("style");
     }
 
     FileOutputStream fos = new FileOutputStream(file, false);
     OutputStreamWriter osw = new OutputStreamWriter(fos, "utf-8");
     osw.write(doc.html());
     osw.close();
   }
 
   public String getHelpFileByHelpId(SDO sdo)
     throws Exception
   {
     Long helpId = (Long)sdo.getProperty("helpId", Long.class);
     Map help = this.serviceUtil.getEntityDao().loadById(getEntity("help"), helpId);
     String filePath = (String)ClassHelper.convert(help.get("filePath"), String.class);
     File file = FileHelper.getHelpFile(filePath);
     if ((file == null) || (!file.exists())) {
       throw new ApplicationException("帮助文件不存在!");
     }
     Document doc = Jsoup.parse(file, "utf-8", Singleton.getRealPath());
 
     Elements es = doc.getElementsByTag("img");
     for (Element e : es) {
       e.attr("src", getViewImagesUrl(filePath, e.attr("src")));
     }
     return doc.html();
   }
 
   private String getViewImagesUrl(String filePath, String src)
   {
     String url = src;
     File file = FileHelper.getHelpFile(filePath);
     String imgPath = file.getParent();
     File imgFile = new File(imgPath, src);
     if ((imgFile != null) && (imgFile.exists())) {
       url = Singleton.getContextPath() + "/viewImages.ajax?img=" + filePath.replace(file.getName(), src);
     }
     return url;
   }
 }

