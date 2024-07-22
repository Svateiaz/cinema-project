import PasswordForm from "../components/Forms/PasswordForm";

function ForgotPassword() {
  return (
    <PasswordForm
      title="Send Email"
      apiEndpoint="http://localhost:3000/user/forgot-password"
      successMessage="Password reset code sent to your email."
      inputLabel="Email address"
      inputType="text"
      redirectPath="/reset-password"
      formType="forgot"
    />
  );
}

export default ForgotPassword;

