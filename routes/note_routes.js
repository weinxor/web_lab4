const db = require('../dataBase');
const axios = require('axios');
const APIKey = 'bcec4b05cf3cf0fdcb2a74e73b9428e3';
module.exports = function(app) {
    app.get('/', (request, response) => {
        response.json({ info: 'Welcome to the server' })
    });

    app.get('/ping', (request, response) => {
        response.json({ info: 'pong' })
    });

    app.get('/favorites', async (request, response) => {
        try {
            response.json(await db.getFavorites());
        } catch(e) {
            response.status(424).json(e);
        } finally {
            response.end();
        }
    });

    app.post('/favorites', async (request, response) => {
        try {
            const { name } = request.body;
            response.json(await db.addFavorite(name));
        } catch(e) {
            response.status(424).json(e);
        } finally {
            response.end();
        }
    });

    app.delete('/favorites/:name', async (request, response) => {
        try {
            const name = request.params.name;
            response.json(await db.deleteFavorite(name));
        } catch(e) {
            response.code(424);
            response.json({ message: 'Something wend wrong' });
        } finally {
            response.end();
        }
    });

    app.get('/weather/city/:town', async (request, response) => {
        try {
            const { town } = request.params;
            await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${town}&units=metric&APPID=${APIKey}`)
                .then(result => response.json(result.data))
                .catch(x => response.status(424).json(x));
        } finally {
            response.end();
        }
    });

    app.get('/weather/coordinates/:long&:lat', async (request, response) => {
        try {
            const { lat, long } = request.params;
            await axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&units=metric&APPID=${APIKey}`)
                .then(result => response.json(result.data))
                .catch(x => response.status(424).json(x));
        } finally {
            response.end();
        }
    });
};