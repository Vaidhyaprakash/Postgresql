const Hapi = require('@hapi/hapi');
const bodyParser = require("body-parser");
//const pool = require("./db");
const { Sequelize } = require('sequelize');
const {sequelize} = require("./models");


async function main(){
  await sequelize.sync({force: true});
}
main();

//..........................Handling Routes.....................
const init = async () => {

    const server = Hapi.server({
        port: 3000,
        host: 'localhost'
    });

    server.route({
        method: 'GET',
        path: '/',
        handler: (request, h) => {

            return 'Hello World!';
        }
    });

    server.route({
        method: 'POST',
        path: '/Person',
        handler: function(request, h) {
          const name = request.payload.name;

        }
    });

    await server.start();
    console.log('Server running on', server.info.uri);
};


init();
