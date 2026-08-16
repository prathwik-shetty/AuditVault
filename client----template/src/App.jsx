import { useEffect, useState } from "react";
import Login from "./Login";
import { auth } from "../firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";

const API_BASE_URL = "https://auditvault-3ytx.onrender.com";
const API_URL = `${API_BASE_URL}/api/memos`;

function App() {
  const [user, setUser] = useState(null);
  const [memos, setMemos] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedMemo, setSelectedMemo] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [auditLogs, setAuditLogs] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    return onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
  }, []);

  const getToken = async () => {
    if (!auth.currentUser) return null;
    return await auth.currentUser.getIdToken();
  };

  const loadMemos = async () => {
    try {
      const token = await getToken();

      const response = await fetch(API_URL, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to load memos");
      }

      setMemos(data);
    } catch (error) {
      setMessage(error.message);
    }
  };

  useEffect(() => {
    if (user) {
      loadMemos();
    }
  }, [user]);

  const saveMemo = async (e) => {
    e.preventDefault();

    if (!title.trim() || !content.trim()) {
      setMessage("Title and content are required.");
      return;
    }

    setLoading(true);

    try {
      const token = await getToken();

      const url = editingId
        ? `${API_URL}/${editingId}`
        : API_URL;

      const response = await fetch(url, {
        method: editingId ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title,
          content,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to save memo");
      }

      setTitle("");
      setContent("");
      setEditingId(null);
      setMessage(
        editingId
          ? "Memo updated successfully."
          : "Memo created successfully."
      );

      await loadMemos();
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  const viewMemo = async (memo) => {
    try {
      const token = await getToken();

      const response = await fetch(`${API_URL}/${memo._id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to view memo");
      }

      setSelectedMemo(data);
    } catch (error) {
      setMessage(error.message);
    }
  };

  const editMemo = (memo) => {
    setEditingId(memo._id);
    setTitle(memo.title);
    setContent(memo.content);
    setSelectedMemo(null);
  };

  const deleteMemo = async (id) => {
    if (!window.confirm("Delete this memo permanently?")) {
      return;
    }

    try {
      const token = await getToken();

      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete memo");
      }

      setSelectedMemo(null);
      setMessage("Memo deleted successfully.");
      await loadMemos();
    } catch (error) {
      setMessage(error.message);
    }
  };

  const loadAuditLogs = async (memoId) => {
    try {
      const token = await getToken();

     const response = await fetch(
  `${API_BASE_URL}/api/auditlogs/${memoId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to load audit trail");
      }

      setAuditLogs(data);
    } catch (error) {
      setMessage(error.message);
    }
  };

  const logout = async () => {
    await signOut(auth);
    setUser(null);
  };

  if (!user) {
    return <Login onLogin={setUser} />;
  }

  return (
    <div className="app">
      <header>
        <div>
          <h1>AuditVault</h1>
          <p>Secure Document Management</p>
        </div>

        <div>
          <span>{user.email}</span>
          <button onClick={logout}>Logout</button>
        </div>
      </header>

      <main>
        <section>
          <h2>{editingId ? "Edit Memo" : "Create Secure Memo"}</h2>

          <form onSubmit={saveMemo}>
            <input
              type="text"
              placeholder="Memo title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            <textarea
              placeholder="Write sensitive memo content..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows="8"
            />

            <button type="submit" disabled={loading}>
              {loading
                ? "Saving..."
                : editingId
                ? "Update Memo"
                : "Create Memo"}
            </button>

            {editingId && (
              <button
                type="button"
                onClick={() => {
                  setEditingId(null);
                  setTitle("");
                  setContent("");
                }}
              >
                Cancel
              </button>
            )}
          </form>

          {message && <p>{message}</p>}
        </section>

        <section>
          <h2>Your Memos</h2>

          {memos.length === 0 ? (
            <p>No memos yet. Create your first secure memo.</p>
          ) : (
            memos.map((memo) => (
              <article key={memo._id}>
                <h3>{memo.title}</h3>

                <p>
                  Created:{" "}
                  {new Date(memo.createdAt).toLocaleString()}
                </p>

                <button onClick={() => viewMemo(memo)}>
                  View
                </button>

                <button onClick={() => editMemo(memo)}>
                  Edit
                </button>

                <button onClick={() => loadAuditLogs(memo._id)}>
                  Audit Trail
                </button>

                <button onClick={() => deleteMemo(memo._id)}>
                  Delete
                </button>
              </article>
            ))
          )}
        </section>

        {selectedMemo && (
          <section>
            <h2>Memo Details</h2>

            <h3>{selectedMemo.title}</h3>

            <p>{selectedMemo.content}</p>

            <p>
              Created:{" "}
              {new Date(selectedMemo.createdAt).toLocaleString()}
            </p>

            <p>
              Updated:{" "}
              {new Date(selectedMemo.updatedAt).toLocaleString()}
            </p>
          </section>
        )}

        {auditLogs.length > 0 && (
          <section>
            <h2>Audit Trail</h2>

            {auditLogs.map((log) => (
              <article key={log._id}>
                <strong>{log.actionType}</strong>

                <p>
                  User: {log.userId}
                </p>

                <p>
                  Time:{" "}
                  {new Date(log.timestamp).toLocaleString()}
                </p>

                <p>IP: {log.ipAddress}</p>
              </article>
            ))}
          </section>
        )}
      </main>
    </div>
  );
}

export default App;