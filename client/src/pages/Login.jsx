import AuthForm from "../components/Forms/AuthForm";

function Login() {
  return (
    <AuthForm title="Login" apiEndpoint="http://localhost:3000/login" successRedirect="/movies" />
  );
}

export default Login;
