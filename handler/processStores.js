const axios = require("axios");
const handlerError = require('../helpers/functions.js')
const Review = require('../models/Review');
require('dotenv').config();

const api_key = process.env.API_KEY

exports.processStoresHandler = async (event) => {

    const parsedBody = JSON.parse(event.body)

    for (const record of parsedBody.Records) {
        const { place_id: placeId, name } = JSON.parse(record.body);

        let allReviews = [];
        let nextPageToken = null;
        let pageCount = 0; 

        do {
            const params = {
                engine: "google_maps_reviews",
                place_id: placeId,
                api_key: api_key,
                next_page_token: nextPageToken, 
            };

            try {
                let response = await axios.get("https://serpapi.com/search", { params });
                const data = response.data;

                if (data.reviews) {
                    allReviews.push(
                        ...data.reviews.map((review) => ({
                            placeId: placeId, 
                            user: review.user.name,
                            rating: review.rating,
                            date: review.iso_date,
                            snippet: review.snippet,
                        }))
                    );

                    await Review.bulkCreate(allReviews);     

                }

                nextPageToken = data.serpapi_pagination?.next_page_token || null;
                pageCount++; 

            } catch (error) {
                return handlerError(error, "Erro ao processar a requisição", 500)
            }
        } while (pageCount < 1); 

        return {
            statusCode: 200,
            body: JSON.stringify({
                message: "Scraping realizado com sucesso"
            })
        }
    }
};
