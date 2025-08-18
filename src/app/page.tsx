import { redirect } from "next/navigation";
import { verifySession } from "@/app/actions/dal";
import LoginForm from "@/app/components/ClientSidePages/loginClient";

export default async function LoginPage() {
    try {
        const session = await verifySession();
        if (session?.access_token) {
            redirect("/discovery");
        }
    } catch (err) {
        console.log("Error verifying session: ", err);
    }

    return <LoginForm />;
}
