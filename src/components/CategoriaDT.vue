<template>
  <v-container>
    <h1>Categorias</h1>
    <v-data-table
      :headers="headers"
      :items="categorias"
      sort-by="calories"
      class="elevation-1"
      :loading="cargando"
    loading-text="Loading... Please wait"
    >
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>CRUD</v-toolbar-title>
          <v-divider class="mx-4" inset vertical></v-divider>
          <v-spacer></v-spacer>
          <v-dialog v-model="dialog" max-width="500px">
            <template v-slot:activator="{ on, attrs }">
              <v-btn color="primary" dark class="mb-2" v-bind="attrs" v-on="on">
                Nuevo Categoria
              </v-btn>
            </template>
            <v-card>
              <v-card-title>
                <span class="text-h5">{{ formTitle }}</span>
              </v-card-title>

              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field
                        v-model="editedItem.nombre"
                         :rules="[v => !!v || 'El nombre es requerido']"
                        label="Nombre"
                        required
                      ></v-text-field>
                    </v-col>
                    <v-col  cols="12" sm="6" md="4" >
                      <v-text-field
                      
                        v-model="editedItem.descripcion"
                        :rules="[v => !!v || 'La descripcion es requerida']"
                        label="Descripcion"
                        required
                      ></v-text-field>
                    </v-col>
                   
                 <!--<v-col cols="12" sm="6" md="4">
                   //   <v-text-field
                    //    v-model="editedItem.protein"
                    //    label="Protein (g)"
                    //  ></v-text-field>-->
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="close">
                  Cancelar
                </v-btn>
                <v-btn color="blue darken-1" text @click="save">
                  Guardar
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <v-dialog v-model="dialogDelete" max-width="500px">
            <v-card>
              <v-card-title class="text-h5"
                >Esta seguro que desea eliminar el Usuario?</v-card-title
              >
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="closeDelete"
                  >Cancelar</v-btn
                >
                <v-btn color="blue darken-1" text @click="deleteItemConfirm"
                  >Confirmar</v-btn
                >
                <v-spacer></v-spacer>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-toolbar>
      </template>
      <template v-slot:item.actions="{ item }">
        <v-icon small class="mr-2" @click="editItem(item)">
          mdi-pencil
        </v-icon>
        <v-icon small @click="deleteItem(item)">
          mdi-delete
        </v-icon>
         <v-icon small @click="changeStateItem(item)">
          mdi-update
        </v-icon>
      </template>
      <template v-slot:no-data>
        <v-btn color="primary" @click="initialize">
          Reset
        </v-btn>
      </template>
    </v-data-table>
  </v-container>
</template>

<script>
import axios from 'axios'
  export default {
    name:'CategoriaDT',
    data: () => ({
    cargando:true,
      dialog: false,
      dialogDelete: false,
      headers: [
        {
          text: 'Id',
          align: 'start',
          sortable: false,
          value: '_id',
        },
        { text: 'Nombre', value: 'nombre' },
        { text: 'Descripcion', value: 'descripcion' },       
        { text: 'Estado', value: 'estado' },
        { text: 'Actions', value: 'actions', sortable: false },
      ],
      categorias: [],      
      
      editedIndex: -1,
      editedItem: {
      _id:'',
        nombre: '',
        descripcion: '',
        estado: '',
    
      },
      defaultItem: {
         nombre: '',
        descripcion: '',
      },
    }
    ),

    computed: {
      formTitle () {
        return this.editedIndex === -1 ? 'Nueva Categoria' : 'Editar Categoria'
      },
      correoCheck(){
      return this.editedIndex === -1 ? false : true
      },
    },

    watch: {
      dialog (val) {
        val || this.close()
      },
      dialogDelete (val) {
        val || this.closeDelete()
      },
    },

    created () {
      this.list()
    },

    methods: {
      initialize(){

      },
list(){
axios.get("http://localhost:3000/api/categoria/list")
.then(response=>{
this.categorias=response.data
this.cargando=false
console.log(response)
})
.catch(function (error){
console.log(error)
})
},

      editItem (item) {
        this.editedIndex = this.categorias.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.dialog = true
      },

      deleteItem (item) {
        this.editedIndex = this.categorias.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.dialogDelete = true
      },
deleteItemConfirm () {
 axios.delete("http://localhost:3000/api/categoria/remove",{
       data:{ _id:this.editedItem._id}
        })
      .then(response=>{
        this.list()
        console.log(response)
        })
      .catch(error=>{
    console.log(error)
      });

 this.closeDelete()

},
      changeStateItem(item) {
        this.editedIndex = this.categorias.indexOf(item)
        this.editedItem = Object.assign({}, item)
        if(this.editedItem.estado===1){
        //disabled
        axios.put("http://localhost:3000/api/categoria/disabled",{
        _id:this.editedItem._id
        })
      .then(response=>{
        this.list()
        console.log(response)
        })
      .catch(error=>{
    console.log(error)
      });

}else{
//enabled
axios.put("http://localhost:3000/api/categoria/enabled",{
        _id:this.editedItem._id
        })
      .then(response=>{
        this.list()
        console.log(response)
        })
      .catch(error=>{
    console.log(error)
      });
}


        //this.categorias.splice(this.editedIndex, 1)
        this.closeDelete()


      },

      close () {
        this.dialog = false
        this.$nextTick(() => {
          this.editedItem = Object.assign({}, this.defaultItem)
          this.editedIndex = -1
        })
      },

      closeDelete () {
        this.dialogDelete = false
        this.$nextTick(() => {
          this.editedItem = Object.assign({}, this.defaultItem)
          this.editedIndex = -1
        })
      },

      save () {
        if (this.editedIndex > -1) {
        //  Object.assign(this.categorias[this.editedIndex], this.editedItem)
        axios.put("http://localhost:3000/api/categoria/update",{
        _id:this.editedItem._id,
        nombre: this.editedItem.nombre,
        descripcion:this.editedItem.descripcion,
        })
      .then(response=>{
        this.list()
        console.log(response)
        })
      .catch(error=>{
            console.log(error)
      });
        } else {
        // this.categorias.push(this.editedItem)
        axios.post("http://localhost:3000/api/categoria/add",{
        nombre: this.editedItem.nombre,
        descripcion:this.editedItem.descripcion ,
        })
      .then(response=>{
        this.list()
        console.log(response)
        })
      .catch(error=>{
    console.log(error)
      });
        }
        this.close()
      },
    },
  }
</script>
