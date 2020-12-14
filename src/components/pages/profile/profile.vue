<!-- <template>
//   <div class="container">
//     <header class="jumbotron">
//       <h3>
//         <strong>{{currentData.userData.firstName}}</strong> Profile 
//       </h3>
//     </header>
//     <p>
//       <strong>Token:</strong>
//       {{currentData.token.substring(0, 20)}} ... {{currentData.token.substr(currentData.token.length - 20)}}
//     </p>
//     <p>
//       <strong>Id:</strong>
//       {{currentData.id}}
//     </p>
//     <p>
//       <strong>Email:</strong>
//       {{currentData.email}}
//     </p>
//     <strong>Authorities:</strong>
//         {{currentData.userData.role}}
//   </div>
 </template>-->

<template>
<v-app>
    <v-container class="fill-height" fluid>
        <v-row align="center" justify="center">
            <v-col cols="12" sm="8" md="4">
                <v-card class="elevation-12">
                    <v-toolbar color="primary" dark flat>
                        <v-toolbar-title>Profile</v-toolbar-title>
                        <v-spacer></v-spacer>
                            <v-btn depressed color="primary" fab small @click.native="submitExit()">
                                <v-icon>
                                    exit_to_app
                                </v-icon>
                            </v-btn>
                    </v-toolbar>

                    <v-card-text>
                        <strong>Email: </strong>{{currentUser.email}}
                    </v-card-text>
                    <v-card-text>
                        <strong>Token: </strong>{{currentUser.token.substring(0, 20)}}...{{currentUser.token.substr(currentUser.token.length - 20)}}
                    </v-card-text>
                    <v-card-text>
                        <strong>First name: </strong>{{currentUser.userData.firstName}}
                    </v-card-text>
                    <v-card-text>
                        <strong>Second name: </strong>{{currentUser.userData.secondName}}
                    </v-card-text>
                    <v-card-text>
                        <strong>Third name: </strong>{{currentUser.userData.thirdName}}
                    </v-card-text>
                    <v-card-text>
                        <strong>Role: </strong>{{currentUser.userData.role.name}}
                    </v-card-text>          
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</v-app>
</template>

<script>
export default {
    name: 'Profile',
    computed: {
        currentUser() {
            return this.$store.state.auth.user;
        }
    },
    mounted() {
        if (!this.currentUser) {
            this.$router.push('/login');
        }
    },
    methods:{
        submitExit(){
            this.$store.dispatch('auth/logout')
            this.$router.push('/login')
        }
    }
};
</script>