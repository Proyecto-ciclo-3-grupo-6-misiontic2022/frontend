<template>
  <v-container>
    <h1>Articulos</h1>
    <v-data-table
      :headers="headers"
      :items="articulos"
      sort-by="calories"
      class="elevation-1"
    >
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>CRUD</v-toolbar-title>
          <v-divider class="mx-4" inset vertical></v-divider>
          <v-spacer></v-spacer>
          <v-dialog v-model="dialog" max-width="500px">
            <template v-slot:activator="{ on, attrs }">
              <v-btn color="primary" dark class="mb-2" v-bind="attrs" v-on="on">
                Nuevo Articulo
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
                        v-model="editedItem.codigo"
                         :rules="[v => !!v || 'El codigo es requerido']"
                        label="Codigo"
                        required
                      ></v-text-field>
                    </v-col>



                    <v-col cols="12" sm="6" md="4">
                      <v-text-field
                        v-model="editedItem.nombre"
                         :rules="[v => !!v || 'El nombre es requerido']"
                        label="Nombre"
                        required
                      ></v-text-field>
                    </v-col>
                <v-col cols="12" sm="6" md="4">
                      <v-textarea
                      no-resize
                      auto-grom
                      counter="355"
                        v-model="editedItem.descripcion"
                         :rules="[v => !!v || 'La descripcion es requerida']"
                        label="Descripcion"
                        required
                      ></v-textarea>
                    </v-col>
                   
                    <v-col cols="12" sm="6" md="4">
                     

                       <v-select
      v-model="editedItem.categoria"
      :items="categorias"
      item-text="nombre"
      item-value="_id"
      :rules="[v => !!v || 'La categoria es requerida']"
      label="Categoria"
      required
    ></v-select>
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
        <v-icon 
        small 
        @click="changeStateItem(item)">
        <template v-if="item.estado">
        mdi-toggle-switch
        </template>
        <template v-else>
         mdi-toggle-switch-off-outline
        </template>
          
        </v-icon>
         <v-icon small @click="deleteItem(item)">
          mdi-delete
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
    name:'ArticuloDT',
    data: () => ({
      dialog: false,
      dialogDelete: false,
      headers: [
        {
          text: 'Codigo',
          align: 'start',
          sortable: false,
          value: 'codigo',
        },
        { text: 'Categoria', value: 'categoria.nombre' },
        { text: 'Nombre', value: 'nombre' },
        { text: 'Descripcion', value: 'descripcion' },
      
      
        { text: 'Estado', value: 'estado' },
        { text: 'Actions', value: 'actions', sortable: false },
      ],
      articulos: [],
      
      categorias: [
            
      ],
      editedIndex: -1,
      editedItem: {
      _id:'',
        categoria: {
        _id:'',
        nombre:'',
        descripcion:'',
        },
        codigo: '',
        nombre: '',
        descripcion: '',
      
      },
      defaultItem: {
        _id:'',
        categoria: {
        _id:'',
        nombre:'',
        descripcion:'',
        },
        codigo: '',
        nombre: '',
        descripcion: '',
      },
    }
    ),

    computed: {
      formTitle () {
        return this.editedIndex === -1 ? 'Nuevo Usuario' : 'Editar Usuario'
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
    this.Categoriaslist();
      this.list()
    },

    methods: {
      initialize(){

      },
list(){
axios.get("http://localhost:3000/api/articulo/list")
.then(response=>{
this.articulos=response.data
console.log(response)
})
.catch(function (error){
console.log(error)
})
},
Categoriaslist(){
axios.get("http://localhost:3000/api/categoria/listActive")
.then(response=>{
this.categorias=response.data


})
.catch(function (error){
console.log(error)
})
},

      editItem (item) {
        this.editedIndex = this.articulos.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.dialog = true
      },

      deleteItem (item) {
        this.editedIndex = this.articulos.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.dialogDelete = true
      },
deleteItemConfirm () {
 axios.delete("http://localhost:3000/api/articulo/remove",{
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
axios.put("http://localhost:3000/api/articulo/disabled",{
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
axios.put("http://localhost:3000/api/articulo/enabled",{
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


        //this.articulos.splice(this.editedIndex, 1)
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
        //  Object.assign(this.articulos[this.editedIndex], this.editedItem)
        axios.put("http://localhost:3000/api/articulo/update",{
         nombre: this.editedItem.nombre,
        codigo:this.editedItem.codigo ,
        categoria:this.editedItem.categoria , 
          descripcion:this.editedItem.descripcion,
          _id:this.editedItem._id
        })
      .then(response=>{
        this.list()
        console.log(response)
        })
      .catch(error=>{
    console.log(error)
      });
        } else {
        // this.articulos.push(this.editedItem)
        axios.post("http://localhost:3000/api/articulo/add",{
        nombre: this.editedItem.nombre,
        codigo:this.editedItem.codigo ,
        categoria:this.editedItem.categoria , 
          descripcion:this.editedItem.descripcion,       
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
