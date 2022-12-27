import { NavLink } from "react-router-dom";
import { LgContainer } from "../components/profile/styles";
import EditableProfile from "../components/profile/EditableProfile";

function EditProfile() {
  return (
    <LgContainer>
      <ol className="breadcrumb">
        <li className="breadcrumb-item">
          <NavLink to="/profile">profile</NavLink>
        </li>
        <li className="breadcrumb-item">edit</li>
      </ol>
      <EditableProfile />
    </LgContainer>
  );
}

export default EditProfile;
