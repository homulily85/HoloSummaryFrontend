// src/components/OAuth2RedirectHandler.tsx
import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { setAccessToken } from "../utils/apiClient";

function OAuth2RedirectHandler() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    useEffect(() => {
        const token = searchParams.get("token");

        if (token) {
            // Save the token to our Axios client
            setAccessToken(token);

            // Redirect to the home page seamlessly
            navigate("/", { replace: true });
        } else {
            // If something goes wrong, send them back to login
            navigate("/login", { replace: true });
        }
    }, [navigate, searchParams]);

    return (
        <div className='flex h-screen items-center justify-center'>
            <p className='text-xl font-semibold'>Logging you in...</p>
        </div>
    );
}

export default OAuth2RedirectHandler;
