const getOnlineStatus = (onlineStatus, onlineUsers) => {
  const found = onlineUsers.some((item) => item.userSlug === onlineStatus)
  return found
}

export default getOnlineStatus
