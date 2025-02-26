const { getJson } = require("serpapi");

async function fetchReviews(pageToken = null) {
    const params = {
        engine: "google_maps_reviews",
        data_id: "ChIJhxTcDIrVmwARm0brYm21Hkw", // ID de dados da loja (modifique conforme necessário)
        hl: "fr",  // Linguagem, pode ser ajustado conforme necessário
        api_key: "e03883da7177a621f633bb6aadf9a3f7d21ab3019de5351c77d6a60ac38d3e49", // sua chave API da SerpApi
    };

    // Se houver um next_page_token, adicionar à requisição o num para pegar mais avaliações por página
    if (pageToken) {
        params.next_page_token = pageToken;
        params.num = 20;  // Só adiciona o num se já houver um next_page_token (para páginas subsequentes)
    }

    return new Promise((resolve, reject) => {
        getJson(params, (json) => {
            if (json['reviews']) {
                // Extrair dados das avaliações
                const reviews = json['reviews'].map(review => ({
                    author_name: review.user.name,
                    author_id: review.user.contributor_id,
                    rating: review.rating,
                    comment: review.snippet
                }));

                console.log(reviews); // Exibindo as avaliações

                // Verificar se há uma próxima página
                const nextPageToken = json['next_page_token'];

                resolve({ reviews, nextPageToken });
            } else {
                reject('Não foi possível obter as avaliações.');
            }
        });
    });
}

const processStoresHandler = async () => {
    try {
        let pageToken = null;
        let allReviews = [];
        
        // Continuar buscando as páginas até não haver mais
        do {
            const { reviews, nextPageToken } = await fetchReviews(pageToken);
            allReviews = [...allReviews, ...reviews];
            pageToken = nextPageToken;
        } while (pageToken); // Continuar até não haver mais próxima página

        // Retornar todas as avaliações obtidas
        return {
            statusCode: 200,
            body: JSON.stringify({ reviews: allReviews }),
        };
    } catch (error) {
        console.error(error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Erro ao processar avaliações.' }),
        };
    }
};
