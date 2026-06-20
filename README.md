# 🌍 Procure o País

> Aplicação web para explorar países e territórios do mundo, consumindo a API [RestCountries](https://api.restcountries.com).

---

> [!NOTE]
> Este projeto inicialmente utilizava a API RestCountries para obter os dados de países.
> 
> Após mudanças na API e para melhorar desempenho, estabilidade e independência de serviços externos, os dados foram migrados para um arquivo JSON local incluído no próprio projeto.
> 
> Isso remove dependências externas em produção e garante funcionamento consistente no GitHub Pages.


---

## Sobre

O **Procure o País** foi construído com foco na simplicidade: sem frameworks, sem dependências externas — apenas HTML, CSS e JavaScript puro.

O layout prioriza a função principal: encontrar países, filtrá-los, ordená-los e consultar seus detalhes. Para isso, a lista usa **scroll infinito**, carregando os resultados progressivamente sem necessidade de paginação.

---

## Funcionalidades

- 🔍 **Busca em tempo real** — a lista é atualizada a cada tecla digitada, ignorando acentos na comparação
- 🗂️ **Filtros por:**
  - Região
  - Sub-região
  - Faixa de população
- 🔃 **Ordenação por:**
  - Nome (A–Z ou Z–A)
  - População (crescente ou decrescente)
  - Área (crescente ou decrescente)
- 🏷️ **Filtro ativo visível** — o botão principal exibe qual filtro ou ordenação está em uso
- 📄 **Página de detalhes** — ao clicar em um país, o usuário é redirecionado para uma página com informações adicionais
- ♻️ **Botão Resetar** — limpa busca, filtros e ordenação de uma vez

---

## Tecnologias

![HTML](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white)
![CSS](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)

---

## API

Os dados são fornecidos pela **RestCountries v5**, que retorna informações como nome, bandeira, capital, região, população, área, idioma, moeda, fuso horário e muito mais.

