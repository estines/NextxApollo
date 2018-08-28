import next from 'next'
import express from 'express'
import settings from './settings'
import { ApolloServer } from 'apollo-server-express'
import GraphQLSchema from './graphql'
import cors from 'cors'

const dev = process.env.NODE_ENV !== 'prod';
(async () => {
    try {
        const app = express()
        const server = new ApolloServer(GraphQLSchema)
        server.applyMiddleware({ app })
        const nextApp = next({
            dev
        })
        const handle = nextApp.getRequestHandler()

        await nextApp.prepare()

        const corsMiddleware = cors({
            origin: settings.originUrl,
            credentials: true,
            preflightContinue: false
        })

        app.use(corsMiddleware)
        app.options(corsMiddleware)


        app.get('*', (req, res) => {
            return handle(req, res)
        })

        app.listen(settings.port, () => console.log(`🚀 Server ready at http://localhost:3000${server.graphqlPath}`))
    } catch (e) {
        console.error(e)
    }
})()