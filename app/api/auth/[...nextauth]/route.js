// Setup google authentication

import User from "@models/user";
import { connectToDB } from "@utils/database";
import NextAuth from "next-auth/next";
import GoogleProvider from "next-auth/providers/google";

console.log({
    ID: process.env.GOOGLE_ID,
    SECRET: process.env.GOOGLE_CLIENT_SECRET
})

const handler = NextAuth({
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_ID, // maruf.contact.bd@gmail.com
            clientSecret: process.env.GOOGLE_CLIENT_SECRET
        })
    ], 
    async session({session}) {
        const sessionUser = await User.findOne({
            email: session.user.email
        });

        session.user.id = sessionUser._id.toString();
        return session;
    }, 
    async signIn({profile}) {
        try {
            // Serverless > Lambda > dynamicDB
            connectToDB();

            //check a user already exists
            var userExists = await User.findOne({
            })
            //if not create a new user
            
            if(!userExists) {
               await User.create({
                    email: profile.email,
                    username: profile.name.replace(" ","").toLowerCase(),
                    image: profile.picture
                })
            }
            return true;
        } catch (error) {
            console.log(error);
            return false;
        }
    }
})

export { handler as GET, handler as POST };

