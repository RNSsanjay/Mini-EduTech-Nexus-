import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export interface AuthUser {
    id: string;
    email: string;
    name: string;
}

export const getUser = async (token: string): Promise<AuthUser | null> => {
    try {
        if (!token) return null;

        const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
        const user = await prisma.user.findUnique({
            where: { id: decoded.userId },
            select: { id: true, email: true, name: true },
        });

        return user;
    } catch (error) {
        return null;
    }
};

export const createContext = async ({ req }: { req: any }) => {
    const token = req.headers.authorization?.replace('Bearer ', '') || '';
    const user = await getUser(token);

    return {
        prisma,
        user,
    };
};
