import { useState } from "react";
import SqlEditor from "./SqlEditor";
import QueryResults from "./QueryResults";
import TableFilter from "./TableFilter";
import Pagination from "./Pagination";
import QueryHistory from "./QueryHistory";

const sampleData = [

  { id: 1, name: "Harini", dept: "CSE" },
  { id: 2, name: "Rahul", dept: "IT" },
  { id: 3, name: "Anu", dept: "ECE" },
  { id: 4, name: "Karthik", dept: "EEE" },
  { id: 5, name: "Priya", dept: "CSE" },
  { id: 6, name: "Vignesh", dept: "MECH" },
  { id: 7, name: "Sneha", dept: "IT" },
  { id: 8, name: "Arjun", dept: "CIVIL" },
  { id: 9, name: "Divya", dept: "ECE" },
  { id: 10, name: "Suresh", dept: "CSE" },
  { id: 11, name: "Meena", dept: "IT" },
  { id: 12, name: "Ravi", dept: "MECH" },
  { id: 13, name: "Kavya", dept: "EEE" },
  { id: 14, name: "Manoj", dept: "CIVIL" },
  { id: 15, name: "Pooja", dept: "CSE" },
  { id: 16, name: "Ajay", dept: "ECE" },
  { id: 17, name: "Nisha", dept: "IT" },
  { id: 18, name: "Deepak", dept: "MECH" },
  { id: 19, name: "Swathi", dept: "EEE" },
  { id: 20, name: "Kiran", dept: "CSE" }
];


function SqlPage() {
  const [data, setData] = useState(sampleData);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [history, setHistory] = useState([]);

  const handleRun = (query) => {
    setHistory([query, ...history]);
    setData(sampleData); // simulate result
  };

  const filtered = data.filter((row) =>
    row.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ padding: "20px" }}>
      <h2>SQL Dashboard </h2>

      <SqlEditor onRun={handleRun} />
      <TableFilter setSearch={setSearch} />
      <QueryResults data={filtered} />
      <Pagination page={page} setPage={setPage} />
      <QueryHistory history={history} />
    </div>
  );
}

export default SqlPage;