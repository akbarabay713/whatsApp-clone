import styled from "styled-components";
import Avatar from "@mui/material/Avatar";
import ChatIcon from "@mui/icons-material/Chat";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import SearchIcon from "@mui/icons-material/Search";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import { auth, db } from "../firebase";
import { signOut } from "firebase/auth";
import * as EmailValidator from "email-validator";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollection } from "react-firebase-hooks/firestore";
import { collection, query, where, addDoc } from "firebase/firestore";
import Chat from "./Chat";
import { useState } from "react";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import LogoutIcon from "@mui/icons-material/Logout";

function Sidebar() {
  const [user] = useAuthState(auth);
  const [filter, setFilter] = useState([]);

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const userChatRef = query(
    collection(db, "chats"),
    where("users", "array-contains", user.email)
  );

  const [chatSnapshot] = useCollection(userChatRef);

  const handleSignOut = () => {
    signOut(auth)
      .then(() => {
        // Sign-out successful.
      })
      .catch((error) => {
        // An error happened.
      });
  };

  const handleNewChat = async () => {
    const input = prompt("email");
    if (!input) return null;

    if (EmailValidator.validate(input) && user.email !== input) {
      await addDoc(collection(db, "chats"), {
        users: [user.email, input],
      });
    }
  };

  const checkChat = (recepientEmail) =>
    !!chatSnapshot.docs.find((chat) =>
      chat.data().users.find((user) => user === recepientEmail.length > 0)
    );

  const filterBySearch = (e) => {
    const lists = chatSnapshot?.docs.map((list) => list);
    const query = e.target.value;
    const updatedList = [...lists];
    const results = updatedList.filter((list) => {
      if (e.target.value === "") return updatedList;
      return list.data().users[1].toLowerCase().includes(query.toLowerCase());
    });
    setFilter(results);
  };

  return (
    <Container>
      <Stiky>
        <Header>
          <UserAvatar src={user.photoURL} onClick={handleSignOut} />
          <IconContainer>
            <IconChat color="action" />

            <IconButton
              onClick={handleClick}
              aria-controls={open ? "account-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={open ? "true" : undefined}
            >
              <Dot />
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
              <MenuItem onClick={handleSignOut}>
                <LogoutIcon color="action" /> logout
              </MenuItem>
            </Menu>
          </IconContainer>
        </Header>
        <SearchContainer>
          <IconButton>
            <Search />
          </IconButton>
          <SearchInput
            type="text"
            onChange={filterBySearch}
            placeholder="search..."
          />
        </SearchContainer>
      </Stiky>
      <StartChatButton onClick={handleNewChat}>START NEW CHAT</StartChatButton>

      {filter.length == 0
        ? chatSnapshot?.docs.map((chat) => (
            <Chat key={chat.id} id={chat.id} users={chat.data().users} />
          ))
        : filter?.map((chat) => (
            <Chat key={chat.id} id={chat.id} users={chat.data().users} />
          ))}
    </Container>
  );
}

export default Sidebar;

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

const Stiky = styled.div`
  position: sticky;
  top: 0;
  z-index: 70;
`;

const Container = styled.div`
  min-width: 300px;
  max-width: 350px;
  /* height: 100vh; */
  /* overflow: hidden; */
`;
const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  background: #ededed;
  border-bottom: 1px solid whitesmoke;
  border-right: 1px solid whitesmoke;
`;
const IconContainer = styled.div`
  display: flex;
  align-items: center;
`;

const SearchContainer = styled.div`
  display: flex;
  padding: 20px;
  background: #f6f6f6;
`;
const SearchInput = styled.input`
  flex: 1;
  outline-width: 0;
  border: none;
  border-radius: 15px;
  padding: 0 20px;
`;

const StartChatButton = styled(Button)`
  &&& {
    text-align: center;
    border-top: 1px solid whitesmoke;
    border-bottom: 1px solid whitesmoke;
    width: 100%;
    color: black;
  }
`;
const Search = styled(SearchIcon)``;
const UserAvatar = styled(Avatar)`
  cursor: pointer;
`;
const IconChat = styled(ChatIcon)``;
const Dot = styled(MoreVertIcon)``;
