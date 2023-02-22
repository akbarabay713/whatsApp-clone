import Logo from "../component/Logo";
import styled from "styled-components";
import { auth, provider } from "../firebase";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import Button from "@mui/material/Button";
function Login() {
  const handleLogin = () => {
    signInWithPopup(auth, provider)
      .then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        // The signed-in user info.
        console.log(token);
        const user = result.user;
        console.log(user);
      })
      .catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        console.log(errorCode);
        const errorMessage = error.message;
        // The email of the user's account used.
        console.log(errorMessage);
        const email = error.email;
        // The AuthCredential type that was used.
        console.log(email);

        const credential = GoogleAuthProvider.credentialFromError(error);
        console.log(credential);
        // ...
      });
  };
  return (
    <Container>
      <LoginContainer>
        <Logo />
        <LoginButton onClick={handleLogin}>SIGN IN WITH GOOGLE</LoginButton>
      </LoginContainer>
    </Container>
  );
}

export default Login;

const Container = styled.div`
  display: grid;
  place-items: center;
  height: 100vh;
`;

const LoginContainer = styled.div`
  padding: 1.5em;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: 1px 1px 10px 3px grey;
`;
const LoginButton = styled(Button)`
  &&& {
    width: 100%;
    border-top: 1px solid whitesmoke;
    border-bottom: 1px solid whitesmoke;
  }
`;
