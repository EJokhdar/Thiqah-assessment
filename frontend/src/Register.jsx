import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPass] = useState("");
  const [confirm_pass, setConfirm] = useState("");
  const [birthdate, setBirthdate] = useState("");
  const [profile_picture, setPicture] = useState("");
  const [first_name, setFirst] = useState("");
  const [last_name, setLast] = useState("");
  const [level, setLevel] = useState("");
  const [program, setProgram] = useState("");
  const [division, setDivision] = useState("");

  const [profile_picture_file, setProfilePictureFile] = useState(null);

  // Function to handle the profile picture file selection
  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    setProfilePictureFile(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const profile_picture = profile_picture_file
      ? profile_picture_file.name
      : "";

    if (password !== confirm_pass) {
      // Passwords don't match, handle this error condition
      console.error("Passwords do not match.");
      return;
    }

    // Create a JavaScript object representing the form data
    const formData = {
      email,
      password,
      confirm_pass,
      first_name,
      last_name,
      birthdate,
      profile_picture,
      level,
      program,
      division,
    };

    // Send a POST request to the FastAPI endpoint with JSON payload
    try {
      const response = await fetch("http://localhost:8000/user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        // Handle successful registration (e.g., show a success message)
        console.log("Registration successful!");
        navigate("/login");
      } else {
        // Handle registration error (e.g., show an error message)
        console.error("Registration failed.");
      }
    } catch (error) {
      // Handle network or other errors
      console.error("An error occurred while registering:", error);
    }
  };

  const submitProfilePic = async () => {
    try {
      // Create a FormData object
      const formData = new FormData();

      // Append the selected file to the FormData object
      formData.append("file", profile_picture_file);

      // Make a POST request to the /uploadfile/ endpoint
      const response = await fetch("http://localhost:8000/uploadfile/", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        // Handle successful file upload
        const data = await response.json();
        const s3Url = data.s3_url;
        // Now you can use the s3Url in your application, save it to the database, etc.
        console.log("File uploaded successfully to S3:", s3Url);
      } else {
        // Handle file upload error
        console.error("File upload failed.");
      }
    } catch (error) {
      // Handle network or other errors
      console.error("An error occurred while uploading the file:", error);
    }
  };

  return (
    <>
      <div className="auth-form-container">
        <form className="register-form" onSubmit={handleSubmit}>
          <h2>Register</h2>
          <div className="form-section-container">
            <div className="form-section">
              <h3>Personal Information</h3>
              <div className="input-group">
                <label htmlFor="first_name">First name</label>
                <input
                  value={first_name}
                  name="first_name"
                  onChange={(e) => setFirst(e.target.value)}
                  id="first-name"
                  placeholder="First Name"
                />
              </div>
              <div className="input-group">
                <label htmlFor="last_name">Last name</label>
                <input
                  value={last_name}
                  name="last_name"
                  onChange={(e) => setLast(e.target.value)}
                  id="last-name"
                  placeholder="Last Name"
                />
              </div>
              <div className="input-group">
                <label htmlFor="email">Email</label>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  placeholder="youremail@gmail.com"
                  id="email"
                  name="email"
                />
              </div>
              <div className="input-group">
                <label htmlFor="birthdate">Birthday</label>
                <input
                  value={birthdate}
                  onChange={(e) => setBirthdate(e.target.value)}
                  type="date"
                  placeholder="DD/MM/YYYY"
                  id="birthdate"
                  name="birthdate"
                />
              </div>
              <div className="input-group">
                <label htmlFor="picture">Profile Picture:</label>
                <input
                  type="file"
                  accept=".png, .jpg, .jpeg" // Specify accepted file formats
                  onChange={handleProfilePictureChange}
                />
                {profile_picture_file && (
                  <p>Selected profile picture: {profile_picture_file.name}</p>
                )}
              </div>
              <div className="input-group">
                <label htmlFor="password">Password</label>
                <input
                  value={password}
                  onChange={(e) => setPass(e.target.value)}
                  type="password"
                  placeholder="Password"
                  id="password"
                  name="password"
                />
              </div>
              <div className="input-group">
                <label htmlFor="confirm_pass">Confirm Password</label>
                <input
                  value={confirm_pass}
                  onChange={(e) => setConfirm(e.target.value)}
                  type="password"
                  placeholder="Confirm Password"
                  id="confirm_pass"
                  name="confirm_pass"
                />
              </div>
            </div>
            <div className="form-section">
              <h3>Graduate Program</h3>
              <div className="input-group">
                <label htmlFor="level">Degree Earned</label>
                <select
                  value={level}
                  onChange={(e) => setLevel(e.target.value)}
                  required
                >
                  <option value="">Degree Level</option>
                  <option value="Bachelor's">Bachelor's Degree</option>
                  <option value="Master's">Master's Degree</option>
                </select>
              </div>
              <div className="input-group">
                <label htmlFor="level">Select Program</label>
                <select
                  value={program}
                  onChange={(e) => setProgram(e.target.value)}
                  required
                >
                  <option value="">Program</option>
                  <option value="Computer Science">Computer Science</option>
                  <option value="Software Engineer">Software Engineer</option>
                  <option value="Information Technology">
                    Information Technology
                  </option>
                  <option value="Cyber Security">Cyber Security</option>
                  <option value="Artificial Intelligence">
                    Artificial Intelligence
                  </option>
                </select>
              </div>
              <div className="input-group">
                <label htmlFor="level">Select Division/Facility</label>
                <select
                  value={division}
                  onChange={(e) => setDivision(e.target.value)}
                  required
                >
                  <option value="">Division/Facility</option>
                  <option value="Information">Information</option>
                  <option value="Data Analytics">Data Analytics</option>
                  <option value="UI & UX">UI & UX</option>
                  <option value="Software Engineer">Software Engineer</option>
                </select>
              </div>
            </div>
          </div>
          <button
            onClick={submitProfilePic}
            style={{
              backgroundColor: "#7439db", // Purple color
              color: "white", // Text color
              padding: "10px 20px",
              border: "none",
              borderRadius: "10px", // Rounded corners
              cursor: "pointer",
              transition: "background-color 0.3s",
              marginTop: "1.5rem",
            }}
          >
            Register
          </button>
        </form>
        <Link to="/login" className="link-btn">
          Already have an account? Login here.
        </Link>
      </div>
    </>
  );
};

export default Register;
