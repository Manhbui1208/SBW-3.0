// Sidebar.js
import React, { useState } from "react";
import "./Sidebar.css";
import TwitterIcon from "./images/uts_logo.png";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import EditIcon from "@mui/icons-material/Edit";
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutIcon from "@mui/icons-material/Logout";

function Sidebar() {
  const [isEditing, setIsEditing] = useState(false);
  const [profileInfo, setProfileInfo] = useState({
    name: "John Doe", // Default name
    profilePicture: TwitterIcon, // Default profile picture
  });

  const handleEditProfile = () => {
    setIsEditing(true);
  };

  const handleSaveProfile = (newName, newProfilePicture) => {
    setProfileInfo({
      name: newName,
      profilePicture: newProfilePicture,
    });
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  const handleUpdatePicture = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const newProfilePicture = reader.result;
        setProfileInfo((prevProfileInfo) => ({
          ...prevProfileInfo,
          profilePicture: newProfilePicture,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="sidebar">
      {/* Profile Picture */}
      <label htmlFor="profile-picture-input">
        <div className="profile-picture">
          <img src={profileInfo.profilePicture} alt="Profile" />
        </div>
      </label>
      <input
        id="profile-picture-input"
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        onChange={handleUpdatePicture}
      />

      {/* Display Name */}
      <p>{profileInfo.name}</p>

      {/* Sidebar Menu */}
      <div className="sidebar-menu">
        <p onClick={handleEditProfile}>
          <AccountCircleIcon /> Profile
        </p>
        <p>
          <EditIcon /> Edit
        </p>
        <p>
          <SettingsIcon /> Settings
        </p>
        <p>
          <LogoutIcon /> Logout
        </p>
      </div>

      {/* Edit Profile Modal */}
      {isEditing && (
        <div className="edit-profile-modal">
          <div className="modal-content">
            <h2>Edit Profile</h2>
            <label htmlFor="new-name">New Name:</label>
            <input
              type="text"
              id="new-name"
              value={profileInfo.name}
              onChange={(e) => setProfileInfo((prev) => ({ ...prev, name: e.target.value }))}
            />
            <button onClick={() => handleSaveProfile(profileInfo.name, profileInfo.profilePicture)}>Save</button>
            <button onClick={handleCancelEdit}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Sidebar;
