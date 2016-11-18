package com.brc.system.opm.service;

import com.brc.system.ValidStatus;
import com.brc.system.opm.Person;
import com.brc.system.opm.domain.Org;
import com.brc.system.opm.domain.OrgFunction;
import com.brc.util.SDO;
import java.util.List;
import java.util.Map;

public abstract interface OrgService
{
  public static final String ORG_ENTITY_NAME = "org";
  public static final String ORG_FUNCTION_ENTITY_NAME = "orgFunction";
  public static final String ORG_FUN_BIZ_MAN_TYPE_AUTHORIZ_ENTITY_NAME = "orgFunBizManTypeAuthorize";
  public static final String ORG_FUNCTION_AUTHORIZ_ENTITY_NAME = "orgFunctionAuthorize";
  public static final String RTX_ORG_CONTRAST_ENTITY_NAME = "rtxOrgContrast";
  public static final String MODEL_FILE_NAME = "config/domain/com/brc/system/opm/opm.xml";

  public abstract void insertOrgByTemplateId(SDO paramSDO);

  public abstract String insertOrg(SDO paramSDO);

  public abstract void adjustOrg(String paramString1, String paramString2);

  public abstract void updateOrg(SDO paramSDO);

  public abstract void logicDeleteOrg(String[] paramArrayOfString);

  public abstract void physicalDeleteOrg(String[] paramArrayOfString, boolean paramBoolean);

  public abstract void restoreOrg(String paramString, Long paramLong, boolean paramBoolean);

  public abstract void insertPersonMembers(String[] paramArrayOfString, String paramString, ValidStatus paramValidStatus, Boolean paramBoolean);

  public abstract String InsertPersonMember(String paramString1, String paramString2, String paramString3, String paramString4, ValidStatus paramValidStatus1, Org paramOrg, ValidStatus paramValidStatus2, boolean paramBoolean);

  public abstract void insertBizFunctions(String paramString, Long[] paramArrayOfLong, ValidStatus paramValidStatus);

  public abstract String formatPersonMemberID(String paramString1, String paramString2);

  public abstract void updateOrgSequence(Map<String, String> paramMap);

  public abstract void moveOrg(String paramString1, Long paramLong, String paramString2);

  public abstract void enableOrg(String paramString, Long paramLong, Boolean paramBoolean);

  public abstract void disableOrg(String paramString, Long paramLong);

  public abstract void assignPerson(String[] paramArrayOfString, String paramString);

  public abstract Map<String, Object> loadOrg(String paramString);

  public abstract Org loadOrgObject(String paramString);

  public abstract Org loadEnabledOrgObject(String paramString);

  public abstract List<Org> loadOrgListByLoginName(String paramString);

  public abstract Org loadMainOrgByLoginName(String paramString);

  public abstract Org loadMainOrgByName(String paramString);

  public abstract Org loadMainOrgByPersonId(String paramString);

  public abstract Org loadOrgObjectByFullId(String paramString);

  public abstract Org loadOrgObjectByFullName(String paramString);

  public abstract Map<String, Object> queryCustomOrgRoot(SDO paramSDO);

  public abstract Map<String, Object> queryOrgs(SDO paramSDO);

  public abstract Map<String, Object> slicedQueryOrgs(SDO paramSDO);

  public abstract String getOrgNextSequence(String paramString);

  public abstract String insertPerson(SDO paramSDO);

  public abstract void updatePersonSimple(SDO paramSDO);

  public abstract void updatePerson(SDO paramSDO);

  public abstract void updatePersonContactInfo(SDO paramSDO);

  public abstract void disablePerson(String paramString, Long paramLong);

  public abstract void enablePerson(String paramString, Long paramLong, boolean paramBoolean);

  public abstract void changePersonMainOrg(String paramString1, Long paramLong, String paramString2, boolean paramBoolean);

  public abstract String adjustPersonOrgStructure(String paramString1, String paramString2, boolean paramBoolean1, boolean paramBoolean2);

  public abstract void logicDeletePerson(String paramString, Long paramLong);

  public abstract void physicalDeletePerson(String paramString, Long paramLong);

  public abstract void restorePerson(String paramString, Long paramLong, boolean paramBoolean);

  public abstract void resetPassword(String paramString);

  public abstract Map<String, Object> loadPerson(String paramString);

  public abstract Person loadPersonObject(String paramString);

  public abstract Person loadPersonObjectByLoginName(String paramString);

  public abstract Map<String, Object> loadPersons(SDO paramSDO);

  public abstract List<Map<String, Object>> queryPersonMembersByPersonId(String paramString);

  public abstract String loadArchivesPictureByPersonId(String paramString);

  public abstract void updatePassword(SDO paramSDO);

  public abstract void updatePersonIsOperator(String paramString, Boolean paramBoolean);

  public abstract String getPersonIdByIdCard(String paramString);

  public abstract void quoteAuthorizationAndBizManagement(String paramString1, String paramString2);

  public abstract Long insertOrgFunction(SDO paramSDO);

  public abstract void updateOrgFunction(SDO paramSDO);

  public abstract void deleteOrgFunction(Long[] paramArrayOfLong);

  public abstract Long getOrgFunctionNextSequence(Long paramLong);

  public abstract void updateOrgFunctionSequence(Map<Long, Long> paramMap);

  public abstract void moveOrgFunction(Long[] paramArrayOfLong, Long paramLong);

  public abstract Map<String, Object> loadOrgFunction(Long paramLong);

  public abstract OrgFunction loadOrgFunctionObject(Long paramLong);

  public abstract Map<String, Object> queryOrgFunctions(SDO paramSDO);

  public abstract Map<String, Object> slicedQueryOrgFunctions(SDO paramSDO);

  public abstract void insertOrgFunBizManTypeAuthorize(Long paramLong, Long[] paramArrayOfLong);

  public abstract void updateOrgFunBizManTypeAuthorize(SDO paramSDO);

  public abstract void deleteOrgFunBizManTypeAuthorize(Long[] paramArrayOfLong);

  public abstract Map<String, Object> slicedQueryOrgFunBizManTypeAuthorizes(SDO paramSDO);

  public abstract void saveOrgFunctionAuthorize(String paramString, Long[] paramArrayOfLong);

  public abstract void deleteOrgFunctionAuthorize(Long[] paramArrayOfLong);

  public abstract Map<String, Object> slicedQueryOrgFunctionAuthorizes(SDO paramSDO);

  public abstract Map<String, Object> queryDeltaOrg(Long paramLong);

  public abstract Map<String, Object> slicedQueryDeltaOrg(SDO paramSDO);

  public abstract Map<String, Object> queryDeltaPerson(Long paramLong);

  public abstract Map<String, Object> slicedQueryDeltaPerson(SDO paramSDO);

  public abstract Boolean isPersonSynToAD(String paramString);

  public abstract void updateOperator(SDO paramSDO);

  public abstract void compareAD(String paramString);

  public abstract List<Org> queryProjectOrgByPersonId(String paramString);

  public abstract Org loadCompanyByOrgId(String paramString);

  public abstract void saveRtxOrgContrast(SDO paramSDO);

  public abstract void deleteRtxOrgContrast(Long[] paramArrayOfLong);
}

