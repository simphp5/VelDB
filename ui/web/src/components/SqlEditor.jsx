import { useState } from "react";

function SqlEditor({ onRun }) {
  const [query, setQuery] = useState("");

  return (
    <div style={{ marginBottom: "20px" }}>
      <h3>SQL Editor</h3>

      <textarea
        rows="5"
        style={{ width: "100%" }}
        placeholder="SELECT * FROM users"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      <button onClick={() => onRun(query)}>Run Query</button>
    </div>
  );
}

export default SqlEditor;