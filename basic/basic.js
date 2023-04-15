// connectToDatabase()
//     .then((database)  => {
//         return getUser(database, 'email@email.com')
//             .then(user => {
//                 return getUserSettings(database, user.id)
//                     .then(settings => {
//                         return setRole(database, user.id, "ADMIN")
//                             .then(success => {
//                                 return notifyUser(user.id, "USER_ROLE_UPDATED")
//                                     .then(success => {
//                                         return notifyAdmins("USER_ROLE_UPDATED")
//                                     })
//                             })
//                     })
//             })
//     })
//


const ROLES = {
    ADMIN: "ADMIN",
    SEMI_ADMIN: "SEMI_ADMIN"
}

/**
 *
 * @param {string}email
 * @param {ROLES.ADMIN|ROLES.SEMI_ADMIN}role
 * @return {Promise<{success: boolean}>}
 */
async function updateUserRole(email, role) {
    try {
        // validate email here
        // validate role here

        const database = await connectToDatabase(); // connecting to database
        const user = await getUser(database, email) // getting user
        // const settings = await getUserSettings(database, user.id)
        // I have commented this as it's unused, and as I understood the whole user info is in the User table

        if (user.role !== role) {
            await setRole(database, user.id, role)
            await notifyUser(user.id, "USER_ROLE_UPDATED")
            await notifyAdmins("USER_ROLE_UPDATED")
        }
        return {
            success: true
        }
    } catch (error) {
        // do something here
        return {
            success: false
        }
    }
}

async function connectToDatabase() {

}

async function getUser(database, email) {
    return {
        id: '42r1wj2414',
        role: "SEMI_ADMIN"
    }
}

async function getUserSettings(database, userId) {
}

async function setRole(database, userId, role) {

}

async function notifyUser(userId, event) {
}

async function notifyAdmins(event) {

}
