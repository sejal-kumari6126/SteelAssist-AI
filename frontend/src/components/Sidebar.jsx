import {
  FaHome,
  FaHistory,
  FaBook,
  FaFolderOpen,
  FaInfoCircle,
} from "react-icons/fa";

import { useNavigate } from "react-router-dom";

import "./Sidebar.css";

const Sidebar = () => {
  const navigate = useNavigate();

  return (
    <div className="sidebar">
      <div>
        <div className="logo">
          <h2>SteelAssist AI</h2>
          <p>Learning Assistant</p>
        </div>

        <div className="menu">

          {/* Home */}
          <div
            className="menu-item active"
            onClick={() => navigate("/")}
          >
            <FaHome />
            <span>Home</span>
          </div>

          {/* Chat History */}
          <div
            className="menu-item"
            onClick={() => navigate("/history")}
          >
            <FaHistory />
            <span>Chat History</span>
          </div>

          {/* Training Topics */}
          <div className="menu-item">
            <FaBook />
            <span>Training Topics</span>
          </div>

          {/* Documents */}
          <div className="menu-item">
            <FaFolderOpen />
            <span>Documents</span>
          </div>

          {/* About */}
          <div className="menu-item">
            <FaInfoCircle />
            <span>About</span>
          </div>

        </div>
      </div>

      <div className="profile">
        <div className="avatar">R</div>

        <div>
          <h4>Ravi Kumar</h4>
          <p>Employee</p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;