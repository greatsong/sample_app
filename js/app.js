const BUS_SETTINGS_KEY = "vibe-webapp-lab-bus-settings";
const DEFAULT_BUS = { arsId: "21347", routeName: "관악11" };

const elements = {
  status: document.querySelector("#status"),
  apiGrid: document.querySelector("#apiGrid"),
  mealVote: document.querySelector("#mealVote"),
  refreshButton: document.querySelector("#refreshButton"),
  weatherState: document.querySelector("#weatherState"),
  busState: document.querySelector("#busState"),
  mealState: document.querySelector("#mealState"),
  voteState: document.querySelector("#voteState"),
  busSettingsForm: document.querySelector("#busSettingsForm"),
  busServiceKey: document.querySelector("#busServiceKey"),
  busStationId: document.querySelector("#busStationId"),
  busRouteId: document.querySelector("#busRouteId"),
  clearBusSettings: document.querySelector("#clearBusSettings")
};

function getSavedBusSettings() {
  try {
    return JSON.parse(window.localStorage.getItem(BUS_SETTINGS_KEY) || "{}");
  } catch {
    return {};
  }
}

function getRuntimeConfig() {
  const saved = getSavedBusSettings();
  const config = structuredClone(window.APP_CONFIG);
  const baseBus = config.villageBus || {};
  const proxyUrl = saved.proxyUrl ?? baseBus.proxyUrl ?? "";
  const arsId = saved.arsId || baseBus.arsId || DEFAULT_BUS.arsId;
  const routeName = saved.routeName || baseBus.routeName || DEFAULT_BUS.routeName;

  config.villageBus = {
    ...baseBus,
    enabled: Boolean(baseBus.enabled || proxyUrl),
    proxyUrl,
    arsId,
    routeName
  };

  return config;
}

function loadBusSettingsForm() {
  const saved = getSavedBusSettings();
  const baseBus = window.APP_CONFIG.villageBus || {};
  elements.busServiceKey.value = saved.proxyUrl ?? baseBus.proxyUrl ?? "";
  elements.busStationId.value = saved.arsId || baseBus.arsId || DEFAULT_BUS.arsId;
  elements.busRouteId.value = saved.routeName || baseBus.routeName || DEFAULT_BUS.routeName;
}

async function loadItems() {
  setStatus("데이터를 불러오는 중...");
  const config = getRuntimeConfig();

  try {
    const results = await Promise.all([
      window.ApiServices.getWeather(config.weather),
      window.ApiServices.getVillageBus(config.villageBus),
      window.ApiServices.getSchoolMeal(config.schoolMeal)
    ]);
    renderApiCards(results);
    updateConnectionState(results);
    renderMealVote(results.find((item) => item.id === "meal"));
    setStatus(`${results.length}개 API 항목을 확인했습니다.`);
  } catch (error) {
    console.error(error);
    setStatus(`오류가 발생했습니다: ${error.message}`);
  }
}

function updateConnectionState(results) {
  const byId = Object.fromEntries(results.map((item) => [item.id, item]));
  elements.weatherState.textContent = byId.weather?.status || "확인 실패";
  elements.busState.textContent = byId.bus?.status || "확인 실패";
  elements.mealState.textContent = byId.meal?.status || "확인 실패";
  elements.voteState.textContent = "브라우저 localStorage 저장";
}

function renderApiCards(items) {
  elements.apiGrid.innerHTML = "";

  for (const item of items) {
    const card = document.createElement("article");
    card.className = "api-card";
    card.innerHTML = `<strong>${escapeHtml(item.title)}</strong><p>${escapeHtml(item.description)}</p><div class="meta-row"><span class="badge">${escapeHtml(item.status)}</span><small>${escapeHtml(item.source)}</small></div>`;
    elements.apiGrid.append(card);
  }
}

function renderMealVote(meal) {
  const meals = meal?.meals || [];
  const storageKey = window.APP_CONFIG.voting.storageKey;
  const votes = window.VoteStore.getVotes(storageKey);
  elements.mealVote.innerHTML = "";

  if (meals.length === 0 || meals.every((item) => item.menuItems.length === 0)) {
    elements.mealVote.innerHTML = '<p class="empty-note">투표할 급식 메뉴가 없습니다.</p>';
    return;
  }

  for (const mealItem of meals) {
    const group = document.createElement("section");
    group.className = "vote-day";
    group.innerHTML = `<h3>${escapeHtml(mealItem.title)}</h3>`;

    if (mealItem.menuItems.length === 0) {
      group.insertAdjacentHTML("beforeend", '<p class="empty-note">급식 데이터가 없습니다.</p>');
      elements.mealVote.append(group);
      continue;
    }

    for (const menuName of mealItem.menuItems) {
      const voteKey = `${mealItem.date}:${menuName}`;
      const card = document.createElement("article");
      card.className = "vote-card";
      card.innerHTML = `<strong>${escapeHtml(menuName)}</strong><div class="vote-row"><span>${votes[voteKey] || 0}표</span><button type="button" data-menu="${escapeHtml(voteKey)}">투표</button></div>`;
      group.append(card);
    }

    elements.mealVote.append(group);
  }
}

elements.busSettingsForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const settings = {
    proxyUrl: elements.busServiceKey.value.trim(),
    arsId: elements.busStationId.value.trim() || DEFAULT_BUS.arsId,
    routeName: elements.busRouteId.value.trim() || DEFAULT_BUS.routeName
  };
  window.localStorage.setItem(BUS_SETTINGS_KEY, JSON.stringify(settings));
  loadItems();
});

elements.clearBusSettings.addEventListener("click", () => {
  window.localStorage.removeItem(BUS_SETTINGS_KEY);
  loadBusSettingsForm();
  loadItems();
});

elements.mealVote.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-menu]");
  if (!button) return;
  window.VoteStore.addVote(window.APP_CONFIG.voting.storageKey, button.dataset.menu);
  loadItems();
});

function setStatus(message) {
  elements.status.textContent = message;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

elements.refreshButton.addEventListener("click", loadItems);
loadBusSettingsForm();
loadItems();
