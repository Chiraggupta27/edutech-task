import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../../features/auth/authSlice.js";
import { clearTasks } from "../../features/tasks/taskSlice.js";
import { toast } from "../../features/ui/uiSlice.js";
import ConfirmModal from "../Modal/ConfirmModal.jsx";
import "./navbar.css";

export default function Navbar() {
  const user = useSelector((s) => s.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [confirmOpen, setConfirmOpen] = useState(false);

  const doLogout = () => {
    dispatch(logout());
    dispatch(clearTasks());
    dispatch(toast({ type: "info", message: "Logged out" }));
    navigate("/login", { replace: true });
  };

  return (
    <>
      <div className="nav">
        <div className="container navInner">
          <div className="brand">
            <div>
              <div className="brandTitle">Task Dashboard</div>
              <div className="brandSub muted">
                {user ? `Welcome, ${user.name}` : " "}
              </div>
            </div>
          </div>

          <button
            type="button"
            className="btn btn-ghost navBtn"
            onClick={() => setConfirmOpen(true)}
          >
            Logout
          </button>
        </div>
      </div>

      <ConfirmModal
        open={confirmOpen}
        title="Logout?"
        message="Are you sure you want to logout?"
        confirmText="Logout"
        cancelText="Cancel"
        onClose={() => setConfirmOpen(false)}
        onConfirm={() => {
          setConfirmOpen(false);
          doLogout();
        }}
      />
    </>
  );
}

