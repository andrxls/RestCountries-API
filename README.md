# Procure o País

Chamado simplesmente de Procure o País, este projeto é de uma aplicação que consome a API RestCountries e mostra todos os países e territórios do mundo e alguns de seus detalhes.

O layout foi feito de modo que fosse simples e não fugisse da principal função: procurar países, filtra-los, ordena-los e mostrar mais detalhes. Por isso, foi utilizado um scroll infinito para mostrar todos os países sem a necessidade de clicar em botões para modificar a página.

Ele inclui um input de busca que, a cada tecla digitada, a página é atualizada mostrando os países com o termo digitado.

Os botões de filtros e ordenação estão organizados em menus drop-down da seguinte forma:
- Filtro: Região, Sub-região e População.
- Ordenar: Nome (A-Z) ou (Z-A), População crescente ou decrescente e Área crescente ou decrescente.

Ao clicar em um desses botões, o botão principal é atualizado mostrando qual filtro ou ordenação está em vigor, para facilitar a usabilidade e dar transparência ao que está sendo mostrado para o usuário.

Ao clicar em uma caixa de país, o usuário é redirecionado para outra página contendo informações adicionais sobre o país selecionado. Se clicar novamente na caixa ou no botão de voltar, ele é redirecionado de volta.

A página também inclui um botão de Resetar, para limpar todos os campos de busca, filtro e ordenação para que o usuário possa começar do 0 novamente.

Apenas Javascript, HTML e CSS foram utilizados no projeto.
