import next from 'next'
import express from 'express'
import settings from './settings'
import { ApolloServer } from 'apollo-server-express'
import GraphQLSchema from './server'
import cors from 'cors'

const dev = process.env.NODE_ENV !== 'prod';

const nextApp = next({ dev })
const handle = nextApp.getRequestHandler()

const corsMiddleware = cors({
    origin: settings.originUrl,
    credentials: true,
    preflightContinue: false
})

nextApp.prepare().then(() => {
    const app = express()
    const server = new ApolloServer(GraphQLSchema)

    server.applyMiddleware({ app })

    app.use(corsMiddleware)
    app.options(corsMiddleware)

    app.get('*', (req, res) => {
        return handle(req, res)
    })

    app.listen(settings.port, () => console.log(`🚀 Server ready at http://localhost:3000${server.graphqlPath}`))
})