import UserData from './userData'

export default class User {
    constructor(id, token, email, password, firstName, secondName, thirdName, country, image) {
        this.id = id;
        this.token = token;
        this.username = username;
        this.email = email;
        this.password = password;
        this.userData = new UserData(
            firstName,
            secondName,
            thirdName,
            country,
            image
        )
    }
}