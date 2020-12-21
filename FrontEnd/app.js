const url = 'https://restcountries.eu/rest/v2/all';
            
async function getCountries(url) {
    const response = await fetch(url);
    const data = await response.json();

    sessionStorage.setItem('countries', JSON.stringify(data));
}

function prepareData() {
    let countries = JSON.parse(sessionStorage.getItem('countries'));
    let regions = [];
    let noFindRegion;

    if (countries && countries.length > 0) {

        countries.forEach(function(country) {
            noFindRegion = true;
            
            regions.forEach(function(region) {
                if (region == country.region){
                    noFindRegion = false;
                }
            });
            
            if (noFindRegion) {
                regions.push(country.region);
            }        
            
            if (country.isFavorite == undefined){
                country.isFavorite = false;
            }
            
            if (country.bordersName == undefined){                
                let bordersName = '';
                for (let index_borders in country.borders) {
                    for (let index_countries2 in countries) {
                        if (country.borders[index_borders] === countries[index_countries2].alpha3Code){
                            bordersName += countries[index_countries2].name + ', ';
                            break;
                        }
                    }                    
                }
                country.bordersName =  bordersName.substr(0, bordersName.length - 2);
            }
            
        });
        
        sessionStorage.setItem('countries', JSON.stringify(countries));
        sessionStorage.setItem('regions', regions.filter(function (region) {
            return (region != null && region != "");}).sort().toString());
        
    }
}

function listCountries() {
    let regions = sessionStorage.getItem('regions').split(',');
    let div;
    
    regions.forEach(function(region) {
        if (region.length > 0) {
            div = document.createElement('div');
            div.id = `${region}_div`;
            div.setAttribute('class', 'container_column');
            div.innerHTML = 
            `<h3>${region}</h3>
            <ul id="${region}" style="list-style-type:none"></ul>`;
            document.getElementById('container_regions_id').append(div);
        }
    });
        
    let countries = JSON.parse(sessionStorage.getItem('countries'));
    let ul;
    let li;

    countries.forEach(function(country) {
        ul = document.getElementById(country.region);
        if (ul !== null) {  
            let starIconHidden = 'hidden';
            if (country.isFavorite) {
                starIconHidden = '';
            }              
            
            li = document.createElement('li');
            li.id = 'li_' + country.alpha3Code;
            li.setAttribute('name', country.name);
            li.innerHTML = 
            `<span onclick="loadCountry('${country.alpha3Code}')">
            <img class="img_country" alt="" src="${country.flag}" height="15px" width="20px"> ${country.name}</img>
            <span id="star_${country.alpha3Code}" class="material-icons countries_span card_star_active ${starIconHidden}">star</span>
            </span>`;
            
            ul.append(li);
        }
    });
}

