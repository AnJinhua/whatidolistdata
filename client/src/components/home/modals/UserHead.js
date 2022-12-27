import { ElipsDot } from "../../messenger/gen.styles";
import { UserHeaderContainer } from "./styles";

function UserHead({ searchUser }) {
  return !searchUser ? (
    <ElipsDot>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </ElipsDot>
  ) : (
    <UserHeaderContainer>
      <img
        loading="lazy"
        className="avatar-img"
        src={
          searchUser?.imageUrl?.cdnUrl
            ? searchUser?.imageUrl?.cdnUrl
            : "/img/profile.png"
        }
        alt="profile "
      />

      <div className="user-name">
        <p className="text-lg">
          {searchUser.profile.firstName}
          {"  "}
          {searchUser.profile.lastName}
        </p>
        <p className="text-sm"> expert in {searchUser?.expertCategories[0]}</p>
      </div>
    </UserHeaderContainer>
  );
}

export default UserHead;
