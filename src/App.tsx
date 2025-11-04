import { ResponsiveContainer } from "recharts";
import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { supabase } from "./supabaseClient";
import "./App.css";

const COLORS = ["#00d084", "#00b4d8", "#90e0ef", "#caf0f8", "#0077b6"];

const defaultDuration = [
  { name: "Call 1", duration: 15 },
  { name: "Call 2", duration: 25 },
  { name: "Call 3", duration: 40 },
  { name: "Call 4", duration: 30 },
];

const defaultSadPath = [
  { issue: "User refused ID", value: 20 },
  { issue: "Caller identification", value: 35 },
  { issue: "Unsupported Language", value: 25 },
  { issue: "Hostility", value: 15 },
  { issue: "Other", value: 5 },
];

const App: React.FC = () => {
  const [email, setEmail] = useState("");
  const [showPrompt, setShowPrompt] = useState(true);
  const [callData, setCallData] = useState(defaultDuration);
  const [sadPathData, setSadPathData] = useState(defaultSadPath);
  const [previousData, setPreviousData] = useState<any>(null);
  const [showJson, setShowJson] = useState(false);

  // Fetch user data from Supabase
  const fetchUserData = async (email: string) => {
    const { data, error } = await supabase
      .from("call_data")
      .select("chart_values")
      .eq("email", email)
      .single();

    if (error) {
      console.error("⚠️ Error fetching user data:", error);
      return;
    }

    if (data?.chart_values) {
      setPreviousData(data.chart_values);
      setCallData(data.chart_values.callData || defaultDuration);
      setSadPathData(data.chart_values.sadPathData || defaultSadPath);
    }
  };

  // Save or update data
  const saveUserData = async () => {
    if (!email) {
      alert("Please enter your email first!");
      return;
    }

    try {
      const { data: existing } = await supabase
        .from("call_data")
        .select("*")
        .eq("email", email)
        .limit(1)
        .single();

      const chartValues = { callData, sadPathData };

      if (existing) {
        const confirmOverwrite = window.confirm(
          "Previous data found. Do you want to overwrite it?"
        );
        if (!confirmOverwrite) return;

        const { error: updateError } = await supabase
          .from("call_data")
          .update({ chart_values: chartValues })
          .eq("email", email);

        if (updateError) throw updateError;
        alert("✅ Data updated successfully!");
      } else {
        const { error: insertError } = await supabase
          .from("call_data")
          .insert([{ email, chart_values: chartValues }]);

        if (insertError) throw insertError;
        alert("✅ Data saved successfully!");
      }
    } catch (err: any) {
      alert("❌ Save failed: " + err.message);
    }

    fetchUserData(email);
  };

  useEffect(() => {
    if (email) fetchUserData(email);
  }, [email]);

  // 👇 FIXED: Deep copy ensures React re-renders chart instantly
  const handleDurationChange = (index: number, value: number) => {
  setCallData((prevData) => {
    const updated = prevData.map((item, i) =>
      i === index ? { ...item, duration: Number(value) } : item
    );

    // 🧠 Recalculate Sad Path Pie chart dynamically
    const totalDuration = updated.reduce((sum, d) => sum + d.duration, 0);

    const newSadPathData = [
      { issue: "User refused ID", value: Math.round((updated[0].duration / totalDuration) * 100) || 0 },
      { issue: "Caller identification", value: Math.round((updated[1].duration / totalDuration) * 100) || 0 },
      { issue: "Unsupported Language", value: Math.round((updated[2].duration / totalDuration) * 100) || 0 },
      { issue: "Hostility", value: Math.round((updated[3].duration / totalDuration) * 100) || 0 },
      { issue: "Other", value: Math.max(0, 100 -
        (Math.round((updated[0].duration / totalDuration) * 100) +
         Math.round((updated[1].duration / totalDuration) * 100) +
         Math.round((updated[2].duration / totalDuration) * 100) +
         Math.round((updated[3].duration / totalDuration) * 100))
      ) },
    ];

    setSadPathData(newSadPathData);
    return updated;
  });
};

  return (
    <div
      className="main"
      style={{
        background: "linear-gradient(180deg, #0b0b0b 0%, #111 100%)",
        color: "#fff",
        minHeight: "100vh",
        fontFamily: "'Inter', sans-serif",
      }}
    >
      <nav
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          background: "rgba(15,15,15,0.95)",
          borderBottom: "1px solid #222",
          padding: "15px 60px",
          position: "sticky",
          top: 0,
          zIndex: 5,
        }}
      >
        <h2 style={{ color: "#00ffae", fontWeight: 700 }}>SuperBryn Analytics</h2>
        <div>
          <a href="#" style={{ color: "#ccc", marginRight: "20px" }}>Home</a>
          <a href="#" style={{ color: "#ccc" }}>About</a>
        </div>
      </nav>

      {showPrompt ? (
        <div
          className="email-box"
          style={{
            textAlign: "center",
            background: "#1a1a1a",
            padding: "30px",
            borderRadius: "10px",
            width: "400px",
            margin: "auto",
            marginTop: "100px",
          }}
        >
          <h3>Enter your email to continue:</h3>
          <input
            type="email"
            value={email}
            placeholder="example@email.com"
            onChange={(e) => setEmail(e.target.value)}
            style={{
              marginTop: "10px",
              padding: "10px",
              width: "90%",
              borderRadius: "6px",
              border: "1px solid #444",
              background: "#0e0e0e",
              color: "#fff",
            }}
          />
          <button
            onClick={() => setShowPrompt(false)}
            style={{
              marginTop: "15px",
              backgroundColor: "#00ffae",
              color: "#000",
              padding: "10px 20px",
              borderRadius: "8px",
              border: "none",
              cursor: "pointer",
              fontWeight: 600,
            }}
          >
            Continue
          </button>
        </div>
      ) : (
        <>
          <section style={{ textAlign: "center", marginTop: "50px" }}>
  <h2 style={{ color: "#00ffae", marginBottom: "20px" }}>
    📊 Call Duration Analysis
  </h2>

  <div style={{ width: "100%", height: 300, display: "flex", justifyContent: "center" }}>
    <LineChart width={600} height={300} data={callData}>
      <CartesianGrid strokeDasharray="3 3" stroke="#333" />
      <XAxis dataKey="name" stroke="#aaa" />
      {/* ✅ Automatically scales when user enters larger values */}
      <YAxis stroke="#aaa" domain={[0, "dataMax + 20"]} />
      <Tooltip />
      <Line
        type="monotone"
        dataKey="duration"
        stroke="#00ffae"
        strokeWidth={2}
        dot={{ r: 5 }}
        activeDot={{ r: 8 }}
      />
    </LineChart>
  </div>

  <div className="input-section" style={{ marginTop: "20px" }}>
    {callData.map((d, i) => (
      <div key={i}>
        {d.name}:{" "}
        <input
          type="number"
          value={d.duration}
          onChange={(e) => handleDurationChange(i, Number(e.target.value))}
          style={{
            background: "#111",
            color: "#00ffae",
            border: "1px solid #00ffae",
            borderRadius: "5px",
            padding: "5px 10px",
            marginBottom: "5px",
            width: "80px",
            textAlign: "center",
          }}
        />{" "}
        min
      </div>
    ))}
  </div>
</section>


          

         <section style={{ textAlign: "center", marginTop: "60px" }}>
  <h2 style={{ color: "#00ffae", marginBottom: "20px" }}>
    📉 Sad Path Analysis
  </h2>

  <div
    style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      overflowX: "auto",
      width: "100%",
    }}
  >
    <ResponsiveContainer width="80%" height={420}>
      <PieChart>
        <defs>
          <linearGradient id="pieGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#00ffae" />
            <stop offset="100%" stopColor="#0077b6" />
          </linearGradient>
        </defs>

        <Pie
          data={sadPathData}
          dataKey="value"
          nameKey="issue"
          cx="50%"
          cy="50%"
          innerRadius="40%"
          outerRadius="60%"
          paddingAngle={4}
          stroke="#0a0a0a"
          strokeWidth={2}
          labelLine={false}
          label={(entry: any) => {
            const name = entry.name ?? "";
            const percent = typeof entry.percent === "number" ? entry.percent : 0;
            return `${name} (${(percent * 100).toFixed(0)}%)`;
          }}
        >
          {sadPathData.map((_, index) => (
            <Cell key={`cell-${index}`} fill="url(#pieGradient)" opacity={0.9} />
          ))}
        </Pie>

        <Tooltip
  contentStyle={{
    background: "rgba(0, 20, 30, 0.95)",
    border: "1px solid #00ffae",
    borderRadius: "10px",
    color: "#e6f9f5",
    fontSize: "0.9rem",
    padding: "10px 15px",
    boxShadow: "0 4px 10px rgba(0, 255, 174, 0.2)",
  }}
  itemStyle={{
    color: "#00ffae",
    fontWeight: 500,
  }}
  labelStyle={{
    color: "#fff",
    fontWeight: 600,
    marginBottom: "5px",
  }}
