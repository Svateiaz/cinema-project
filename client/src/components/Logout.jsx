
import { useMutation } from "react-query";

const logoutUser = async () => {
  const response = await fetch("http://localhost:3000/logout", {
    method: "POST",
    credentials: "include", 
  });

  if (!response.ok) {
    throw new Error("Logout failed");
  }

  const data = await response.json();
  console.log(data);
};

function MyComponent() {
  const mutation = useMutation(logoutUser);

  const handleLogout = () => {
    mutation.mutate();
  };

  return (
    <div>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}

export default MyComponent;
