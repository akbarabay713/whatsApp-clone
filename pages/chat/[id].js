import Sidebar from "../../component/Sidebar";
import ChatScreen from "../../component/ChatScreen";
import styled from "styled-components";
import { doc, getDoc, orderBy, collection, getDocs } from "firebase/firestore";
import { auth, db } from "../../firebase";
import Head from "next/head";
import getRecepientEmail from "./../../utils.js/getRecepientEmail";
import { useAuthState } from "react-firebase-hooks/auth";

function ChatPage({ chat, messages }) {
  const [user] = useAuthState(auth);
  const recipient = getRecepientEmail(chat.users, user);
  // console.log(messages);
  return (
    <Container>
      <Head>
        <title>chat with {recipient}</title>
      </Head>
      <Sidebar />
      <ChatScreen chat={chat} messages={messages} />
    </Container>
  );
}

export default ChatPage;

export async function getServerSideProps(context) {
  const docRef = doc(db, "chats", context.query.id);
  const messageRef = collection(db, "chats", context.query.id, "messages");

  const messagesRes = await getDocs(messageRef, orderBy("timestamp", "asc"));

  const messages = messagesRes.docs
    .map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))
    .map((messages) => ({
      timestamp: messages.timestamp.toDate().getTime(),
      ...messages,
    }));

  const chatRes = await getDoc(docRef);

  const chat = {
    id: chatRes.id,
    ...chatRes.data(),
  };

  // const aa = messagesRes.docs();
  console.log(chat, messages);
  return {
    props: {
      chat,
      messages: JSON.stringify(messages),
    },
  };
}

const Container = styled.div`
  display: flex;
`;
