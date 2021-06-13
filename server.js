const Hapi = require('@hapi/hapi');
const bodyParser = require("body-parser");
//const pool = require("./db");
const { Sequelize } = require('sequelize');
const {sequelize,User,Post} = require("./models");
const user = require('./models/user');


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
        path: '/users',
        handler: async function users(request, h) {

            const {name,email,role}=request.payload;
            try{
                const user = await User.create({name,email,role});
                return h.response(user);
            }catch(err){
                console.log(err);
                return "Error";
            }
        }
    });

    server.route({
        method: 'GET',
        path: '/users',
        handler: async function(request, h) {
            try{
                const users= await User.findAll({include : ['posts']});
                return h.response(users);
            }catch(err){
                console.log(err);
                return "Error";
            }
            
        }
    });

    server.route({
        method: 'GET',
        path: '/users/{name}',
        handler: async function(request, h) {
            const name = request.params.name;
            try{
                const user= await User.findOne({
                    where: { name },
                    include:['posts'],
                });
                return h.response(user);
            }catch(err){
                console.log(err);
                return "Error";
            }
            
        }
    });

    server.route({
        method: 'POST',
        path: '/posts',
        handler: async function posts(request, h) {

            const {body,userUuid}=request.payload;
            try{
                const user = await User.findOne({where:{uuid:userUuid}});
                const post = await Post.create({body,userId:user.id});
                return h.response(post);
            }catch(err){
                console.log(err);
                return "Error";
            }
        }
    });

    server.route({
        method: 'GET',
        path: '/posts',
        handler: async function posts(request, h) {

            try{
                const posts = await Post.findAll({include:['user']});
                return h.response(posts);
            }catch(err){
                console.log(err);
                return "Error";
            }
        }
    });
    server.route({
        method: 'DELETE',
        path: '/users/{name}',
        handler: async function(request, h) {
            const name = request.params.name;
            try{
                const user= await User.findOne({
                    where: { name }
                });
                await user.destroy();
                return "User Deleted";
            }catch(err){
                console.log(err);
                return "Error";
            }
            
        }
    });
    server.route({
        method: 'PUT',
        path: '/users/{name}',
        handler: async function(request, h) {
            const nameSearch = request.params.name;
            const {name,email,role}=request.payload;
            try{
                const user= await User.findOne({
                    where: { name:nameSearch }
                });
                user.name=name;
                user.email=email;
                user.role=role;
                user.save();
                return h.response(user);
            }catch(err){
                console.log(err);
                return "Error";
            }
            
        }
    });


    await server.start();
    console.log('Server running on', server.info.uri);
    await sequelize.authenticate();
    console.log("Database Connected...!");
};


init();
