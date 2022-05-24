import express from "express";
import handlebars from 'express-handlebars'
import session from "express-session";
import booksArray from './booksArray/books.js'
import MongoStore from 'connect-mongo'
import mongoConnect from './mognoConnect/mongoConfig.js'
import passport from 'passport'
import {
    Strategy as LocalStrategy
} from 'passport-local'
import compression from 'compression'
import User from './schema/User.js'
import CRUD from './Manager/booksManager.js'
import * as url from 'url';
import bcrypt from 'bcrypt'
import log4js from 'log4js';
import os from 'os'
import cluster from 'cluster'

// import artillery from 'artillery'

const numCPUs = os.cpus().length

// import cluster from 'cluster';


const __filename = url.fileURLToPath(
    import.meta.url);
const __dirname = url.fileURLToPath(new URL('.',
    import.meta.url));


const app = express()
const PORT = process.env.PORT || 808
//CLUSTER


if (cluster.isPrimary) {

    console.log(`master ${process.pid} is running`)

    //fork workers, procesos hijos
    for (let i = 0; i < numCPUs; i++) {
        cluster.fork('infoTable.js'); //por cada procesador levanto un proceso hijo
    }

    cluster.on('exit', (worker, code, signal) => {
        console.log(`worker ${worker-process.pid} died`);
    })

} else {

    //workers can share any TCP connection, el worker sería como un proceso hijo
    // in this case it is an HHTP Server

    console.log(`worker ${process.pid} started`);
    const server = app.listen(PORT, () => { //escucho al httpserver, quien contiene el express
        server.on("error", error => console.log(`Se detecto un error: ${error}`));
    })
}

// const server = app.listen(PORT, ()=> console.log(`Listening on port ${PORT}`))

//Midlewares
// 265B
app.use(compression())


app.use(express.urlencoded({
    extended: true
}))
app.use(express.json())
//Static files
app.use(express.static(__dirname + './public'))


//MONGO SESSION
app.use(session({
    store: MongoStore.create({
        mongoUrl: 'mongodb+srv://chantal:logaritmoC@cluster0.dpj6h.mongodb.net/bookstore?retryWrites=true&w=majority',
        ttl: 20
    }),
    secret: 'mingosecret',
    resave: false,
    saveUninitialized: false
}))

mongoConnect()


//log4js set
log4js.configure({
    appenders: {
        myLoggerConsole: {
            type: 'console'
        },
        myLoggerFile: {
            type: 'file',
            filename: 'info.log'
        },
        myLoggerFile2: {
            type: 'console',
            fileName: 'info2.log'
        },

    },

    categories: {
        default: {
            appenders: ['myLoggerConsole'],
            level: 'trace'
        },
        console: {
            appenders: ['myLoggerConsole'],
            level: 'debug'
        },
        archivo: {
            appenders: ['myLoggerFile'],
            level: 'warn'
        },
        archivo2: {
            appenders: ['myLoggerFile2'],
            level: 'info'
        },
        all: {
            appenders: ['myLoggerConsole', 'myLoggerFile'],
            level: 'error'
        },


    }
})


const logger = log4js.getLogger();
logger.trace('Logger trace')
logger.debug('Logger debug')
logger.info('My fisrt log info')
logger.warn('Logger warm')
logger.error('Logger error')
logger.fatal('Logger fatal')



// CREATE HASH
const createHash = (password) => {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10))
}


//PASSPORT SETTINS
app.use(passport.initialize())
app.use(passport.session())

passport.serializeUser((user, done) => {
    return done(null, user.id)
})

passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
        return done(err, user)
    })
})



passport.use('signup', new LocalStrategy({
    passReqToCallback: true
}, (req, password, username, done) => {
    User.findOne({
        username: username
    }, (err, user) => {
        if (err) return done(err)
        if (user) return done(null, false, {
            message: 'User already exists'
        })
        const newUser = {
            username: username,
            password: createHash(password)
        }
        User.create(newUser, (err, userCreated) => {
            if (err) return done(err)
            return done(null, userCreated)
        })
    })
}))




//Views
app.set('views', __dirname + '/views')

//Handlebars engine
app.engine('handlebars', handlebars.engine())
app.set('view engine', 'handlebars')


app.get('/', (req, res) => {
    res.render('home', {
        books: booksArray
    })
})

app.get('/prueba', (req, res) => {
    res.render('prueba')
})

app.get('/profile', (req, res) => {
    res.render('profile')
})

app.get('/fail', (req, res) => {
    res.render('fail')
})



/* INFO */
app.get('/info', (req, res, next) => {
    const datosProcess = {
        directorio: process.cwd(),
        id: process.pid,
        version: process.version,
        titulo: process.title,
        so: process.platform,
        argv: process.argv.slice(1),
        rss: process.memoryUsage().rss,
        ncpus: numCPUs
    }
    console.log(datosProcess)
    res.render('infoTable', {
        datosProcess: datosProcess
    })
});

//POST
app.post('/', passport.authenticate('signup', {
    failureRedirect: '/fail'
}), (req, res) => {
    res.redirect('/profile')

})

let faker = require(`faker`);
const { errorLog: loggerWinston } = require(`../utils/loggers/winston`);
router.get('/api/products-test', (req, res) => {
    try {
        async function createObjects() {
            for (let i = 0; i < 6; i++) {
                let product = {
                    name: faker.commerce.productName(),
                    price: faker.commerce.price(100, 200, 0, `$`),
                    id: faker.datatype.number(10),
                    thumbnail: faker.image.imageUrl(1234, 2345, `technology`, true)
                }
                await productService.add(product);
            }
        }
        createObjects();
    } catch {
        loggerWinston.error(`Error at products creation`);
    }
})



// function promedioResultadosTest(resultadosTest) {
//     // "resultadosTest" debe ser una matriz de enteros (int/integers)
//     // Itera (en un bucle) los elementos del array, calcula y devuelve el promedio de puntajes
//     // Tu código:
//     if(!Array.isArray(resultadosTest)) throw new ('Not array')

//     resultadosTest.map(el => {
//         if (isNaN(el)) {
//             throw new Error('Not A Number')
//         }
//         if (!Number.isInteger(el)) throw new Error('Not integer');
//     })
//     const arrayLength = resultadosTest.length;
//     let suma = resultadosTest.reduce((acc, curr) => acc + curr, 0);
//     let result = suma / arrayLength;
//     console.log(result);

// }



// function numeroMasGrande(numeros) {
//     // "numeros" debe ser una matriz de enteros (int/integers)
//     // Devuelve el número más grande
//     // Tu código:
//     let solitomayor = Math.max(...numeros);
//    let mayor = numeros.reduce((acc, curr)=>Math.max(acc,curr));

//     console.log(solitomayor); 
// }
//   numeroMasGrande([1,5,6,8,9,6,2,4,5,6,8,6,3,99,2,1,4,5])