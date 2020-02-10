const properties = require('./json/properties.json');
const users = require('./json/users.json');
const { Pool } = require('pg');

const pool = new Pool({
  user: 'vagrant',
  password: '123',
  host: 'localhost',
  database: 'lightbnb'
});


pool.connect()
pool.query('SELECT $1::text as message', ['Hello world!'], (err, res) => {
  console.log(err ? err.stack : res.rows[0].message) // Hello World!
  // client.end()
})

/// Users

/**
 * Get a single user from the database given their email.
 * @param {String} email The email of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithEmail = function(email) {
  return pool.query(`
  SELECT name
  FROM users
  WHERE email = $1
  `, [email])
  .then(res => res.rows || null)
}
exports.getUserWithEmail = getUserWithEmail;

/**
 * Get a single user from the database given their id.
 * @param {string} id The id of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithId = function(id) {
  return pool.query(`
  SELECT name
  FROM users
  WHERE id = $1
  `, [id])
  .then(res => res.rows || null)
}
exports.getUserWithId = getUserWithId;


/**
 * Add a new user to the database.
 * @param {{name: string, password: string, email: string}} user
 * @return {Promise<{}>} A promise to the user.
 */
const addUser =  function(user) {
  const {name, email, password} = user
  return pool.query(`
  INSERT INTO users (name, email, password)
  VALUES ($1, $2, $3)
  RETURNING *
  `, [name, email, password])
  .then(res => res.rows)
}
exports.addUser = addUser;

/// Reservations

/**
 * Get all reservations for a single user.
 * @param {string} guest_id The id of the user.
 * @return {Promise<[{}]>} A promise to the reservations.
 */
const getAllReservations = function(guest_id, limit = 10) {
  return pool.query(`
  SELECT reservations.*, properties.*, avg(property_reviews.rating)
    FROM reservations
    JOIN properties on reservations.property_id = properties.id
    JOIN property_reviews on property_reviews.property_id = properties.id
    WHERE end_date < now()::date
    AND reservations.guest_id = $1
    GROUP BY reservations.id, properties.id
    ORDER BY start_date
    LIMIT $2;`
  , [guest_id, limit])
  .then(res => res.rows);
}
exports.getAllReservations = getAllReservations;

/// Properties

/**
 * Get all properties.
 * @param {{}} options An object containing query options.
 * @param {*} limit The number of results to return.
 * @return {Promise<[{}]>}  A promise to the properties.
 */
// const getAllProperties = function(options, limit = 10) {
//   return pool.query(`
//   SELECT properties.* , avg(rating) as average_rating
//   FROM properties
//   JOIN property_reviews on property_reviews.property_id = properties.id
//   WHERE city LIKE '%ancouv%'
//   GROUP BY properties.id
//   HAVING avg(rating) >= 4
//   ORDER BY cost_per_night
//   LIMIT 10;
//   `, [limit])
//   .then(res => res.rows);
// }

const getAllProperties = function(options, limit = 10) {
  // 1
  const queryParams = [];
  // 2
  let queryString = `
  SELECT properties.*, avg(property_reviews.rating) as average_rating
  FROM properties
  JOIN property_reviews ON properties.id = property_id
  `;

  // 3
  if (options.city) {
    queryParams.push(`%${options.city}%`);
    queryString += `WHERE city LIKE $${queryParams.length} `;
  }

  if (options.owner_id) {
    queryParams.push(`${options.owner_id}`);
    if (queryParams.length > 1) {
      queryString += `AND owner_id IS $${queryParams.length} `;
    } else queryString += `WHERE owner_id IS $${queryParams.length} `;
  }

  if (options.minimum_price_per_night) {
    queryParams.push(Number(`${options.minimum_price_per_night}`));
    if (queryParams.length > 1) {
      queryString += `AND cost_per_night / 100 >= $${queryParams.length} `;
    } else queryString += `WHERE cost_per_night / 100 >= $${queryParams.length} `;
  }

  if (options.maximum_price_per_night) {
    queryParams.push(Number(`${options.maximum_price_per_night}`));
    if (queryParams.length > 1) {
      queryString += `AND cost_per_night / 100 <= $${queryParams.length} `;
    } else queryString += `WHERE cost_per_night / 100 <= $${queryParams.length} `;
  }

  // 4
  queryString += `GROUP BY properties.id`

  if (options.minimum_rating) {
    queryParams.push(Number(`${options.minimum_rating}`));
    queryString += `
  HAVING avg(rating) >= $${queryParams.length} `;
  }

  queryParams.push(limit);
  queryString += `
  ORDER BY cost_per_night
  LIMIT $${queryParams.length};
  `;

  // 5
  console.log(queryString, queryParams);

  // 6
  return pool.query(queryString, queryParams)
  .then(res => res.rows);
}


exports.getAllProperties = getAllProperties;


/**
 * Add a property to the database
 * @param {{}} property An object containing all of the property details.
 * @return {Promise<{}>} A promise to the property.
 */
const addProperty = function(property) {
  const propertyId = Object.keys(properties).length + 1;
  property.id = propertyId;
  properties[propertyId] = property;
  return Promise.resolve(property);
}
exports.addProperty = addProperty;
