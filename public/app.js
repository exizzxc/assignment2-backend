const cityForm = document.getElementById("cityForm");
const cityInput = document.getElementById("cityInput");
const weatherResult = document.getElementById("weatherResult");
const newsResult = document.getElementById("newsResult");

const countryForm = document.getElementById("countryForm");
const countryInput = document.getElementById("countryInput");
const countryResult = document.getElementById("countryResult");

const globalError = document.getElementById("globalError");

function setError(message) {
  if (!message) {
    globalError.textContent = "";
  } else {
    globalError.textContent = message;
  }
}

function renderWeather(data) {
  if (!data || data.error) {
    weatherResult.innerHTML = `<p class="error">${data?.error || "Failed to load weather"}</p>`;
    return;
  }

  weatherResult.innerHTML = `
    <h3>Weather for ${data.city} (${data.countryCode || "N/A"})</h3>
    <p><strong>Temperature:</strong> ${data.temperature} °C (feels like ${data.feelsLike} °C)</p>
    <p><strong>Description:</strong> ${data.description}</p>
    <p><strong>Wind speed:</strong> ${data.windSpeed} m/s</p>
    <p><strong>Coordinates:</strong> [${data.coordinates.lat}, ${data.coordinates.lon}]</p>
    <p><strong>Rain (last 3h):</strong> ${data.rainLast3h} mm</p>
  `;
}

function renderNews(data) {
  if (!data || data.error) {
    newsResult.innerHTML = `<p class="error">${data?.error || "Failed to load news"}</p>`;
    return;
  }

  if (!data.articles || data.articles.length === 0) {
    newsResult.innerHTML = `<p>No news found for this city.</p>`;
    return;
  }

  const items = data.articles
    .map(
      (a) => `
      <div class="news-item">
        <a href="${a.url}" target="_blank">${a.title}</a>
        <p>${a.description || ""}</p>
        <small>${a.source || ""} · ${new Date(a.publishedAt).toLocaleString()}</small>
      </div>
    `
    )
    .join("");

  newsResult.innerHTML = `
    <h3>Latest news for ${data.city}</h3>
    ${items}
  `;
}

function renderCountry(data) {
  if (!data || data.error) {
    countryResult.innerHTML = `<p class="error">${data?.error || "Failed to load country info"}</p>`;
    return;
  }

  countryResult.innerHTML = `
    <h3>${data.flag || ""} ${data.name} (${data.cca2})</h3>
    <p><strong>Official name:</strong> ${data.officialName}</p>
    <p><strong>Region:</strong> ${data.region} (${data.subregion || ""})</p>
    <p><strong>Capital:</strong> ${data.capital || "N/A"}</p>
    <p><strong>Population:</strong> ${data.population.toLocaleString()}</p>
    <p><strong>Area:</strong> ${data.area.toLocaleString()} km²</p>
    <p><strong>Currencies:</strong> ${data.currencies.join(", ")}</p>
    <p><strong>Languages:</strong> ${data.languages.join(", ")}</p>
  `;
}

cityForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  setError("");
  weatherResult.innerHTML = "Loading weather...";
  newsResult.innerHTML = "Loading news...";

  const city = cityInput.value.trim();
  if (!city) {
    setError("Please enter a city.");
    return;
  }

  try {
    const [weatherRes, newsRes] = await Promise.all([
      fetch(`/api/weather?city=${encodeURIComponent(city)}`),
      fetch(`/api/news?city=${encodeURIComponent(city)}`),
    ]);

    const weatherData = await weatherRes.json();
    const newsData = await newsRes.json();

    renderWeather(weatherData);
    renderNews(newsData);
  } catch (err) {
    console.error(err);
    setError("Failed to load city data. Check server or network.");
  }
});

countryForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  setError("");
  countryResult.innerHTML = "Loading country info...";

  const country = countryInput.value.trim();
  if (!country) {
    setError("Please enter a country.");
    return;
  }

  try {
    const res = await fetch(`/api/country?name=${encodeURIComponent(country)}`);
    const data = await res.json();
    renderCountry(data);
  } catch (err) {
    console.error(err);
    setError("Failed to load country data. Check server or network.");
  }
});