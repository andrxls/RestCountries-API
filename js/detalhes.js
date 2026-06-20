const params = new URLSearchParams(window.location.search);
const paisNome = params.get('pais');

let paisesDataOriginal = [];

const carregarDetalhesPais = async (paisNome) => {
    const res = await fetch('./data/countries.json');
    const data = await res.json();
    paisesDataOriginal = data;

    const nomeFormatado = decodeURIComponent(paisNome);
    const pais = paisesDataOriginal.find(p =>
        p.names.common.toLowerCase() === nomeFormatado.toLowerCase()
    );

    mostrarDetalhesPais(pais);
};

const regiao = {
    'Africa': 'África',
    'Americas': 'Américas',
    'Asia': 'Ásia',
    'Europe': 'Europa'
};

const subRegiao = {
    'Middle Africa': 'África Central',
    'Western Africa': 'África Ocidental',
    'Eastern Africa': 'África Oriental',
    'Northern Africa': 'África Setentrional',
    'Southern Africa': 'África Austral',
    'North America': 'América do Norte',
    'Central America': 'América Central',
    'South America': 'América do Sul',
    'Caribbean': 'Caribe',
    'Central Asia': 'Ásia Central',
    'Eastern Asia': 'Ásia Oriental',
    'South-Eastern Asia': 'Sudeste Asiático',
    'Southern Asia': 'Sul da Ásia',
    'Western Asia': 'Oeste da Ásia',
    'Northern Europe': 'Europa Setentrional',
    'Western Europe': 'Europa Ocidental',
    'Southern Europe': 'Europa Meridional',
    'Eastern Europe': 'Europa Oriental',
    'Australia and New Zealand': 'Austrália e N. Zelândia',
    'Melanesia': 'Melanésia',
    'Micronesia': 'Micronésia',
    'Polynesia': 'Polinésia'
};

const mostrarDetalhesPais = (pais) => {
    document.title = `Procure o País - ${pais.names.common}`; // colocar o nome do país no título da página
    const detalhesContainer = document.getElementById('pais-detalhes');
    detalhesContainer.innerHTML = `
        <img src="${pais.flag.url_png}" onerror="this.src='https://cdn-icons-png.flaticon.com/512/616/616616.png'" alt="${pais.names.common}">
        <p></p>
        <h3>Nome em português: ${pais.names.translations.por.common}</h3>
        <h3>Capital: ${pais.capitals?.[0]?.name || 'Não disponível'}</h3>
        <h3>Região: ${regiao[pais.region] || pais.region}</h3>
        <h3>Sub-região: ${(subRegiao[pais.subregion] || pais.subregion) || 'Não disponível'}</h3>
        <h3>População: ${pais.population ? pais.population : 'Não disponível'}</h3>
        <h3>Área: ${pais.area.kilometers} km²</h3>
        <h3>Idioma oficial: ${pais.languages?.[0]?.name || 'Não disponível'}</h3>
        <h3>Moeda:${Object.values(pais.currencies)[0]?.name || 'Não disponível'}</h3>
        <h3>Fuso horário: ${pais.timezones?.join(', ')}</h3>
        <h3>Domínio de internet: ${pais.tlds?.[0]}</h3>
        <h3>Código de discagem: ${pais.calling_codes?.[0]}</h3>
        <p><b>Clique aqui para voltar</b></p>
    `;

    const lat = pais.coordinates?.lat;
    const lng = pais.coordinates?.lng;

    if (lat !== undefined && lng !== undefined) {
        setTimeout(() => {
            const mapa = L.map('mapa-pais', {
                center: [lat, lng],
                zoom: 4,
                zoomControl: true,
                scrollWheelZoom: true
            });

            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
                maxZoom: 18
            }).addTo(mapa);

            L.marker([lat, lng])
                .addTo(mapa)
                .bindPopup(`<b>${pais.names.common}</b>`)
                .openPopup();
        }, 50);
    } else {
        document.getElementById('mapa-pais').style.display = 'none';
    }
};

const voltar = () => {
    window.history.back();
};

carregarDetalhesPais(paisNome);