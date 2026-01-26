// extrair o nome do país da URL
const params = new URLSearchParams(window.location.search);
const paisNome = params.get('pais');

// buscar os detalhes do país
const carregarDetalhesPais = (paisNome) => {
    fetch(`https://restcountries.com/v3.1/name/${paisNome}`)
    .then(res => res.json())
    .then(data => mostrarDetalhesPais(data[0]));
}

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

// exibir os detalhes do país
const mostrarDetalhesPais = (pais) => {
    document.title = `Procure o País - ${pais.name.common}`; // colocar o nome do país no título da página
    const detalhesContainer = document.getElementById('pais-detalhes');
    detalhesContainer.innerHTML = `
        <h4>${pais.name.common}</h4>
        <p></p>
        <img src="${pais.flags.png}">
        <p></p>
        <h3>Nome em português: ${pais.translations.por.common}</h3>
        <h3>Capital: ${pais.capital}</h3>
        <h3>Região: ${regiao[pais.region] || pais.region}</h3>
        <h3>Sub-região: ${(subRegiao[pais.subregion] || pais.subregion) || 'Não disponível'}</h3>
        <h3>População: ${pais.population ? pais.population : 'Não disponível'}</h3>
        <h3>Área: ${pais.area} km²</h3>
        <h3>Idiomas falados: ${Object.values(pais.languages).join(', ')}</h3>
        <h3>Moeda:${Object.values(pais.currencies)[0].name}</h3>
        <h3>Fuso horário: ${pais.timezones.join(', ')}</h3>
        <h3>Domínio de internet: ${pais.tld.join(', ')}</h3>
        <h3>Código de discagem: ${pais.idd.root}</h3>
        <p><b>Clique aqui para voltar</b></p>
    `;
}

// função para carregar os detalhes do país
carregarDetalhesPais(paisNome);

// botão de voltar para a home
const voltar = () => {
    window.history.back();
}
