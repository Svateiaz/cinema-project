import AuthForm from "../components/Forms/AuthForm";

const SignUp = () => {
  return (
    <AuthForm
      title="Sign Up"
      apiEndpoint="http://localhost:3000/user"
      successRedirect="/login"
      isSignUp={true}
    />
  );
};

export default SignUp;
