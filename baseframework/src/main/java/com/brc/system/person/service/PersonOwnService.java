package com.brc.system.person.service;

import com.brc.system.opm.Operator;
import com.brc.util.SDO;
import java.io.Serializable;
import java.util.Date;
import java.util.List;
import java.util.Map;

public abstract interface PersonOwnService
{
  public static final String MODEL_FILE_NAME = "config/domain/com/brc/system/cfg/personOwn.xml";
  public static final String SYS_PERSON_NOTES_ENTITY = "personNotes";
  public static final String SYS_PERSON_WORKCALENDAR_ENTITY = "personWorkcalendar";
  public static final String SYS_REPEAT_CALENDAR_ENTITY = "repeatCalendar";
  public static final String SYS_REPEAT_CALENDAR_SCHEDULE_ENTITY = "repeatCalendarSchedule";
  public static final String SYS_PERSON_TASK_COLLECT_ENTITY = "personTaskCollect";
  public static final String SYS_PERSON_QUERY_SCHEME_ENTITY = "personQueryScheme";
  public static final String SYS_PERSON_INFO_COLLECT_ENTITY = "personInfoCollect";
  public static final String ERP_USER = "erpUser";

  public abstract List<Map<String, Object>> getUsersNotes(String paramString);

  public abstract Long saveNote(SDO paramSDO);

  public abstract void updateNote(SDO paramSDO);

  public abstract void deleteNote(Long[] paramArrayOfLong);

  public abstract void deleteAll(String paramString);

  public abstract Map<String, Object> slicedQueryPersonNotes(SDO paramSDO);

  public abstract List<Map<String, Object>> queryCalendar(Operator paramOperator, Date paramDate1, Date paramDate2);

  public abstract Long saveCalendar(SDO paramSDO);

  public abstract void updateCalendar(SDO paramSDO);

  public abstract void updateCalendarColor(Long paramLong, String paramString);

  public abstract void deleteCalendar(Long paramLong);

  public abstract Map<String, Object> getCalendar(Long paramLong);

  public abstract void saveParticularCalendar(SDO paramSDO);

  public abstract Serializable insertTaskCollect(SDO paramSDO);

  public abstract void deleteTaskCollect(SDO paramSDO);

  public abstract Serializable insertInfoCollect(SDO paramSDO);

  public abstract void deleteInfoCollect(SDO paramSDO);

  public abstract Serializable saveQueryScheme(SDO paramSDO);

  public abstract Map<String, Object> loadQueryScheme(SDO paramSDO);

  public abstract List<Map<String, Object>> queryQueryScheme(String paramString1, String paramString2);

  public abstract void deleteQueryScheme(Long paramLong);

  public abstract void updateErpUserStatus(SDO paramSDO);
}

