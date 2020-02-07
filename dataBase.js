const Pool = require('pg').Pool;
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'postgres',
    password: 'postgres',
    port: 5432,
});

const getFavorites = async () => {
    const result = await pool.query('SELECT * FROM favorites');
    return result.rows.json();
};

const addFavorite = async (name) => {
    const favs = await getFavorites();
    if (favs === null || favs.find(x => x.name === name) === undefined) {
        await pool.query('INSERT INTO favorites (name) VALUES ($1)', [name]);
        return 'success';
    } else {
        throw 'item already exist';
    }
};

const deleteFavorite = async (name) => {
    const favs = await getFavorites();
    if (favs.find(x => x.name === name) !== undefined) {
        await pool.query('DELETE FROM favorites WHERE name = $1', [name]);
        return 'success';
    } else {
        throw 'there is no such item';
    }
};

module.exports = {
    getFavorites,
    addFavorite,
    deleteFavorite,
};