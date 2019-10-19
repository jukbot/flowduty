const firebase = require("./init")
const firestore = firebase.firestore()

/**
 * @typedef {Object} CreateWorkspaceParameters
 * @property {String} name - Workspace name.
 * @property {String} display - Workspace display name.
 */

/**
 * Use to generate new workspace.
 * @param {CreateWorkspaceParameters} createWorkspaceParameters - Parameters for create a workspace.
 * @param {String} createWorkspaceParameters.name - Workspace name.
 * Eg. createWorksapce({ name: "Workspace name" })
 */
export const createWorkspace = createWorkspaceParameters => {
	let { name, display } = createWorkspaceParameters

	firestore
		.collection("workspace")
		.doc(name)
		.set({
			name: name,
			display: display
		})
		.catch(createWorkspaceError => {
			console.error(createWorkspaceError)
			return createWorkspaceError
		})
}

/**
 * Create slot in workspace.
 * @typedef {Object} Slot
 * @property {String} title - Slot name.
 * @property {Number} startTime - Slot start time.
 * @property {Number} duration - Slot duration.
 * @property {String} venue - Slot venue.
 */

/**
 * @param {String} workspaceName - Refer to existed workspace.
 * @param {Slot} slot - Slot model to be created.
 */

export const createSlot = (workspaceName, slot) => {
	let { title, duration, startTime, venue } = slot

	return firestore
		.collection("workspace")
		.doc(workspaceName)
		.get()
		.then(docs => {
			if (!docs.exists)
				throw "Workspace is not existed! Try create one first."

			firestore
				.collection("workspace")
				.doc(workspaceName)
				.collection("slot")
				.doc(title)
				.set({
					title: title,
					startTime: startTime,
					duration: duration,
					venue: venue
				})
				.catch(createSlotError => {
					console.error(createSlotError)
					return createSlotError
				})
		})
		.catch(getWorkspaceError => {
			console.error(getWorkspaceError)
			return getWorkspaceError
		})
}

/**
 * Create user in workspace.
 * @typedef {Object} User
 * @property {String} name - User's name.
 * @property {Boolean} isAdmin - Is user an admin? Default: false
 * @property {String} role - User's role.
 */

/**
 * @param {String} workspaceName - Refer to existed workspace.
 * @param {User} user - User's detail.
 */

export const createUser = (workspaceName, user) => {
	let { name, isAdmin = false, role } = user

	return firestore
		.collection("workspace")
		.doc(workspaceName)
		.get()
		.then(docs => {
			if (!docs.exists)
				throw "Workspace is not existed! Try create one first."

			firestore
				.collection("workspace")
				.doc(workspaceName)
				.collection("user")
				.doc(name)
				.set({
					name: name,
					isAdmin: isAdmin,
					role: role
				})
				.catch(createSlotError => {
					console.error(createSlotError)
					return createSlotError
				})
		})
		.catch(getWorkspaceError => {
			console.error(getWorkspaceError)
			return getWorkspaceError
		})
}