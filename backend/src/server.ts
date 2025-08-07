import express from 'express';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import cors from 'cors';
import { typeDefs } from './schema';
import { resolvers } from './resolvers';
import { createContext } from './auth';

async function startServer() {
    const app = express();
    const port = process.env.PORT || 4000;

    // Create Apollo Server
    const server = new ApolloServer({
        typeDefs,
        resolvers,
    });

    await server.start();

    // Apply middleware
    app.use(
        '/graphql',
        cors<cors.CorsRequest>({
            origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
            credentials: true,
        }),
        express.json(),
        expressMiddleware(server, {
            context: createContext,
        })
    );

    // Health check endpoint
    app.get('/health', (req, res) => {
        res.json({ status: 'ok', message: 'Server is running' });
    });

    app.listen(port, () => {
        console.log(`🚀 Server ready at http://localhost:${port}/graphql`);
        console.log(`📊 Health check at http://localhost:${port}/health`);
    });
}

startServer().catch((error) => {
    console.error('Error starting server:', error);
    process.exit(1);
});
