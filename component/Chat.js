import styled from "styled-components";
import getRecepientEmail from "./../utils.js/getRecepientEmail";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../firebase";
import Avatar from "@mui/material/Avatar";
import { collection, query, where } from "firebase/firestore";
import { useRouter } from "next/router";
import { useCollection } from "react-firebase-hooks/firestore";
function Chat({ users, id }) {
  const router = useRouter();
  const [user] = useAuthState(auth);
  const recepient = getRecepientEmail(users, user);

  const [recepientSnapshot] = useCollection(
    query(
      collection(db, "users"),
      where("email", "==", getRecepientEmail(users, user))
    )
  );

  const handleChat = (e) => {
    e.preventDefault();
    router.push(`/chat/${id}`);
  };

  const recepientPhoto = recepientSnapshot?.docs?.[0]?.data();

  return (
    <Container onClick={handleChat}>
      {recepientPhoto ? (
        <Userphoto src={recepientPhoto?.photoURL} />
      ) : (
        <Userphoto>{recepient[0]}</Userphoto>
      )}
      <User> {recepient}</User>
    </Container>
  );
}

export default Chat;

const Container = styled.div`
  display: flex;
  align-items: center;
  padding-left: 1.2rem;
  margin: 10px 0;

  :hover {
    background-color: #e9eaeb;
    cursor: pointer;
  }
`;

const Userphoto = styled(Avatar)`
  /* font-size: 40px; */
  margin-right: 10px;
`;
const User = styled.p`
  word-break: break-word;
`;
