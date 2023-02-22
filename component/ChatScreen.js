import { Avatar } from "@mui/material";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import InsertEmoticonIcon from "@mui/icons-material/InsertEmoticon";

import SendIcon from "@mui/icons-material/Send";
import styled from "styled-components";
import Message from "./Message";
import { useState, useRef } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../firebase";
import { useRouter } from "next/router";
import getRecepientEmail from "./../utils.js/getRecepientEmail";
import { useCollection } from "react-firebase-hooks/firestore";
import * as React from "react";
import TimeAgo from "timeago-react";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

import {
  doc,
  setDoc,
  serverTimestamp,
  addDoc,
  collection,
  orderBy,
  query,
  where,
  deleteDoc,
} from "firebase/firestore";

function ChatScreen({ chat, messages }) {
  const [user] = useAuthState(auth);
  const [message, setMessage] = useState("");
  const endOfMessageRef = useRef(null);
  const router = useRouter();
  const recepientEmail = getRecepientEmail(chat.users, user);

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const [messageSnapshot] = useCollection(
    query(
      collection(db, "chats", router.query.id, "messages"),
      orderBy("timestamp", "asc")
    )
  );

  const [recepientSnapshot] = useCollection(
    query(
      collection(db, "users"),
      where("email", "==", getRecepientEmail(chat.users, user))
    )
  );

  const recepient = recepientSnapshot?.docs?.[0]?.data();

  console.log(recepientSnapshot);

  const scrollToBottom = () => {
    endOfMessageRef.current.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const handleChat = async (e) => {
    e.preventDefault();

    const userRef = doc(db, "users", user.uid);
    setDoc(
      userRef,
      {
        email: user.email,
        lastSeen: serverTimestamp(),
        photoURL: user.photoURL,
      },
      { merge: true }
    );

    await addDoc(collection(db, "chats", router.query.id, "messages"), {
      message: message,
      timestamp: serverTimestamp(),
      user: user.email,
      photo: user.photoURL,
    });

    setMessage("");
    scrollToBottom();
  };

  const showMessages = () => {
    if (messageSnapshot) {
      return messageSnapshot.docs.map((doc) => (
        <Message
          key={doc.id}
          messages={doc.data().message}
          user={doc.data().user}
          timestamp={doc.data().timestamp}
        />
      ));
    } else {
      return JSON.parse(messages).map((message) => (
        <Message
          key={message.id}
          messages={message.message}
          user={message.user}
          timestamp={message.Timestamp}
        />
      ));
    }
  };

  const handleDelete = async () => {
    router.push(`/`);
    await deleteDoc(doc(db, "chats", router.query.id));
  };

  return (
    <ChatContainer>
      <Header>
        {recepientSnapshot ? (
          recepient ? (
            <Avatar src={recepient?.photoURL} />
          ) : (
            <Avatar>{recepientEmail[0]}</Avatar>
          )
        ) : (
          <p>loading</p>
        )}

        <InfoContainer>
          <h3>{recepientEmail}</h3>
          <LastActive>
            last active :{" "}
            {recepient?.lastSeen ? (
              <TimeAgo datetime={recepient.lastSeen.toDate()} />
            ) : (
              "unavailable"
            )}
          </LastActive>
        </InfoContainer>
        <IconContainer>
          <AttachFileIcon color="action" />

          <IconButton
            onClick={handleClick}
            aria-controls={open ? "account-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
          >
            <MoreVertIcon />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            id="account-menu"
            open={open}
            onClose={handleClose}
            onClick={handleClose}
            PaperProps={paperProps}
            transformOrigin={{ horizontal: "right", vertical: "top" }}
            anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
          >
            <MenuItem onClick={handleDelete}>
              <DeleteIcon color="action" /> delete chat
            </MenuItem>
          </Menu>
        </IconContainer>
      </Header>
      <MessageContainer>
        {showMessages()}
        <EndOfMessage ref={endOfMessageRef} />
      </MessageContainer>
      <InputContainer onSubmit={handleChat}>
        <InsertEmoticonIcon color="action" />
        <Input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <IconButton onClick={handleChat}>
          <SendIcon />
        </IconButton>
      </InputContainer>
    </ChatContainer>
  );
}

export default ChatScreen;

const paperProps = {
  elevation: 0,
  sx: {
    overflow: "visible",
    filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
    mt: 1.5,
    "& .MuiAvatar-root": {
      width: 32,
      height: 32,
      ml: -0.5,
      mr: 1,
    },
    "&:before": {
      content: '""',
      display: "block",
      position: "absolute",
      top: 0,
      right: 14,
      width: 10,
      height: 10,
      bgcolor: "background.paper",
      transform: "translateY(-50%) rotate(45deg)",
      zIndex: 0,
    },
  },
};

const EndOfMessage = styled.div``;

const ChatContainer = styled.div`
  height: 100vh;
  width: 100%;
  background-color: #f0f0f0;

  overflow-y: scroll;
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */

  ::-webkit-scrollbar {
    display: none;
  }
`;

const Header = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid whitesmoke;
  padding: 0 11px;
  position: sticky;
  top: 0;
  height: 80px;
  background-color: #ededed;
  z-index: 70;
`;

const InfoContainer = styled.div`
  flex: 1;
  padding: 15px;
  box-sizing: border-box;

  > h3 {
    margin-bottom: 10px;
  }

  p > {
    color: grey;
    font-size: 14px;
  }
`;
const IconContainer = styled.div`
  display: flex;
  align-items: center;
`;

const InputContainer = styled.form`
  display: flex;
  align-items: center;
  position: sticky;
  bottom: 0;
  z-index: 100;
  background-color: #f0f0f0;
  padding: 0 1rem;
`;
const Input = styled.input`
  flex: 1;
  outline: none;
  padding: 14px;
  border-radius: 10px;
  margin: 15px 15px;
  border: none;
  background-color: #fff;
`;

const MessageContainer = styled.div`
  min-height: 80vh;
  background-color: #e5ded8;
  padding: 30px;
`;

const LastActive = styled.p`
  color: gray;
  font-size: small;
`;
