import {FaHome,FaHistory,FaBook,FaFolderOpen,FaInfoCircle,} from "react-icons/fa";
import "./Sidebar.css";

const Sidebar=()=>{
    return(
        <div className="sidebar">
            <div className="logo">
                <h2>SteelAssist AI </h2>
                <p>Learning Assistant</p>
            </div>
            <div className="menu">
                <div className="menu-item active">
                    <FaHome />
                    <span>Home</span>
                </div>
                <div className="menu-item">
                    <FaHistory/>
                    <span>Chat History</span>
                </div>
                <div className="menu-item">
                    <FaBook/>
                    <span>Training Topics</span>
                </div>
                <div className="menu-item">
                    <FaFolderOpen/>
                    <span>Documents</span>
                </div>
                <div className="menu-item">
                    <FaInfoCircle/>
                    <span>About</span>
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
    )
}
export default Sidebar;