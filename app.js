import next from 'next'
import express from 'express'
import bodyParser from 'body-parser'
import settings from './settings'
import { ApolloServer, mergeSchemas } from 'apollo-server-express'
import schemas from './server/schemas'
import resolvers from './server/resolvers'
import cors from 'cors'
import { userController } from './server/user/db/user.controller'
import './server/common/pubsub'
import './server/common/db'

const dev = process.env.NODE_ENV !== 'prod';

const nextApp = next({ dev })
const handle = nextApp.getRequestHandler()

const corsMiddleware = cors({
    origin: settings.originUrl,
    credentials: true,
    preflightContinue: false
})

const schema = mergeSchemas({ schemas, resolvers })

nextApp.prepare().then(() => {
    const app = express()
    const server = new ApolloServer({
        schema,
        context: async ({ req }) => {
            if (!req || !req.headers) {
                return;
            }

            const token = req.headers.authorization || "";
            const checkToken = await userController.verifyToken(token);

            if (!checkToken.hasOwnProperty("authorized")) {
                return { user: checkToken, authorized: true };
            }
            return checkToken;
        },
        tracing: true
    })

    server.applyMiddleware({ app, path: '/api' })

    app.use(corsMiddleware)
    app.use(bodyParser.json())
    app.options(corsMiddleware)

    app.get('*', (req, res) => {
        return handle(req, res)
    })

    app.listen(settings.port, () => console.log(`🚀 Server ready at http://localhost:3000${server.graphqlPath}`))
})