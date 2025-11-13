import { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState("");

  const API = "http://localhost:5000/items";

  useEffect(() => {
    axios.get(API).then((res) => setItems(res.data));
  }, []);

  const addItem = async () => {
    if (!newItem) return;
    await axios.post(API, { name: newItem });
    setNewItem("");
    const res = await axios.get(API);
    setItems(res.data);
  };

  const deleteItem = async (index) => {
    await axios.delete(`${API}/${index}`);
    const res = await axios.get(API);
    setItems(res.data);
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>React + Flask CRUD</h2>
      <input
        value={newItem}
        onChange={(e) => setNewItem(e.target.value)}
        placeholder="Enter item"
      />
      <button onClick={addItem}>Add</button>
      <ul>
        {items.map((item, i) => (
          <li key={i}>
            {item.name}{" "}
            <button onClick={() => deleteItem(i)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
