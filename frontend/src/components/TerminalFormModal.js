import React from "react";

const TERMINAL_TYPES = [
  { value: "gaming", label: "Gaming", icon: "fa-gamepad" },
  { value: "academic", label: "Academic", icon: "fa-graduation-cap" },
  { value: "browsing", label: "Browsing", icon: "fa-globe" }
];

const TerminalFormModal = ({ mode, terminal, onSubmit, onClose }) => {
  const isEdit = mode === "edit";
  const title = isEdit ? "Edit Terminal" : "Add New Terminal";
  const submitLabel = isEdit ? "Save Changes" : "Add Terminal";

  return (
    <div className="modal-overlay terminal-modal-overlay" onClick={onClose}>
      <div className="terminal-modal" onClick={(e) => e.stopPropagation()}>
        <div className="terminal-modal-header">
          <div className="terminal-modal-title">
            <span className="terminal-modal-icon">
              <i className={`fas ${isEdit ? "fa-edit" : "fa-plus-circle"}`}></i>
            </span>
            <div>
              <h3>{title}</h3>
              <p>{isEdit ? "Update terminal details and pricing" : "Configure a new terminal for the cafe"}</p>
            </div>
          </div>
          <button type="button" className="terminal-modal-close" onClick={onClose} aria-label="Close">
            <i className="fas fa-times"></i>
          </button>
        </div>

        <form onSubmit={onSubmit} className="terminal-modal-form">
          <div className="terminal-form-grid">
            <div className="form-group">
              <label><i className="fas fa-tag"></i> Terminal Type</label>
              <select name="type" required defaultValue={terminal?.type || "gaming"}>
                {TERMINAL_TYPES.map(({ value, label, icon }) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label><i className="fas fa-desktop"></i> Terminal Name</label>
              <input
                type="text"
                name="name"
                required
                defaultValue={terminal?.name || ""}
                placeholder="e.g., Gaming Terminal 1"
              />
            </div>
          </div>

          <div className="form-group">
            <label><i className="fas fa-microchip"></i> Specifications</label>
            <textarea
              name="specs"
              required
              defaultValue={terminal?.specs || ""}
              placeholder="Processor, RAM, storage, and other specs"
              rows={3}
            />
          </div>

          <div className="form-group">
            <label><i className="fas fa-rupee-sign"></i> Price per Hour (₹)</label>
            <input
              type="number"
              name="price"
              required
              min="1"
              defaultValue={terminal?.price || ""}
              placeholder="e.g., 50"
            />
          </div>

          <div className="terminal-type-preview">
            {TERMINAL_TYPES.map(({ value, label, icon }) => (
              <span key={value} className="type-chip">
                <i className={`fas ${icon}`}></i> {label}
              </span>
            ))}
          </div>

          <div className="terminal-modal-actions">
            <button type="button" className="cancel-button" onClick={onClose}>Cancel</button>
            <button type="submit" className="confirm-button">
              <i className={`fas ${isEdit ? "fa-save" : "fa-plus"}`}></i> {submitLabel}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TerminalFormModal;
