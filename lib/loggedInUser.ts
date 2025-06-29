// import "server-only";
import { auth } from "@/auth";
import { getUserByEmail } from "@/queries/users";


export async function getLoggedInUser(){
    const session = await auth();
    console.log('authsession',session)
    if(!session?.user) return null;

    return getUserByEmail(session?.user?.email);// in user queries
}