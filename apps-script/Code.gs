const BUS_API_BASE = 'http://ws.bus.go.kr/api/rest/stationinfo/getStationByUid';
const DEFAULT_ARS_ID = '21347';
const DEFAULT_ROUTE_NAME = '관악11';

function doGet(e) {
  const params = (e && e.parameter) || {};
  const arsId = params.arsId || DEFAULT_ARS_ID;
  const routeName = params.routeName || DEFAULT_ROUTE_NAME;

  try {
    return jsonOutput(fetchBusArrival(arsId, routeName));
  } catch (error) {
    return jsonOutput({
      ok: false,
      error: 'PROXY_ERROR',
      message: String(error && error.message ? error.message : error)
    });
  }
}

function setupBusProperties(config) {
  const props = PropertiesService.getScriptProperties();
  const values = config || {};

  if (values.busApiKey) props.setProperty('BUS_API_KEY', values.busApiKey);
  if (values.alertEmail) props.setProperty('BUS_ALERT_EMAIL', values.alertEmail);
  if (values.arsId) props.setProperty('BUS_ALERT_ARS_ID', values.arsId);
  if (values.routeName) props.setProperty('BUS_ALERT_ROUTE_NAME', values.routeName);
  if (values.cooldownMinutes) props.setProperty('BUS_ALERT_COOLDOWN_MINUTES', String(values.cooldownMinutes));

  return {
    ok: true,
    hasBusApiKey: Boolean(props.getProperty('BUS_API_KEY')),
    alertEmail: props.getProperty('BUS_ALERT_EMAIL') || '',
    arsId: props.getProperty('BUS_ALERT_ARS_ID') || DEFAULT_ARS_ID,
    routeName: props.getProperty('BUS_ALERT_ROUTE_NAME') || DEFAULT_ROUTE_NAME
  };
}

function fetchBusArrival(arsId, routeName) {
  const props = PropertiesService.getScriptProperties();
  const serviceKey = props.getProperty('BUS_API_KEY');

  if (!serviceKey) {
    return {
      ok: false,
      error: 'NO_BUS_API_KEY',
      message: 'Script Properties에 BUS_API_KEY가 없습니다.'
    };
  }

  const url = BUS_API_BASE
    + '?serviceKey=' + formatServiceKey(serviceKey)
    + '&arsId=' + encodeURIComponent(arsId)
    + '&resultType=json';

  const response = UrlFetchApp.fetch(url, { muteHttpExceptions: true });
  const statusCode = response.getResponseCode();
  const text = response.getContentText();
  const payload = JSON.parse(text);
  const header = payload.msgHeader || {};

  if (statusCode >= 400 || (header.headerCd && header.headerCd !== '0')) {
    return {
      ok: false,
      error: 'BUS_API_ERROR',
      message: header.headerMsg || ('HTTP ' + statusCode),
      raw: payload
    };
  }

  const list = normalizeList(payload.msgBody && payload.msgBody.itemList);
  const filtered = list.filter(function (item) {
    const name = String(item.rtNm || item.busRouteAbrv || '');
    return !routeName || name.indexOf(routeName) !== -1;
  });
  const item = filtered[0] || list[0] || null;

  return {
    ok: true,
    arsId: arsId,
    routeName: routeName,
    item: item,
    arrmsg1: item && item.arrmsg1,
    arrmsg2: item && item.arrmsg2,
    secondsLeft: item && Number(item.exps1 || item.traTime1 || 0),
    raw: payload
  };
}

function checkBusAndSendMail() {
  const props = PropertiesService.getScriptProperties();
  const email = props.getProperty('BUS_ALERT_EMAIL');
  const arsId = props.getProperty('BUS_ALERT_ARS_ID') || DEFAULT_ARS_ID;
  const routeName = props.getProperty('BUS_ALERT_ROUTE_NAME') || DEFAULT_ROUTE_NAME;
  const cooldownMinutes = Number(props.getProperty('BUS_ALERT_COOLDOWN_MINUTES') || 10);

  if (!email) {
    throw new Error('Script Properties에 BUS_ALERT_EMAIL이 없습니다.');
  }

  const data = fetchBusArrival(arsId, routeName);
  const secondsLeft = Number(data.secondsLeft || 0);

  if (!data.ok || secondsLeft <= 0 || secondsLeft > 300 || recentlySent(cooldownMinutes)) {
    return;
  }

  MailApp.sendEmail(
    email,
    routeName + ' 도착 알림',
    routeName + '이 약 5분 이내 도착합니다: ' + (data.arrmsg1 || '')
  );
  CacheService.getScriptCache().put('bus-alert-sent', '1', cooldownMinutes * 60);
}

function recentlySent(cooldownMinutes) {
  return CacheService.getScriptCache().get('bus-alert-sent') === '1';
}

function formatServiceKey(value) {
  const trimmed = String(value || '').trim();
  return trimmed.indexOf('%') >= 0 ? trimmed : encodeURIComponent(trimmed);
}

function normalizeList(value) {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
}

function jsonOutput(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
