import { useState, useEffect } from "react";
import axios from "axios";

function App() {
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
  }, []);

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
  );
}

export default App;
