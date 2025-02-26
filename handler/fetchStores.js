const fs = require('fs');
const path = require('path');
const { parse } = require('csv-parse');
const sqsClient = require('../utils/sqsClient.js')

exports.fetchStoresHandler = async (event) => {
    try {
       // Caminho do arquivo CSV local
        const csvFilePath = path.join(__dirname, '..', 'stores.csv');
        
        // Lê e processa o CSV
        const csvData = fs.readFileSync(csvFilePath, 'utf-8');
        await processCSV(csvData);

        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Lojas processadas com sucesso!' }),
        }; 

    } catch (error) {
        console.error('Erro ao processar o CSV local:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Erro ao processar o CSV local', error }),
        };
    }
}

async function processCSV(csvData) {
  const parser = parse(csvData, { columns: true });

  for await (const record of parser) {
    const placeId = record.place_id;
    const storeName = record.name;

    console.log(placeId)
    console.log(storeName)
    /*
    // Envia a loja para a fila SQS
    await sqsClient.sendMessage(SQS_QUEUE_URL, {
      place_id: placeId,
      name: storeName,
    });
    */
  }
}