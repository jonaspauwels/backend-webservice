[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-24ddc0f5d75046c5622901739e7c5dd533143b0c8e959d652212380cedb1ea36.svg)](https://classroom.github.com/a/snPWRHYg)

# Examenopdracht Web Services

- Student: Jonas Pauwels
- Studentennummer: 202181093
- E-mailadres: <mailto:jonas.pauwels@student.hogent.be>

## Vereisten

Ik verwacht dat volgende software reeds geïnstalleerd is:

- [NodeJS](https://nodejs.org)
- [Yarn](https://yarnpkg.com)
- [MySQL Community Server](https://dev.mysql.com/downloads/mysql/)
- [Sequelize](https://sequelize.org/)
- [Koa](https://koajs.com/)
- [Koa cors](https://www.npmjs.com/package/@koa/cors)
- [Koa helmet](https://www.npmjs.com/package/koa-helmet)
- [Koa router](https://www.npmjs.com/package/koa-router)
- [JSON webtoken](https://www.npmjs.com/package/jsonwebtoken)
- [Winston](https://github.com/winstonjs/)
- [Argon](https://www.npmjs.com/package/argon2)
- [Joi](https://joi.dev/api/?v=17.9.1)
- [Umzug](https://github.com/sequelize/umzug)
- [Jest](https://jestjs.io/)


## Opstarten

### .env bestand

Het .env bestand wordt aangemaakt in de root map en dient volgende variabelen te bevatten:

```javascript
NODE_ENV=production/development
DATABASE_PASSWORD=''
DATABASE_CLIENT=mysql
DATABASE_HOST=localhost
DATABASE_PORT=3306
DATABASE_NAME=fruit
DATABASE_USERNAME=root
```

### applicatie starten

De applicatie wordt gestart via het commando `yarn start`

## Testen

### .env.test bestand

Het .env.test bestand wordt aangemaakt in de root map en dient volgende variabelen te bevatten:

```javascript
NODE_ENV=test
DATABASE_PASSWORD=''
```

### uitvoeren testen

De testen wordten uitgevoerd via `yarn test`. Indien er ook coverage moet gegenereerd worden dan dient het commando `yarn test:coverage` gebruikt te worden.

