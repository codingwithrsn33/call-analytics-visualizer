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
    console.log("🔍 Fetching data for:", email);
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
      console.log("✅ Found previous data:", data.chart_values);
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
      const { data: existing, error: fetchError } = await supabase
        .from("call_data")
        .select("*")
        .eq("email", email)
        .limit(1)
        .single();

      if (fetchError && fetchError.code !== "PGRST116") {
        console.error("Fetch error:", fetchError);
        alert("❌ Error checking user record: " + fetchError.message);
        return;
      }

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
      console.error("Save failed:", err);
      alert("❌ Save failed: " + err.message);
    }

    fetchUserData(email);
  };

  useEffect(() => {
    if (email) fetchUserData(email);
  }, [email]);

  const handleDurationChange = (index: number, value: number) => {
    const updated = [...callData];
    updated[index].duration = value;
    setCallData(updated);
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
      {/* ✅ Navbar like Superbryn */}
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
          <a
            href="#"
            style={{
              color: "#ccc",
              marginRight: "20px",
              textDecoration: "none",
            }}
          >
            Home
          </a>
          <a href="#" style={{ color: "#ccc", textDecoration: "none" }}>
            About
          </a>
        </div>
      </nav>

      {/* ✅ Hero section */}
      <section
        style={{
          textAlign: "center",
          marginTop: "60px",
          marginBottom: "50px",
        }}
      >
        <h1
          style={{
            fontSize: "2.4rem",
            color: "#fff",
            fontWeight: 700,
            textShadow: "0 0 10px rgba(0,255,174,0.8)",
          }}
        >
          Helping Teams Scale{" "}
          <span style={{ color: "#00ffae" }}>Voice AI</span>
        </h1>
        <p style={{ color: "#aaa", fontSize: "1.1rem" }}>
          Visualize and track your voice agent analytics effortlessly.
        </p>
        <button
          style={{
            marginTop: "20px",
            backgroundColor: "#00ffae",
            color: "#000",
            border: "none",
            padding: "10px 25px",
            borderRadius: "8px",
            fontWeight: 600,
            cursor: "pointer",
          }}
          onClick={() => window.scrollTo({ top: 500, behavior: "smooth" })}
        >
          Get Started
        </button>
      </section>

      {/* ✅ Email prompt */}
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
          {/* ✅ Charts */}
          <section style={{ textAlign: "center", marginTop: "30px" }}>
            <h2>📊 Call Duration Analysis</h2>
            <LineChart width={600} height={300} data={callData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="name" stroke="#aaa" />
              <YAxis stroke="#aaa" />
              <Tooltip />
              <Line type="monotone" dataKey="duration" stroke="#00ffae" />
            </LineChart>

            <div className="input-section" style={{ marginTop: "20px" }}>
              {callData.map((d, i) => (
                <div key={i}>
                  {d.name}:{" "}
                  <input
                    type="number"
                    value={d.duration}
                    onChange={(e) =>
                      handleDurationChange(i, Number(e.target.value))
                    }
                  />{" "}
                  min
                </div>
              ))}
            </div>
          </section>

          <section style={{ textAlign: "center", marginTop: "40px" }}>
            <h2>📉 Sad Path Analysis</h2>
            <PieChart width={400} height={300}>
              <Pie
                data={sadPathData}
                dataKey="value"
                nameKey="issue"
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#00ffae"
                label
              >
                {sadPathData.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
            </PieChart>
          </section>

          <div style={{ textAlign: "center", marginTop: "20px" }}>
            <button
              className="save-btn"
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

          {/* ✅ Expandable Previous Data */}
          {previousData && previousData.callData && previousData.sadPathData && (
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
                boxShadow: "0 0 10px rgba(0, 208, 132, 0.3)",
              }}
            >
              <h4 style={{ color: "#00d084", marginBottom: "10px" }}>
                📁 Previous Saved Data Found
              </h4>
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
                    fontSize: "0.9rem",
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
