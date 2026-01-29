import { PrismaClient } from "@prisma/client";


   const prisma =  new PrismaClient({
    // log: process.env.NODE_ENV === 'development' ? ['query'] : ['error'],
    errorFormat: 'minimal',
  });

export async function connectToDatabase (){
    try {
    console.log('in the connect');
    await prisma.$connect();
    console.log('✅ Connected to database successfully');
    } catch (error) {
        console.error('error connecting to database')
        throw  new Error('Error Connecting to Database')
    }
}

export async function disconnectFromDatabase (){
    try {
    console.log('in the connect');
    await prisma.$disconnect();
    console.log('✅ Connected to database successfully');
    } catch (error) {
        console.error('error connecting to database')
        throw  new Error('Error Connecting to Database')
    }
}

export { prisma };