function loadCountry(code) {
    let country;
    let country_index = -1;    
    let countries = JSON.parse(sessionStorage.getItem('countries'));
    
    for (let index_countries in countries) {
        if (countries[index_countries].alpha3Code === code) {
            country_index = index_countries;
            country = countries[index_countries];
            break;
        }
    }

    if (country) {   
        if (country.currenciesName == undefined) {
            let currencies = '    ';
            for (let index_currency in country.currencies) {
                currencies += country.currencies[index_currency].name + ' - ';
            }
            country.currenciesName = currencies.substr(0, currencies.length - 3);
        }

        if (country.languagesName == undefined) {
            let languages = '    ';
            for (let index_language in country.languages) {
                languages += country.languages[index_language].name + ' - ';
            }
            country.languagesName = languages.substr(0, languages.length - 3);
        }
        
        let countryCard = document.getElementById("country_card")                
        let starIcon = 'star_outlined';
        let starIconClass = 'card_star_inactive';
        if (country.isFavorite) {
            starIcon = 'star';
            starIconClass = 'card_star_active';
        }
        
        if (country.PopulationFormat == undefined) {
            let PopulationFormat = '';
            if (Math.round(country.population/1000000) > 0) {
                PopulationFormat = Math.round(country.population/1000000) + ' Millones'
            } else {
                PopulationFormat = Math.round(country.population/1000) + ' Miles'
            }
            country.PopulationFormat = PopulationFormat;
        }
        
        countryCard.innerHTML = 
`<div class="row">
    <img class="card_flag" src=${country.flag} alt="">

    <div class="row">
        <h2>${country.name}
            <span id="country_star_${country.alpha3Code}" onclick="starChangeState('${country.alpha3Code}')" class="material-icons ${starIconClass}">${starIcon}</span>
        </h2>
    </div>
    <div class="row">
        <b>Region:</b> ${country.region}
    </div>
    <div class="row">
        <b>Population:</b> ${country.PopulationFormat}
    </div>
    <div class="row">
        <b>Capital:</b> ${country.capital}
    </div>
    <div class="row">
        <b>Currency:</b> ${country.currenciesName}
    </div>
    <div class="row">
        <b>Language:</b> ${country.languagesName}
    </div>
    <div class="row">
        <b>Border country: ${country.bordersName}</b>
    </div>                        
</div>`
    
        countries[country_index] = country;

        sessionStorage.setItem('position', country_index);
        sessionStorage.setItem('country', JSON.stringify(country));
        sessionStorage.setItem('countries', JSON.stringify(countries));

        overlayActive(true);
    }
}

function overlayActive(active) {       
    if (active) {
        document.getElementById("overlay").style.display = "block";
        document.getElementById("country_card").style.display = "block";
    } else {
        document.getElementById("overlay").style.display = "none";
        document.getElementById("country_card").style.display = "none";
    }
}

function starChangeState(code){
    const country = JSON.parse(sessionStorage.getItem('country'));

    country.isFavorite = !country.isFavorite;
    
    let country_star = document.getElementById('country_star_' + code);
    console.log(country_star);
    if (country.isFavorite) {
       document.getElementById('star_' + code).classList.remove('hidden');
       country_star.innerText = 'star';
       country_star.classList.add('card_star_active');
       country_star.classList.remove('card_star_inactive');
   } else {
        document.getElementById('star_' + code).classList.add('hidden');
        country_star.innerText = 'star_outlined';
        country_star.classList.add('card_star_inactive');
        country_star.classList.remove('card_star_active');
    }
    
    sessionStorage.setItem('country', JSON.stringify(country));
    
    countries = JSON.parse(sessionStorage.getItem('countries'));
    const country_index = sessionStorage.getItem('position');
    countries[country_index] = country;
    sessionStorage.setItem('countries', JSON.stringify(countries));
}

function keyupFilterCountries(e){
    if (e.key.toUpperCase() === 'ENTER') {
        filterCountries();
    }
}

function filterCountries(){ 
    const filterCountries = document.getElementById('search_country_id');
    const liCountries =  document.getElementsByTagName('li')

    const search_length = liCountries.length;
    let index_search = 0;
    while (index_search < search_length) {

        if (liCountries[index_search].getAttribute('name').toUpperCase().indexOf(filterCountries.value.toUpperCase()) > -1) {
            liCountries[index_search].style.display = '';
        } else {
            liCountries[index_search].style.display = 'none';
        }
        index_search ++;
    }
}

function startApp() {
    getCountries(url).then(()=> {
        prepareData();
        listCountries();
    }).catch((error) => {
        console.log('*** error cargando datos', error);
    });
    
    window.onscroll = function() {myFunction()};

    const header = document.getElementById('container_search');
    const sticky = header.offsetTop;
    
    function myFunction() {
        if (window.pageYOffset > sticky) {
            header.classList.add("container_search");
        }
    }
    
    document.getElementById('search_country_id').addEventListener('keyup', keyupFilterCountries);
    document.getElementById('search_country_button_id').addEventListener('click', filterCountries)
}

startApp()