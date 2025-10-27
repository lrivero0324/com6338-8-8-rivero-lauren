(function () {
	const API_KEY = "a675a7d4c8336eefe7b441ba25bfac71";

	const form = document.querySelector("#weather-app form");
	const input = document.querySelector("#weather-app input[name=search]") || document.getElementById('weather-search');
	const weatherEl = document.getElementById("weather");

	function clearWeather() {
		weatherEl.innerHTML = "";
	}

	function displayNotFound() {
		clearWeather();
		const p = document.createElement("p");
		p.textContent = "Location Not Found";
		weatherEl.appendChild(p);
	}

	function buildWeatherUI(data) {
		clearWeather();

		const name = data.name;
		const country = data.sys && data.sys.country ? data.sys.country : "";

		const h2 = document.createElement("h2");
		h2.textContent = name + (country ? ", " + country : "");

		const a = document.createElement("a");
		a.textContent = "Click to view map";
		a.href = `https://www.google.com/maps/search/?api=1&query=${data.coord.lat},${data.coord.lon}`;
		a.target = "__BLANK";

		const iconCode = data.weather && data.weather[0] && data.weather[0].icon;
		const img = document.createElement("img");
		if (iconCode) img.src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

		const desc = document.createElement("p");
		desc.style.textTransform = "capitalize";
		desc.textContent = data.weather && data.weather[0] && data.weather[0].description ? data.weather[0].description : "";

		const cur = document.createElement("p");
		cur.textContent = `Current: ${data.main.temp}° F`;

		const feels = document.createElement("p");
		feels.textContent = `Feels like: ${data.main.feels_like}° F`;

		const updated = document.createElement("p");
		const date = new Date(data.dt * 1000);
		const timeString = date.toLocaleTimeString("en-US", { hour: "numeric", minute: "numeric" });
		updated.textContent = `Last updated: ${timeString}`;

		weatherEl.appendChild(h2);
		weatherEl.appendChild(a);
		weatherEl.appendChild(img);
		weatherEl.appendChild(desc);
		weatherEl.appendChild(document.createElement('br'));
		weatherEl.appendChild(cur);
		weatherEl.appendChild(feels);
		weatherEl.appendChild(document.createElement('br'));
		weatherEl.appendChild(updated);
	}

	form.addEventListener("submit", function (e) {
		e.preventDefault();

		const query = (input.value || "").trim();

		clearWeather();
		input.value = "";

		if (!query) return;

		const base = "https://api.openweathermap.org/data/2.5/weather";
		const url = base + "?units=imperial&appid=" + API_KEY + "&q=" + query;

		fetch(url)
			.then((res) => {
				if (!res.ok) {
					displayNotFound();
					return null;
				}
				return res.json();
			})
			.then((data) => {
				if (!data) return;
				buildWeatherUI(data);
			})
			.catch((err) => {
				displayNotFound();
			});
	});
})();