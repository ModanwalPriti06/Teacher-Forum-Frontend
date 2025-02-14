import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import "./ProfilePage.css";
import { useNavigate } from "react-router-dom";

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showPopup, setShowPopup] = useState(false);
  const [classroomName, setClassroomName] = useState("");
  const [description, setDescription] = useState("");
  const [classroomsCreatedByMe, setClassroomsCreatedByMe] = useState([]);
  const [classroomsJoinedByMe, setClassroomsJoinedByMe] = useState([]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_BASE_URL}/auth/getuser`,
          {
            method: "GET",
            credentials: "include",
          }
        );
        const data = await response.json();
        // console.log(data);
        if (response.ok) {
          setUser(data.data);
        } else {
          toast.error(data.message || "Failed to fetch user data");
        }
      } catch (error) {
        toast.error("An error occurred while fetching user data");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const fetchClassrooms = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/class/classroomscreatedbyme`,
        {
          method: "GET",
          credentials: "include",
        }
      );
      const data = await response.json();
      if (response.ok) {
        setClassroomsCreatedByMe(data.data);
      } else {
        toast.error(data.message || "Failed to fetch classrooms");
      }
    } catch (error) {
      toast.error("An error occurred while fetching classrooms");
    }
  };

  const fetchClassroomsJoinedByMe = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/class/classroomsforstudent`,
        {
          method: "GET",
          credentials: "include",
        }
      );
      const data = await response.json();
    //   console.log("data",data);
      if (response.ok) {
        setClassroomsJoinedByMe(data.data);
      }
    } catch (error) {
        console.log('weee',error)
      toast.error("An error occurred while fetching joined classrooms");
    }
  };

  useEffect(() => {
    if (!loading && user) {  // Ensure it runs only when loading is finished
      fetchClassrooms();
      fetchClassroomsJoinedByMe();
    }
  }, [user, loading]);
  
  const handleCreateClassroom = async () => {
    if (!classroomName.trim() || !description.trim()) {
        toast.error("Classroom name and description are required!");
        return;
      }
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/class/create`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: classroomName,
            description,
          }),
          credentials: "include",
        }
      );
      const data = await response.json();
      if (response.ok) {
        toast.success("Classroom created successfully");
        setClassroomName("");
        setDescription("");
        setShowPopup(false);
        fetchClassrooms();
      } else {
        toast.error(data.message || "Failed to create classroom");
      }
    } catch (error) {
      toast.error("An error occurred while creating classroom");
    }
  };

  const navigate = useNavigate();
  const handleRowClick = (classroomId) => {
    navigate(`/classes/${classroomId}`); // Navigate to the class details page
  };

  return (
    <div className="profile-page">
      {loading ? (
        <div className="loading">Loading...</div>
      ) : user ? (
        <>
          <h1 className="heading">Profile</h1>
          <div className="profile-info">
            <img
              src={ "https://picsum.photos/200" || "default-profile.png" }
              alt="Profile"
              className="profile-picture"
            />
            <div className="profile-details">
              <h2>{user.name}</h2>
              <p>Email: {user.email}</p>
              <p>Role: {user.role}</p>
              {user.role === "teacher" && (
                <button
                  className="create-classroom-btn"
                  onClick={() => setShowPopup(true)}
                >
                  Create Classroom
                </button>
              )}
            </div>
          </div>

          {showPopup && (
            <div className="popup-overlay">
              <div className="popup-content">
                <h3>Create Classroom</h3>
                <input
                  type="text"
                  placeholder="Classroom Name"
                  value={classroomName}
                  onChange={(e) => setClassroomName(e.target.value)}
                />
                <textarea
                  placeholder="Description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />

                <div className="popup-buttons">
                  <button onClick={() => setShowPopup(false)} className='closeBtn'>Cancel</button>
                  <button onClick={handleCreateClassroom} className='submitBtn'>Submit</button>
                </div>
              </div>
            </div>
          )}

          {user.role === "teacher" &&
            <div className="classroom-list">
              <h3 className="classroomAccess">Classrooms created by me</h3>
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Description</th>
                  </tr>
                </thead>
                <tbody>
                  {classroomsCreatedByMe.map((classroom) => (
                    <tr
                      key={classroom._id}
                      onClick={() => handleRowClick(classroom._id)}
                    >
                      <td style={{cursor:'pointer'}}>{classroom.name}</td>
                      <td style={{cursor:'pointer'}}>{classroom.description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          }
            <div className="classroom-list">
            <h3 className="classroomAccess">Classrooms joined by me</h3>
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Description</th>
                </tr>
              </thead>
              <tbody>
                {classroomsJoinedByMe.map((classroom) => (
                  <tr
                    key={classroom._id}
                    onClick={() => handleRowClick(classroom._id)}
                    className="clickable-row"
                  >
                    <td style={{cursor:'pointer'}}>{classroom.name}</td>
                    <td style={{cursor:'pointer'}}>{classroom.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <p>No user data found.</p>
      )}
    </div>
  );
};

export default ProfilePage;
