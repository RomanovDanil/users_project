<template>
<v-app>
    <v-container class="fill-height" fluid>
        <v-row align="center" justify="center">
            <v-col cols="12" sm="8" md="4">
                <v-card class="elevation-12">
                    <v-toolbar color="primary" dark flat>
                        <v-toolbar-title>Registrate</v-toolbar-title>
                        <v-spacer></v-spacer>
                    </v-toolbar>
                                    
                    <v-card-text>
                        <v-form v-model="isValid">
                            <v-text-field label="Email"
                                        v-model="email"
                                        prepend-icon="alternate_email"
                                        :rules="email_rules"
                                        required
                                        color="light-blue lighten-1">
                            </v-text-field>

                            <v-text-field label="Password"
                                v-model="password"
                                prepend-icon="lock"
                                :rules="password_rules"
                                :append-icon="registratePasswordVisible ? 'visibility' : 'visibility_off'"
                                @click:append="() => (registratePasswordVisible = !registratePasswordVisible)"
                                :type="registratePasswordVisible ? 'text' : 'password'"
                                color="light-blue lighten-1"
                                required>
                            </v-text-field>

                            <v-text-field label="Repeat password"
                                v-model="repeatPassword"
                                prepend-icon="lock"
                                :rules="[repeat_password_rules.required, passwordConfirmationRule]"
                                :append-icon="registratePasswordRepeatVisible ? 'visibility' : 'visibility_off'"
                                @click:append="() => (registratePasswordRepeatVisible = !registratePasswordRepeatVisible)"
                                :type="registratePasswordRepeatVisible ? 'text' : 'password'"
                                color="light-blue lighten-1"
                                required>
                            </v-text-field>

                            <v-text-field label="First name"
                                        v-model="firstName"
                                        prepend-icon="account_box"
                                        :rules="[v => !!v || 'First name is required']"
                                        color="light-blue lighten-1"
                                        required>
                            </v-text-field>

                            <v-text-field label="Second name"
                                        v-model="secondName"
                                        prepend-icon="account_box"
                                        :rules="[v => !!v || 'Second name is required']"
                                        color="light-blue lighten-1"
                                        required>
                            </v-text-field>

                            <v-text-field label="Third name"
                                        v-model="thirdName"
                                        prepend-icon="account_box"
                                        :rules="[v => !!v || 'Third name is required']"
                                        color="light-blue lighten-1"
                                        required>
                            </v-text-field>

                            <v-select label="Country"
                                        v-model="country"
                                        :hint="`${country.name}, ${country.abbreviatedName}`"
                                        :items=countries
                                        item-text="name"
                                        item-value="_id"
                                        return-object
                                        prepend-icon="map"
                                        :rules="[v => !!v || 'Country is required']"
                                        color="light-blue lighten-1"
                                        required>   
                            </v-select>

                            <v-btn color="light-blue lighten-1" @click.native="submitRegistrate()" :disabled="!isValid">Create account</v-btn>
                        </v-form>
                    </v-card-text>

                    <v-col cols="12">
                        <div class="text-body text-center">
                            Уже зарегистрированы?
                            <router-link :to="'/login'">Авторизация</router-link>
                        </div>
                    </v-col>
                </v-card>
        
                <v-snackbar timeout="6000"
                            bottom="bottom"
                            color="red lighten-1"
                            v-model="snackbar">
                {{ message }}
                </v-snackbar>
    
            </v-col>
        </v-row>
    </v-container>
</v-app>
</template>

<script>
    //импорт функциональных опций
    import authService from '@/services/auth_service';
    import User from '@/models/user'
    import router from '@/router'
    import {mapGetters, mapActions} from "vuex";

    export default {
        name: "Registration",
        computed: {
            ...mapGetters(['COUNTRIES', 'LOGGEDIN']),
            passwordConfirmationRule: function() {
                return () => (this.password === this.repeatPassword) || 'Passwords must match'
            }
        },
        async created() {
            await this.GET_COUNTRIES();
        },
        mounted() {
            if (this.LOGGEDIN) {
                router.push('/profile');
            }
        },
        data: () => ({
            snackbar: false,
            isValid: true,
            registratePasswordVisible: false,
            registratePasswordRepeatVisible: false,
            email: '',
            password: '',
            repeatPassword: '',
            firstName: '',
            secondName: '',
            thirdName: '',
            country: {},
            message: '',
            password_rules: [ 
                (v) => !!v || 'Password is required', 
                (v) => (v && v.length >= 5) || 'Password must have 5+ characters',
                (v) => /(?=.*[A-Z])/.test(v) || 'Must have one uppercase character', 
                (v) => /(?=.*\d)/.test(v) || 'Must have one number', 
                (v) => /([!@$%])/.test(v) || 'Must have one special character [!@#$%]' 
            ],
            email_rules: [
                (v) => !!v || 'Email is required', 
                (v) => /.+@.+/.test(v) || 'E-mail must be valid' 
            ],
            repeat_password_rules: {
                required: v => !!v || 'Password is required'
            }
        }),
        methods: {
            ...mapActions(['GET_COUNTRIES','REGISTRATE']),
            submitRegistrate () {
                this.REGISTRATE( 
                    {
                        email          :this.email, 
                        password       :this.password, 
                        repeatPassword :this.repeatPassword, 
                        firstName      :this.firstName, 
                        secondName     :this.secondName, 
                        thirdName      :this.thirdName, 
                        country        :this.country._id
                    }
                ).then(
                    data => {
                        console.log(data);
                    },
                    error => {
                        this.snackbar = true
                        this.message = (error.response && error.response.data) ||
                            error.message ||
                            error.toString();
                    }
                )
            }
        }
    }
</script>