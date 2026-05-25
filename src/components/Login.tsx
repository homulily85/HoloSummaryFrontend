function Login() {
    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
            <h1 className="text-4xl font-bold mb-6">Welcome to HoloSummary</h1>
            <a 
                href="http://localhost:8080/oauth2/authorization/google" 
                className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
            >
                Login with Google
            </a>
        </div>
    );
}

export default Login;