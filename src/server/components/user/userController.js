import bcrypt from 'bcrypt';
import logger from '../../../config/logger';
import { query } from '../../utils/database';

/**
 * Check if User with provided email already exist in database
 * @method checkUserEmailExist
 * @param {String} email
 * @return {Promise<Boolean, Error>}
 */
async function checkUserEmailExist(email) {
	try {
		const result = await query(
			'SELECT exists( SELECT true FROM users WHERE email = lower($1))',
			[email],
		);

		return result.rows[0].exists;
	} catch (err) {
		logger.error(`Error checking if user "${email}" exist.`, err);
		throw err;
	}
}

/**
 * Check if User with provided Id already exist in database
 * @method checkUserIdExist
 * @param {String} id
 * @return {Promise<Boolean, Error>}
 */
async function checkUserIdExist(id) {
	try {
		const result = await query(
			'SELECT exists( SELECT true FROM users WHERE id = ($1))',
			[id],
		);

		return result.rows[0].exists;
	} catch (err) {
		logger.error(`Error checking if user with id "${id}" exist.`, err);
		throw err;
	}
}

/**
 * Get User By Email
 * @method getUserByEmail
 * @param {String} email
 * @return {Promise<Object, Error>} User
 */
async function getUserByEmail(email) {
	try {
		const result = await query(
			'SELECT id, name, email, password, registered FROM users WHERE email = ($1)',
			[email],
		);

		return result.rows[0];
	} catch (err) {
		logger.error(`Error getting user by email "${email}"`, err);
		throw err;
	}
}

/**
 * Get User By Id
 * @method getUserById
 * @param {String} id
 * @return {Promise<Object, Error>} User
 */
async function getUserById(id) {
	try {
		const result = await query(
			'SELECT * FROM users WHERE id = ($1)',
			[id],
		);

		return result.rows[0];
	} catch (err) {
		logger.error(`Error getting user by email "${id}"`, err);
		throw err;
	}
}

/**
 * Add new User
 * @method addUser
 * @param {Object} user
 * @return {Promise<Object, Error>} User
 */
async function addUser(user) {
	const saltRounds = 10;
	let cryptedPass;
	let newUser;

	// Hash User's password
	try {
		cryptedPass = await bcrypt.hash(user.password, saltRounds);
	} catch (err) {
		logger.error('Error hashing users password', err);
		throw err;
	}

	try {
		const result = await query(`
			INSERT INTO users
				(name, email, password)
			VALUES
				($1, $2, $3)
			RETURNING *
		`, [user.name, user.email, cryptedPass]);

		[newUser] = result.rows;
	} catch (err) {
		logger.error(`Error adding user "${user.email}"`, err);
		throw err;
	}

	// Add user to user_verification (for email confirmation)
	try {
		await query('INSERT INTO user_verification (user_id) VALUES ($1)', [newUser.id]);
	} catch (err) {
		logger.error(`Error adding to user_verification "${user.email}"`, err);
		throw err;
	}

	return newUser;
}

/**
 * Delete user by Id
 * @method deleteUser
 * @param {Number} id User Id
 * @return {Promise<Number, Error>} Returns number of deleted rows
 */
async function deleteUser(id) {
	try {
		const result = await query(
			'DELETE FROM users WHERE id = ($1) RETURNING *',
			[id],
		);

		return result.rowCount;
	} catch (err) {
		logger.error(`Could not delete user with Id "${id}"`, err);
		throw err;
	}
}

/**
 * Delete user by email
 * @method deleteUserByEmail
 * @param {String} email User's email
 * @return {Promise<Number, Error>} Returns number of deleted rows
 */
async function deleteUserByEmail(email) {
	try {
		const result = await query(
			'DELETE FROM users WHERE email = ($1) RETURNING *',
			[email],
		);

		return result.rowCount;
	} catch (err) {
		logger.error(`Could not delete user with email "${email}"`, err);
		throw err;
	}
}

export {
	checkUserEmailExist,
	checkUserIdExist,
	getUserByEmail,
	getUserById,
	addUser,
	deleteUser,
	deleteUserByEmail,
};
