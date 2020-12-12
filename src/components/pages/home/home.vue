<template>
  <div>
    <h3>Hi! this is our App's Home</h3>
    <ul>
      
    </ul>
  </div>
</template>
<script>
    import Axios from 'axios'
    import Authentication from '@/components/pages/authentication'
    const UsersAPI = `http://${window.location.hostname}:5000`
    export default {
        data () {
            return {
                users: []
            }
        },
        mounted () {
            this.getAllUsers()
        },
        methods: {
            getAllUsers (context) {
                Axios.get(`${UsersAPIAPI}/api/user/users`, {
                    headers: {
                        'Authorization': Authentication.getAuthenticationHeader(this)
                    }
                }).then(({data}) => (this.users = data))
            }
        }
    }
</script>