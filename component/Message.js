import moment from "moment";
import styled from "styled-components";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase";
function Message({ messages, user, timestamp }) {
  const [userLoggedIn] = useAuthState(auth);

  const TypeOfMessage = userLoggedIn.email === user ? sender : receiver;

  // console.log(timestamp.toDate().getTime());
  // return <p>{moment(timestamp.toDate().getTime()).format("LT")}</p>;
  return (
    <div>
      <TypeOfMessage>
        {messages}
        <Time>
          {timestamp
            ? moment(timestamp?.toDate().getTime()).format("LT")
            : "..."}
        </Time>
      </TypeOfMessage>
    </div>
  );
}

export default Message;

const Time = styled.span`
  color: #8c8c8c;
  font-size: 11px;
  position: absolute;
  bottom: 0;
  right: 0;
  padding: 5px;
`;

const TypeOfMessage = styled.p`
  border: 1px solid transparent;
  border-radius: 5px;
  width: fit-content;
  padding: 7px 60px 7px 7px;
  margin: 10px;
  min-width: 100px;
  max-width: 300px;
  word-wrap: break-word;
  background: #dcf8c6;
  color: #303030;
  position: relative;
`;

const sender = styled(TypeOfMessage)`
  text-align: left;
  margin-left: auto;
`;
const receiver = styled(TypeOfMessage)`
  text-align: left;

  background: #fff;
`;
