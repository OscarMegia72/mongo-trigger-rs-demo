# mongo-trigger-rs-demo
Implementación de mongo-trigger-rs sobre epxress y vue

### Primer paso :)

```
npm install
```

### Crear fichero .env sobre la raiz

```
# Para puerto 4000 y un mongodb local
PORT=4000
URI_MONGODB='mongodb://localhost:27017?w=0&readPreference=primary'
```



### Levantar servidor para demo sobre puerto 4000

```
npm run api
```

### Activar demo contra lector de noticias
```
npm run mock-noticias
```

### Funcionamiento 
mock-noticias recoge feed-rss y graba las noticias sobre una tabla de mongodb
por defecto: oscar-rt/pruebas

El servidor levanta una conexión socket.io sobre global (para qeu se entienda mejor el concepto no es obligatorio y podría se cualquier otro object)

### Rutas
/routes/index
Declara la ruta para / y carga una vista con dust para renderizar una vista vue /components/index.vue
Vue utiliza el VueSocketIO para conectarse al puerto y recibir mensajes.

```
notas:
El lector de noticias genera un md5 del contenido como _id clave para mongodb. Cuando se intente salvar una noticia ya existente devolverá un error en "insertOne".
Si se quiere un bucle constante de lectura habría que hacer un override del _id o vaciar la tabla una vez cumplido el ciclo.
```

### Este ejemplo simplemente tiene el proposito de:

- Recoger a tiempo real la modificación de un tabla de mongodb.
- Enviar el evento sobre los cliente conectado con Vue sobre el servidor.
- Ser fácil de seguir y ampliar para otros propositos.
  

### ** Arrancar servidor en modo Replica Set

Recordar que el servidor mongo tiene que estar arrancado en modo replica-set

```
sudo mongod --replSet "rs"
// Primera Vez que se arranca servidor en este mongo
bin/mongo
rs.initiate()
```

