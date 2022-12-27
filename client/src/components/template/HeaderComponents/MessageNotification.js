import { useState, useEffect } from "react";
import styled from "styled-components";
import { GoPrimitiveDot } from "react-icons/go";
import { useCookies } from "react-cookie";
import useSWR from "swr";
import { API_URL } from "../../../constants/api";

export const AlertIcon = styled(GoPrimitiveDot)`
  height: 1.3rem;
  width: 1.3rem;
  color: #dc2626;
  margin-left: 0.5rem;
`;

function MessageNotification() {
  const [unReadCount, setunReadCount] = useState(0);
  const [{ user }] = useCookies(["user"]);
  const slug = user?.slug;
  const url = `${API_URL}/message/unread/user/${slug}`;
  const { data: unreadMessages } = useSWR(url);

  useEffect(() => {
    setunReadCount(unreadMessages?.length);
  }, [unreadMessages]);

  if (unReadCount > 0) {
    return <AlertIcon />;
  } else {
    return null;
  }
}

export default MessageNotification;
