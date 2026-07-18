import Papa from 'papaparse';

// Default Google Sheet ID for demo purposes (if user doesn't provide one)
// This should be replaced by the user's sheet ID or a demo one we provide.
// For now, I'll use a placeholder or a known public demo sheet if I had one.
// I'll create a function that accepts the sheet ID.

export const fetchProperties = async (sheetId) => {
    if (!sheetId) {
        return [];
    }

    let csvUrl;
    if (sheetId.startsWith('http')) {
        csvUrl = sheetId;
    } else {
        csvUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/pub?output=csv`;
    }

    try {
        const response = await fetch(csvUrl);
        if (!response.ok) {
            throw new Error(`Failed to fetch CSV: ${response.statusText}`);
        }
        const csvText = await response.text();

        return new Promise((resolve, reject) => {
            Papa.parse(csvText, {
                header: true,
                skipEmptyLines: true,
                complete: (results) => {
                    const properties = results.data.map((row, index) => {
                        // Re-parse images for each row context if needed, but better to do it inside map
                        const rowImages = row.url_imagem ? row.url_imagem.split(',').map(url => url.trim()) : [];
                        const rowMainImage = rowImages.length > 0 ? rowImages[0] : 'https://placehold.co/600x400?text=Sem+Imagem';

                        return {
                            id: index, // Generate a simple ID
                            title: row.titulo || 'Sem título',
                            description: row.descricao || '',
                            price: parsePrice(row.preco),
                            type: row.tipo || '',
                            city: row.cidade || '',
                            neighborhood: row.bairro || '',
                            area: row.metragem || '',
                            bedrooms: parseInt(row.quartos) || 0,
                            bathrooms: parseInt(row.banheiros) || 0,
                            garage: parseInt(row.garagem) || 0,
                            image: rowMainImage,
                            images: rowImages,
                            mapUrl: row.url_maps || '',
                            category: row.categoria || 'Venda',
                            featured: row.destaque === 'TRUE' || row.destaque === 'sim' || false,
                        };
                    });
                    resolve(properties);
                },
                error: (error) => {
                    reject(error);
                }
            });
        });
    } catch (error) {
        // Silently fail and return empty array
        return [];
    }
};

const parsePrice = (priceStr) => {
    if (!priceStr) return 0;
    // Remove currency symbols and dots/commas if needed
    // Assuming input might be "R$ 500.000,00" or just "500000"
    const cleanStr = priceStr.toString().replace(/[^\d,]/g, '').replace(',', '.');
    return parseFloat(cleanStr) || 0;
};
