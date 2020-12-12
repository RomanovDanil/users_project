import Axios from 'axios'

//адрес api
const UsersAPI = `http://${window.location.hostname}:5000`

class AuthService{
    ///Desctiption
    // Axios используется здесь для выполнения POST-запроса к API с передачей аргумента credentials. 
    // Затем мы деструктурируем ответ, data, так как нас здесь интересует лишь значение token, сохраняем это значение в куки-файле и задаём срок жизни этих данных, равный одному дню. 
    // Также мы устанавливаем в true переменную validLogin и значение authenticated объекта user, и, наконец, перенаправляем пользователя по пути из аргумента redirect.
    ///
    registrate(user){
        return Axios
            .post(
                `${UsersAPI}/api/auth/registrate`,
                {
                    email: user.email,
                    password: user.password,
                    repeatPassword: user.repeatPassword,
                    firstName: user.firstName,
                    secondName: user.secondName,
                    thirdName: user.thirdName,
                    country: user.country
                }
            )
    }
    
    login(user){
        return Axios
            .post(
                `${UsersAPI}/api/auth/login`,
                user
            )
            .then(responce => {
                if(responce.data.token){
                    localStorage.setItem('user', JSON.stringify(response.data))
                }
                return {status:true, data:response.data}
            })
            .catch(responce => {
                console.log(responce)
                return {status:false, data:responce.data}
            })
    }

    logout(){
        localStorage.removeItem('user')
    }    
}

export default new AuthService()

