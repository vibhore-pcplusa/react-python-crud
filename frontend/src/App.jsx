import { useState, useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { decrement, increment, reset } from "./features/counter/counterSlice";
import {
  createUser,
  deleteUser,
  fetchUsers,
  updateUser,
} from "./features/user/userSlice";

function App() {
  const dispatch = useDispatch();
  const count = useSelector((state) => state.counter.value);
  const { users, status, error, mutationStatus, mutationError } = useSelector(
    (state) => state.user,
  );
  const [newUserName, setNewUserName] = useState("");
  const [newUserEmail, setNewUserEmail] = useState("");
  const [editingUser, setEditingUser] = useState(null);
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState("");
  const [editIndex, setEditIndex] = useState(null);
  const [editText, setEditText] = useState("");
/*
we can do it together 

  const [state, setState] = useState({
  items: [],
  newItem: "",
  editIndex: null,
  editText: ""
});

  updating state
  setState(prev => ({ ...prev, newItem: "hello" }));

  reading state

  state.items
  state.newItem
  state.editIndex
  state.editText

*/
  

  const API = "http://localhost:5000/items";

  // Fetch all items on load
  useEffect(() => {
    axios.get(API).then((res) => setItems(res.data));
    dispatch(fetchUsers());
  }, [dispatch]);

  const addUser = async (event) => {
    event.preventDefault();
    if (!newUserName.trim() || !newUserEmail.trim()) return;

    const result = await dispatch(
      createUser({ name: newUserName, email: newUserEmail }),
    );
    if (createUser.fulfilled.match(result)) {
      setNewUserName("");
      setNewUserEmail("");
    }
  };

  const startUserEdit = (user) => {
    setEditingUser(user);
    setEditName(user.name);
    setEditEmail(user.email);
  };

  const saveUserEdit = async (event) => {
    event.preventDefault();
    const result = await dispatch(
      updateUser({ ...editingUser, name: editName, email: editEmail }),
    );
    if (updateUser.fulfilled.match(result)) setEditingUser(null);
  };

  const fetchItems = async () => {
    const res = await axios.get(API);
    setItems(res.data);
  };

  // Create
  const addItem = async () => {
    if (!newItem) return;
    await axios.post(API, { name: newItem });
    setNewItem("");
    fetchItems();
  };

  // Delete
  const deleteItem = async (index) => {
    await axios.delete(`${API}/${index}`);
    fetchItems();
  };

  // Edit (start editing)
  const startEdit = (index, currentName) => {
    setEditIndex(index);
    setEditText(currentName);
  };

  // Edit (save)
  const saveEdit = async (index) => {
    await axios.put(`${API}/${index}`, { name: editText });
    setEditIndex(null);
    setEditText("");
    fetchItems();
  };

  // Cancel edit
  const cancelEdit = () => {
    setEditIndex(null);
    setEditText("");
  };

  return (
    <>
      <section style={{ maxWidth: 900, margin: "32px auto", padding: 24 }}>
        <h2>Redux Toolkit: two slices in one store</h2>
        <p>state.counter.value: <strong>{count}</strong></p>
        <button onClick={() => dispatch(decrement())}>-</button>
        <button onClick={() => dispatch(increment())}>+</button>
        <button onClick={() => dispatch(reset())}>Reset</button>
        <h3>User slice: create, read, update, delete</h3>
        <p>Example API: JSONPlaceholder (write requests are simulated).</p>
        <button onClick={() => dispatch(fetchUsers())} disabled={status === "loading"}>
          {status === "loading" ? "Loading users..." : "Reload users"}
        </button>
        {status === "failed" && <p role="alert">Could not load users: {error}</p>}
        {mutationStatus === "failed" && (
          <p role="alert">Could not save changes: {mutationError}</p>
        )}

        <form onSubmit={addUser} style={{ margin: "16px 0" }}>
          <input
            value={newUserName}
            onChange={(event) => setNewUserName(event.target.value)}
            placeholder="Name"
            aria-label="New user name"
          />
          <input
            type="email"
            value={newUserEmail}
            onChange={(event) => setNewUserEmail(event.target.value)}
            placeholder="Email"
            aria-label="New user email"
          />
          <button type="submit" disabled={mutationStatus === "loading"}>
            Create user
          </button>
        </form>

        {status === "loading" && users.length === 0 && <p>Loading users...</p>}
        <ul>
          {users.map((user) => (
            <li key={user.localId} style={{ marginBottom: 10 }}>
              {editingUser?.localId === user.localId ? (
                <form onSubmit={saveUserEdit}>
                  <input
                    value={editName}
                    onChange={(event) => setEditName(event.target.value)}
                    aria-label="Edit user name"
                  />
                  <input
                    type="email"
                    value={editEmail}
                    onChange={(event) => setEditEmail(event.target.value)}
                    aria-label="Edit user email"
                  />
                  <button type="submit" disabled={mutationStatus === "loading"}>
                    Save
                  </button>
                  <button type="button" onClick={() => setEditingUser(null)}>
                    Cancel
                  </button>
                </form>
              ) : (
                <>
                  {user.name} ({user.email})
                  <button onClick={() => startUserEdit(user)}>Edit</button>
                  <button
                    onClick={() => dispatch(deleteUser(user))}
                    disabled={mutationStatus === "loading"}
                  >
                    Delete
                  </button>
                </>
              )}
            </li>
          ))}
        </ul>
      </section>

      <div style={{ padding: 20, maxWidth: 500, margin: "auto" }}>
        <h2>React + Flask CRUD</h2>

        <div style={{ marginBottom: 20 }}>
          <input style={{fontSize: 20}}
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            placeholder="Enter item"
          />
          <button onClick={addItem} style={{ marginLeft: 10 }}>
            Add
          </button>
        </div>

        <ul style={{ listStyle: "none", padding: 0 }}>
          {items.map((item, i) => (
            <li
              key={i}
              style={{
                marginBottom: 10,
                borderBottom: "1px solid #ccc",
                paddingBottom: 5,
              }}
            >
              {editIndex === i ? (
                <>
                  <input
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                  />
                  <button onClick={() => saveEdit(i)} style={{ marginLeft: 5 }}>
                    Save
                  </button>
                  <button onClick={cancelEdit} style={{ marginLeft: 5 }}>
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  {item.name}
                  <button
                    onClick={() => startEdit(i, item.name)}
                    style={{ marginLeft: 10 }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteItem(i)}
                    style={{ marginLeft: 5, color: "red" }}
                  >
                    Delete
                  </button>
                </>
              )}
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

export default App;