/>

        
      </PieChart>
    </ResponsiveContainer>
  </div>
</section>





          <div style={{ textAlign: "center", marginTop: "20px" }}>
            <button
              onClick={saveUserData}
              style={{
                backgroundColor: "#00ffae",
                color: "#000",
                padding: "12px 25px",
                borderRadius: "8px",
                fontWeight: 600,
                border: "none",
                cursor: "pointer",
              }}
            >
              💾 Save My Data
            </button>
          </div>

          {previousData && (
            <div
              className="prev"
              style={{
                marginTop: "30px",
                textAlign: "center",
                backgroundColor: "#0a0a0a",
                border: "1px solid #00d084",
                borderRadius: "10px",
                padding: "15px",
                maxWidth: "600px",
                marginInline: "auto",
              }}
            >
              <h4 style={{ color: "#00d084" }}>📁 Previous Saved Data Found</h4>
              <p style={{ color: "#ccc" }}>
                You previously saved{" "}
                <strong>{previousData.callData.length}</strong> calls and{" "}
                <strong>{previousData.sadPathData.length}</strong> issue types.
              </p>

              <button
                onClick={() => setShowJson((prev) => !prev)}
                style={{
                  backgroundColor: "#00d084",
                  color: "#000",
                  padding: "8px 14px",
                  borderRadius: "8px",
                  border: "none",
                  cursor: "pointer",
                  marginTop: "10px",
                  fontWeight: "bold",
                }}
              >
                {showJson ? "Hide Details" : "Show Details"}
              </button>

              {showJson && (
                <pre
                  style={{
                    textAlign: "left",
                    backgroundColor: "#111",
                    color: "#00ffcc",
                    padding: "15px",
                    borderRadius: "10px",
                    marginTop: "15px",
                    overflowX: "auto",
                  }}
                >
                  {JSON.stringify(previousData, null, 2)}
                </pre>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default App;



