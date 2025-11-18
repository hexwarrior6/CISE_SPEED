import React from "react";
import "../styles/ConfirmDialog.module.scss";

interface ConfirmDialogProps {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  message,
  onConfirm,
  onCancel,
}) => {
  return (
    <div className="confirm-dialog-overlay">
      <div className="confirm-dialog">
        <p>{message}</p>
        <div className="dialog-buttons">
          <button className="btn-cancel" onClick={onCancel}>
            取消
          </button>
          <button className="btn-confirm" onClick={onConfirm}>
            确认
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
