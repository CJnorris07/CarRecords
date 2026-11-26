let allRecords = [];
let currentUnit = 'kmh';
let currentFilter = 'all';
let searchQuery = '';
const recordsList = document.getElementById('records-list');
const searchInput = document.getElementById('search');
const filterButtons = document.querySelectorAll('.filters button');
const unitButtons = document.querySelectorAll('.units button');
async function loadRecords() {
    try {
        const response = await fetch('data.json');
        if (!response.ok) {
            throw new Error('Ошибка загрузки базы данных');
        }
        allRecords = await response.json();
        renderRecords();
    } catch (error) {
        recordsList.innerHTML = `
      <div class="empty-message">
        Не удалось загрузить базу рекордов. Убедитесь, что сайт запущен через локальный сервер (Live Server).
      </div>
    `;
    console.error(error);
    }
}
function renderRecords() {
    const filtered = allRecords.filter((car) => {
        const matchesCategory = currentFilter === 'all' || car.category === currentFilter;
        const query = searchQuery.toLowerCase();
        const matchesSearch = 
        car.name.toLowerCase().includes(query) ||
        car.driver.toLowerCase().includes(query) ||
        car.location.toLowerCase().includes(query);
        return matchesCategory && matchesSearch;
    });
    recordsList.innerHTML = '';
    if (filtered.length === 0) {
        recordsList.innerHTML = `
      <div class="empty-message">
        По вашему запросу рекордов не найдено. Попробуйте изменить параметры поиска.
      </div>
    `;
    return;
    }
    filtered.forEach((car) => {
        const speedValue = currentUnit === 'kmh' ? car.speedKmh : car.speedMph;
        const speedLabel = currentUnit === 'kmh' ? 'КМ/Ч' : 'М/Ч';
        const badgeClass = car.verified ? 'card-badge' : 'card-badge unverified';
        const badgeText = car.verified ? 'FIA / официально' : 'Расчетный / 1-way';
        const lapTimeHtml = car.lapTime ? `<li>Время круга: <strong>${car.lapTime}</strong></li>` : '';
        const card = document.createElement('article');
        card.className = 'card';
        card.innerHTML = `
      <div class="card-img-wrap">
        <img src="${car.image}" alt="${car.name}" onerror="this.style.display='none'">
        <span class="${badgeClass}">${badgeText}</span>
      </div>

      <div class="card-body">
        <div>
          <div class="card-category">${car.categoryLabel} • ${car.year}</div>
          <h3 class="card-title">${car.name}</h3>
        </div>

        <div class="card-speed">
          ${speedValue} <span>${speedLabel}</span>
        </div>

        <ul class="card-specs">
          <li>Разгон 0–60 миль/ч: <strong>${car.zeroToSixty}</strong></li>
          ${lapTimeHtml}
          <li>Пилот: <strong>${car.driver}</strong></li>
          <li>Место: <strong>${car.location}</strong></li>
        </ul>

        <a href="car.html?id=${car.id}" class="card-link">Подробнее о рекорде</a>
      </div>
    `;
    recordsList.appendChild(card);
    })
}
unitButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
        unitButtons.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        currentUnit = btn.dataset.unit;
        renderRecords();
    });
});
filterButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
        filterButtons.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        currentFilter = btn.dataset.filter;
        renderRecords();
    });
});
searchInput.addEventListener('input', e => {
    searchQuery = e.target.value.trim();
    renderRecords();
});
loadRecords();