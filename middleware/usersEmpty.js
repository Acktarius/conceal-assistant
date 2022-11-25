// if we have a user
const usersDB = {
    users: require('../data/users.json'),
    setUsers: function (data) { this.users = data }
}

const usersEmpty = () => {
    if (usersDB.users.length === 0) {
        return true
    } else {
        return false
    }
}
const noUser = eval(usersEmpty());

module.exports = { noUser };
