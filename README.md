<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>


# Ejecutar en desarrollo

1. Clonar el repositorio
2. Ejecutar 
```bash
yarn install
```
3. Tener Nest CLI instalado 

4. Levantar  la base de datos 
```bas
docker-compose up -d 
```

5. Clonar el archivo __.env.template__ y renombrar la copia a __.env__

6. LLenar las variables de entorno definidas  en el __.env__

7. Ejecutar la aplicacion en desarrollo
```bash
yarn start:dev
```

5. Reconstruir la base de datos con la semilla
```
api/v2/seed
```

## Stack

* nestjs
* mongo db 