const map = document.querySelector('svg');
const countries = document.querySelectorAll('path');
const sidePanel = document.querySelector('.side-panel'); 
const container = document.querySelector('.container');
const closeBtn = document.querySelector('.close-btn');
const loading = document.querySelector('.loading');

const zoomInBtn = document.querySelector('.zoom-in');
const zoomOutBtn = document.querySelector('.zoom-out');

const zoomValueOutput = document.querySelector('.zoom-value');

const countryNameOutput = document.querySelector('.country-name');
const countryFlagOutput = document.querySelector('.country-flag');

const cityOutput = document.querySelector('.city');
const areaOutput = document.querySelector('.area');

const currencyOutput = document.querySelector('.currency');

const languagesOutput = document.querySelector('.languages');

// Highlight the country on hover
countries.forEach(country => {
  country.addEventListener('mouseenter', function () {
    const classList = [...this.classList].join('.');
    const selector = '.' + classList;
    const matchingElements = document.querySelectorAll(selector);
    matchingElements.forEach(el => el.style.fill = '#c99aff');
  });

  country.addEventListener('mouseout', function () {
    const classList = [...this.classList].join('.');
    const selector = '.' + classList;
    const matchingElements = document.querySelectorAll(selector);
    matchingElements.forEach(el => el.style.fill = '#443d4b');
  });

  country.addEventListener('click', function (e) {
    loading.innerText = 'Loading...';
    container.classList.add('hide');
    loading.classList.remove('hide');

    let clickCountryName;

    if (e.target.hasAttribute('name')) {
      clickCountryName = e.target.getAttribute('name');
    } else {
      clickCountryName = e.target.classList.value;
    }

    sidePanel.classList.add('side-panel-open');
    fetch(`https://restcountries.com/v3.1/name/${clickCountryName}?fullText=true`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        console.log(data);

        setTimeout(() => {
          countryNameOutput.innerText = data[0].name.common;
          countryFlagOutput.src = data[0].flags.png;

          cityOutput.innerText = data[0].capital;

          const formattedNumber = data[0].area.toLocaleString('de-DE');
          areaOutput.innerHTML = formattedNumber + ' km<sup>2</sup>';

          const currencies = data[0].currencies;
          currencyOutput.innerHTML = ''; // Clear existing currencies
          Object.keys(currencies).forEach(key => {
            currencyOutput.innerHTML += `<li>${currencies[key].name}</li>`;
          });

          const languages = data[0].languages;
          languagesOutput.innerHTML = ''; // Clear existing languages
          Object.keys(languages).forEach(key => {
            languagesOutput.innerHTML += `<li>${languages[key]}</li>`;
          });

          countryFlagOutput.onload = () => {
            container.classList.remove('hide');
            loading.classList.add('hide');
          };
        }, 500);
      })
      .catch(error => {
        loading.innerText = 'No data to show for the selected country';
        console.error('There was a problem with the fetch operation:', error);
      });
  });
});

closeBtn.addEventListener('click', () => {
  sidePanel.classList.remove('side-panel-open');
});

let zoomValue = 100;
zoomOutBtn.disabled = true;

zoomInBtn.addEventListener('click', () => {
  zoomValue += 100;
  map.style.width = zoomValue + 'vw';
  map.style.height = zoomValue + 'vh';

  if (zoomValue >= 500) {
    zoomInBtn.disabled = true;
  } else {
    zoomInBtn.disabled = false;
  }

  zoomOutBtn.disabled = false;
  zoomValueOutput.innerText = zoomValue + '%';
});

zoomOutBtn.addEventListener('click', () => {
  zoomValue -= 100;
  map.style.width = zoomValue + 'vw';
  map.style.height = zoomValue + 'vh';

  if (zoomValue <= 100) {
    zoomOutBtn.disabled = true;
  } else {
    zoomOutBtn.disabled = false;
  }

  zoomInBtn.disabled = false;
  zoomValueOutput.innerText = zoomValue + '%';
});
