<template>
  <v-form ref="form" v-model="valid" lazy-validation>
    <v-text-field
      v-model="correo"
      :rules="emailRules"
      label="Correo"
      required
    ></v-text-field>

    <v-text-field
      v-model="password"
      :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
      :rules="nameRules"
      :type="show1 ? 'text' : 'password'"
      name="input-10-1"
      label="Ingrese su Contraseña"
      @click:append="show1 = !show1"
    ></v-text-field>

    <v-btn
      block
      :disabled="!valid"
      color="primary"
      class="mr-4"
      @click="ingresar"
    >
      Validate
    </v-btn>

    <v-btn block plain color="error" class="mr-4" @click="reset">
      Reset Form
    </v-btn>
  </v-form>
</template>

<script>
import axios from 'axios';
export default {
  name: "TheLogin",
  data: () => ({
    show1: false,
    valid: true,

    correo: "",
    emailRules: [
      (v) => !!v || "Correo es requerido",
      (v) => /.+@.+\..+/.test(v) || "E-mail must be valid",
    ],
    password: "",
    nameRules: [(v) => !!v || "Contraseña es requerida"],
  }),

  methods: {
    ingresar() {
      axios
        .post("http://localhost:3000/api/usuario/login", {
          correo: this.correo,
          password: this.password,
        })
        .then(response=>{
            localStorage.setItem('token',response.data.tokenReturn);
            this.$router.push({
                name:'Admin'

            })
            console.log(response.data)
        })
        .catch(error=>{
            console.log(error)
        });
    },
    reset() {
      this.$refs.form.reset();
    },
  },
};
</script>