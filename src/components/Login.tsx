function Login() {
    return (
        <div className="flex flex-col items-center justify-center h-full bg-gray-50">
            <h2 className="text-4xl font-bold mb-6 text-center">Welcome to HoloSummary</h2>
            <a 
                href="/oauth2/authorization/google" 
                className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
            >
                Login with Google
            </a>
        </div>
    );
}

export default Login;