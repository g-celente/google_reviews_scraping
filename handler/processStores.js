const { getJson } = require("serpapi");

const api_key = process.env.API_KEY;

async function fetchReviews(pageToken = null) {
    const params = {
        engine: "google_maps_reviews",
        data_id: "ChIJhxTcDIrVmwARm0brYm21Hkw",
        hl: "fr",  
        api_key: api_key, 
    };

    if (pageToken) {
        params.next_page_token = pageToken;
        params.num = 20;  
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

                const nextPageToken = json['next_page_token'];

                resolve({ reviews, nextPageToken });
            } else {
                reject('Não foi possível obter as avaliações.');
            }
        });
    });
}

exports.processStoresHandler = async (event) => {
    try {
        let pageToken = null;
        let allReviews = [];
        
        do {
            const { reviews, nextPageToken } = await fetchReviews(pageToken);
            allReviews = [...allReviews, ...reviews];
            pageToken = nextPageToken;
        } while (pageToken);

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
