window.ApiServices = {
  async getWeather(config) {
    if (!config.enabled) return disabledResult("weather", "날씨", "설정이 꺼져 있습니다.");

    const params = new URLSearchParams({
      latitude: config.latitude,
      longitude: config.longitude,
      current: "temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m",
      timezone: "Asia/Seoul"
    });
    const response = await fetch(`https://api.open-meteo.com/v1/forecast?${params}`);
    if (!response.ok) throw new Error(`날씨 API 요청 실패: ${response.status}`);

    const payload = await response.json();
    const current = payload.current;
    return {
      id: "weather",
      title: `${config.label} 현재 날씨`,
      description: `${current.temperature_2m}도, 습도 ${current.relative_humidity_2m}%, 바람 ${current.wind_speed_10m}km/h`,
      source: "Open-Meteo",
      status: "실시간 연결",
      raw: payload
    };
  },

  async getVillageBus(config) {
    if (!config.enabled || !config.proxyUrl) {
      return {
        id: "bus",
        title: "마을버스 도착 정보",
        description: "Apps Script 프록시 URL을 입력하면 관악11 연희빌라 도착 정보를 표시합니다.",
        source: "Apps Script 버스 프록시",
        status: "설정 필요",
        raw: null
      };
    }

    const params = new URLSearchParams({
      arsId: config.arsId || "21347",
      routeName: config.routeName || "관악11"
    });
    const response = await fetch(`${config.proxyUrl}?${params}`);
    if (!response.ok) throw new Error(`버스 프록시 요청 실패: ${response.status}`);

    const payload = await response.json();
    if (payload.error) {
      return {
        id: "bus",
        title: "마을버스 도착 정보",
        description: payload.message || payload.error,
        source: "Apps Script 버스 프록시",
        status: "API 오류",
        raw: payload
      };
    }

    const item = payload.item || {};
    const route = item.rtNm || item.busRouteAbrv || payload.routeName || config.routeName || "버스";
    const firstMessage = item.arrmsg1 || payload.arrmsg1 || "도착 정보가 없습니다.";
    const secondMessage = (item.arrmsg2 || payload.arrmsg2) ? ` / 다음 ${item.arrmsg2 || payload.arrmsg2}` : "";
    return {
      id: "bus",
      title: `${route} 도착 정보`,
      description: `${firstMessage}${secondMessage}`,
      source: "Apps Script 버스 프록시",
      status: "실시간 연결",
      raw: payload
    };
  },

  async getSchoolMeal(config) {
    if (!config.enabled) return disabledResult("meal", "NEIS 급식", "설정이 꺼져 있습니다.");

    const startDate = config.mealDate || getKoreanToday();
    const endDate = addDays(startDate, 1);
    const mealCode = config.mealCode || "2";
    const params = new URLSearchParams({
      Type: "json",
      ATPT_OFCDC_SC_CODE: config.educationOfficeCode,
      SD_SCHUL_CODE: config.schoolCode,
      pIndex: "1",
      pSize: "20",
      MLSV_FROM_YMD: startDate,
      MLSV_TO_YMD: endDate
    });
    const response = await fetch(`https://open.neis.go.kr/hub/mealServiceDietInfo?${params}`);
    if (!response.ok) throw new Error(`NEIS 급식 API 요청 실패: ${response.status}`);

    const payload = await response.json();
    const rows = payload.mealServiceDietInfo?.[1]?.row || [];
    const meals = [startDate, endDate].map((date, index) => {
      const row = findMealForDate(rows, date, mealCode);
      return rowToMeal(row, date, index === 0 ? "오늘" : "내일");
    });
    const availableMeals = meals.filter((meal) => meal.menuItems.length > 0);

    if (availableMeals.length === 0) {
      return {
        id: "meal",
        title: `${config.schoolName} 오늘/내일 급식`,
        description: `${formatDate(startDate)}와 ${formatDate(endDate)} 급식 데이터가 없습니다.`,
        source: "NEIS 급식식단정보",
        status: "데이터 없음",
        meals,
        menuItems: [],
        raw: payload
      };
    }

    return {
      id: "meal",
      title: `${config.schoolName} 오늘/내일 급식`,
      description: meals.map(formatMealSummary).join(" / "),
      source: "NEIS 급식식단정보",
      status: "실시간 연결",
      meals,
      menuItems: availableMeals.flatMap((meal) => meal.menuItems),
      raw: payload
    };
  }
};

function disabledResult(id, title, description) {
  return { id, title, description, source: "설정", status: "꺼짐", raw: null };
}

function cleanMealText(value) {
  return String(value || "")
    .replaceAll("<br/>", "\n")
    .split("\n")
    .map((item) => item.replace(/[0-9.()]/g, "").trim())
    .filter(Boolean);
}

function formatDate(value) {
  if (!value || value.length !== 8) return "";
  return `${value.slice(0, 4)}-${value.slice(4, 6)}-${value.slice(6, 8)}`;
}

function getKoreanToday() {
  const formatter = new Intl.DateTimeFormat("ko-KR", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  });
  const parts = Object.fromEntries(formatter.formatToParts(new Date()).map((part) => [part.type, part.value]));
  return `${parts.year}${parts.month}${parts.day}`;
}

function addDays(yyyymmdd, amount) {
  const date = new Date(Date.UTC(Number(yyyymmdd.slice(0, 4)), Number(yyyymmdd.slice(4, 6)) - 1, Number(yyyymmdd.slice(6, 8))));
  date.setUTCDate(date.getUTCDate() + amount);
  return date.toISOString().slice(0, 10).replaceAll("-", "");
}

function findMealForDate(rows, date, mealCode) {
  return rows.find((row) => row.MLSV_YMD === date && (!mealCode || row.MMEAL_SC_CODE === mealCode))
    || rows.find((row) => row.MLSV_YMD === date)
    || null;
}

function rowToMeal(row, date, label) {
  if (!row) {
    return {
      date,
      label,
      mealName: "중식",
      title: `${label} ${formatDate(date)}`,
      menuItems: []
    };
  }

  return {
    date: row.MLSV_YMD || date,
    label,
    mealName: row.MMEAL_SC_NM || "급식",
    title: `${label} ${formatDate(row.MLSV_YMD || date)} ${row.MMEAL_SC_NM || ""}`.trim(),
    menuItems: cleanMealText(row.DDISH_NM)
  };
}

function formatMealSummary(meal) {
  if (meal.menuItems.length === 0) return `${meal.title}: 데이터 없음`;
  return `${meal.title}: ${meal.menuItems.join(", ")}`;
}
