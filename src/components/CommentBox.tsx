import { useEffect, useState } from "react";
import { Input, Button, List, Typography, message } from "antd";
import { CloseCircleOutlined, EditOutlined, CheckOutlined, CloseOutlined } from "@ant-design/icons";
import Swal from "sweetalert2";

const { TextArea } = Input;

type Comment = {
  id: number;
  text: string;
};

const CommentBox = ({ cardKey }: { cardKey: string }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [text, setText] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingText, setEditingText] = useState("");

  useEffect(() => {
    fetch(`/api/comments/${encodeURIComponent(cardKey)}`)
      .then((res) => res.json())
      .then((data) => setComments(data))
      .catch(() => setComments([]));
  }, [cardKey]);

  const addComment = async () => {
    if (!text.trim()) {
      message.warning("Please enter a comment.");
      return;
    }
    try {
      const res = await fetch(`/api/comments/${encodeURIComponent(cardKey)}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      if (!res.ok) throw new Error("Failed to add comment");
      const newComment = await res.json();
      setComments((prev) => [...prev, newComment]);
      setText("");
    } catch {
      message.error("Failed to add comment.");
    }
  };

  const startEdit = (id: number, currentText: string) => {
    setEditingId(id);
    setEditingText(currentText);
  };

  const saveEdit = async (id: number) => {
    if (!editingText.trim()) {
      message.warning("Please enter a comment.");
      return;
    }
    try {
      const res = await fetch(`/api/comments/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: editingText }),
      });
      if (!res.ok) throw new Error("Failed to edit comment");
      setComments((prev) => prev.map((c) => (c.id === id ? { ...c, text: editingText } : c)));
      setEditingId(null);
      setEditingText("");
    } catch {
      message.error("Failed to edit comment.");
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingText("");
  };

  const deleteComment = (id: number) => {
    Swal.fire({
      title: "Delete comment?",
      text: "Are you sure you want to delete this comment?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await fetch(`/api/comments/${id}`, { method: "DELETE" });
          if (!res.ok) throw new Error("Failed to delete comment");
          setComments((prev) => prev.filter((c) => c.id !== id));
          message.success("Comment deleted");
        } catch {
          message.error("Failed to delete comment.");
        }
      }
    });
  };

  return (
    <div style={{ marginTop: 16 }}>
      <List
        style={{
          marginTop: 12,
          minHeight: 167,
          maxHeight: 167,
          overflowY: "auto",
        }}
        className="custom-scrollbar"
        bordered
        dataSource={comments}
        renderItem={(item) => {
          const isEditing = editingId === item.id;
          return (
            <List.Item
              actions={[
                isEditing
                  ? null
                  : <EditOutlined onClick={() => startEdit(item.id, item.text)} key="edit" />,
                <CloseCircleOutlined onClick={() => deleteComment(item.id)} key="delete" />,
              ].filter(Boolean)}
              style={{
                margin: "8px",
                background: "#d2def8",
                borderRadius: 4,
                padding: "8px 12px",
              }}
            >
              {isEditing ? (
                <div className="flex items-center w-full">
                  <Input
                    value={editingText}
                    onChange={(e) => setEditingText(e.target.value)}
                    onPressEnter={() => {
                      if (editingText !== item.text) saveEdit(item.id);
                      else cancelEdit();
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Escape") cancelEdit();
                    }}
                    autoFocus
                  />
                  {editingText !== item.text && (
                    <span style={{ display: "inline-flex", gap: 8, marginLeft: 8, verticalAlign: "middle" }}>
                      <Button
                        type="text"
                        icon={<CheckOutlined style={{ color: "#52c41a", fontSize: 12 }} />}
                        size="small"
                        onClick={() => saveEdit(item.id)}
                        aria-label="Save"
                      />
                      <Button
                        type="text"
                        icon={<CloseOutlined style={{ color: "#ff4d4f", fontSize: 12 }} />}
                        size="small"
                        onClick={cancelEdit}
                        aria-label="Cancel"
                      />
                    </span>
                  )}
                </div>
              ) : (
                <Typography.Text>{item.text}</Typography.Text>
              )}
            </List.Item>
          );
        }}
      />
      <div className="grid grid-flow-col grid-rows-1 gap-2">
        <div className="col-span-2 pt-2">
          <TextArea
            rows={1}
            placeholder="Add comment"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onPressEnter={addComment}
            style={{ width: "100%" }}
          />
        </div>
        <div className="col-span-1 flex items-end w-full justify-end pt-2">
          <Button
            type="primary"
            onClick={addComment}
            disabled={!text.trim()}
            style={{ width: "100%" }}
          >
            Add Comment
          </Button>
        </div>
      </div>
    </div>
  );
}

export default CommentBox;
