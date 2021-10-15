<template>
 <v-row class="text-center">
<v-container class="col-xs-6 offset-xs-3 col-sm-6 offset-sm-3  col-md-6 offset-md-3">
   
  <h1>Login</h1>
<the-login></the-login>
 
  
</v-container>
   </v-row>
</template>

<script>
import TheLogin from '../components/TheLogin.vue'
// @ is an alias to /src


export default {
  components: { TheLogin },

  name: 'Login',
  beforeCreate(){
    if(localStorage.getItem('token')){
      this.$router.push({
        name:'Admin'
      })
    }
  }

}
</script>