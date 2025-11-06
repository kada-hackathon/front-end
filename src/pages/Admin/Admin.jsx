import { useState } from "react";
import { Eye, EyeOff, FileText, Circle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import "./admin.css";
import logoWithText from "@/assets/Logo/Logo with Text_White.png";
import logoOnly from "@/assets/Logo/Logo Only_White.png";

const Admin = () => {
  const [showPasswords, setShowPasswords] = useState({});
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [showFormPassword, setShowFormPassword] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingUserId, setEditingUserId] = useState(null);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    division: "",
    password: "",
  });

  const users = [
    {
      id: 1,
      fullName: "Salwanetta",
      email: "Salwanetta@gmail.com",
      division: "SoftwareDevelopment",
      password: "password123",
    },
    {
      id: 2,
      fullName: "",
      email: "",
      division: "",
      password: "",
    },
  ];

  const togglePassword = (userId) => {
    setShowPasswords((prev) => ({
      ...prev,
      [userId]: !prev[userId],
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isEditMode) {
      console.log("Edit user:", editingUserId, formData);
      // TODO: Update user in database
    } else {
      console.log("Add new user:", formData);
      // TODO: Add user to database
    }
    // Reset form and close dialog
    setFormData({
      fullName: "",
      email: "",
      division: "",
      password: "",
    });
    setIsDialogOpen(false);
    setIsEditMode(false);
    setEditingUserId(null);
  };

  const handleEdit = (user) => {
    setFormData({
      fullName: user.fullName,
      email: user.email,
      division: user.division,
      password: user.password,
    });
    setEditingUserId(user.id);
    setIsEditMode(true);
    setIsDialogOpen(true);
  };

  const handleDelete = (userId) => {
    if (window.confirm("Are you sure you want to delete this account?")) {
      console.log("Delete user:", userId);
      // TODO: Delete user from database
    }
  };

  const handleAddAccount = () => {
    setFormData({
      fullName: "",
      email: "",
      division: "",
      password: "",
    });
    setIsEditMode(false);
    setEditingUserId(null);
    setIsDialogOpen(true);
  };

  return (
    <div className="admin-container">
      {/* Header */}
      <header className="admin-header">
        <div className="menubar-header">
          <div className="menubar-logo">
            <img src={logoWithText} alt="NebWork" className="menubar-logo-img" />
          </div>
        </div>
      

        <div className="header-right">
          <button className="add-account-btn" onClick={handleAddAccount}>
            Add Account
          </button>
          <div className="user-info">
            <div className="user-details">
              <div className="user-name">Salwanetta</div>
              <div className="user-role">Admin</div>
            </div>
            <div className="user-avatar">S</div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="admin-main">
        <h2 className="page-title">MANAGE USERS</h2>

        <div className="table-wrapper">
          <table className="users-table">
            <thead>
              <tr>
                <th>No.</th>
                <th>Full Name</th>
                <th>Email</th>
                <th>Division</th>
                <th>Password</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.fullName}</td>
                  <td className="email-cell">{user.email}</td>
                  <td>{user.division}</td>
                  <td>
                    <div className="password-cell">
                      <span className="password-text">
                        {showPasswords[user.id] ? user.password : "••••••••"}
                      </span>
                      <button
                        className="toggle-password-btn"
                        onClick={() => togglePassword(user.id)}
                        aria-label={showPasswords[user.id] ? "Hide password" : "Show password"}
                      >
                        {showPasswords[user.id] ? (
                          <EyeOff size={16} />
                        ) : (
                          <Eye size={16} />
                        )}
                      </button>
                    </div>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button
                        className="edit-btn"
                        onClick={() => handleEdit(user)}
                        aria-label="Edit user"
                      >
                        Edit
                      </button>
                      <button
                        className="delete-btn"
                        onClick={() => handleDelete(user.id)}
                        aria-label="Delete user"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>

      {/* Add/Edit Account Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="dialog-content">
          <div className="dialog-form-container">
            <div className="dialog-illustration">
              <FileText className="illustration-icon document" size={120} strokeWidth={1} />
              <Circle className="illustration-icon circle-1" size={60} strokeWidth={1} />
              <Circle className="illustration-icon circle-2" size={80} strokeWidth={1} />
              <div className="illustration-icon phone">
                <div className="phone-screen"></div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="registration-form">
              <div className="form-group">
                <label htmlFor="fullName">Full Name:</label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email:</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="division">Division:</label>
                <input
                  type="text"
                  id="division"
                  name="division"
                  value={formData.division}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="password">Password:</label>
                <div className="password-input-wrapper">
                  <input
                    type={showFormPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                  />
                  <button
                    type="button"
                    className="toggle-form-password-btn"
                    onClick={() => setShowFormPassword(!showFormPassword)}
                    aria-label={showFormPassword ? "Hide password" : "Show password"}
                  >
                    {showFormPassword ? (
                      <EyeOff size={20} />
                    ) : (
                      <Eye size={20} />
                    )}
                  </button>
                </div>
              </div>

              <button type="submit" className="submit-btn">
                {isEditMode ? "Update" : "Registrasi"}
              </button>
            </form>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Admin;