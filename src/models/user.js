import UserData from './userData'

export default class User {
    constructor(email, password, firstName, secondName, thirdName, country) {
        this.username = username;
        this.email = email;
        this.password = password;
        this.userData = new UserData(
            firstName,
            secondName,
            thirdName,
            country
        )
    }
}