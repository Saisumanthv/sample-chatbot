import React from 'react';
import ConfirmDialog from '../common/ConfirmDialog.jsx';

export default function DeleteDialog({
  isOpen,
  conversationTitle = 'this conversation',
  isLoading = false,
  onConfirm,
  onCancel
}) {
  return (
    <ConfirmDialog
      isOpen={isOpen}
      title="Delete Conversation"
      message={`Are you sure you want to delete "${conversationTitle}"? All messages in this conversation will be permanently removed. This action cannot be undone.`}
      confirmText="Delete Conversation"
      cancelText="Cancel"
      isDanger={true}
      isLoading={isLoading}
      onConfirm={onConfirm}
      onCancel={onCancel}
    />
  );
}

