import React from "react";
import { Folder } from "lucide-react";
import { useApp } from "../context/AppContext";
import { useTheme } from "../theme";
import { BackHeader, Screen } from "../components/UI";

const GREEN = "#14AD4C";
const NAVY = "#070540";
const FONT = "'Roboto Condensed', sans-serif";

export default function AddCategory() {
  const ctx = useApp();
  const C = useTheme();
  const {
    goBack, goToTab,
    newCategoryName, setNewCategoryName,
    newCategoryType, setNewCategoryType,
    categoryFormError, setCategoryFormError, handleCreateCategory, apiBusy,
  } = ctx;

  return (
    <Screen nav active="dashboard" onNavigate={goToTab}>
      <BackHeader title="Add Category" onBack={goBack} />

      <h4 style={{ fontFamily: FONT, color: "#000", fontSize: 23, fontWeight: 600, letterSpacing: "-0.02em", marginBottom: 8 }}>
        Category name
      </h4>
      <input
        value={newCategoryName}
        onChange={(e) => {
          setNewCategoryName(e.target.value);
          if (categoryFormError) setCategoryFormError("");
        }}
        placeholder="e.g Food"
        style={{
          boxSizing: "border-box",
          width: "100%",
          border: "2px solid rgba(204,204,204,0.4)",
          borderRadius: 10,
          padding: "14px 15px",
          fontFamily: FONT,
          fontWeight: 400,
          fontSize: 20,
          color: "#000",
          marginBottom: 18,
        }}
      />

      <h4 style={{ fontFamily: FONT, color: "#000", fontSize: 23, fontWeight: 600, letterSpacing: "-0.02em", marginBottom: 8 }}>
        Type
      </h4>
      <div style={{ display: "flex", gap: 10, marginBottom: 8 }}>
        {["Expense", "Income"].map((t) => (
          <button
            key={t}
            onClick={() => {
              setNewCategoryType(t);
              if (categoryFormError) setCategoryFormError("");
            }}
            style={{
              flex: 1,
              padding: "12px",
              borderRadius: 10,
              border: `1px solid ${NAVY}`,
              background: newCategoryType === t ? NAVY : "#fff",
              color: newCategoryType === t ? "#fff" : "#000",
              fontFamily: FONT,
              fontWeight: 600,
              fontSize: 16,
              letterSpacing: "-0.02em",
              cursor: "pointer",
            }}
          >
            {t}
          </button>
        ))}
      </div>
      {categoryFormError && (
        <div style={{ fontFamily: FONT, color: "#D64545", fontSize: 14, marginBottom: 12 }}>{categoryFormError}</div>
      )}

      <div style={{ height: 8 }} />

      <button
        onClick={handleCreateCategory}
        disabled={apiBusy}
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 10,
          width: "100%",
          padding: "0 15px",
          height: 60,
          background: GREEN,
          borderRadius: 20,
          border: "none",
          cursor: apiBusy ? "default" : "pointer",
          opacity: apiBusy ? 0.7 : 1,
        }}
      >
        <Folder size={20} color="#fff" />
        <span style={{ fontFamily: FONT, color: "#fff", fontWeight: 600, fontSize: 24, letterSpacing: "-0.02em" }}>
          {apiBusy ? "Saving..." : "Save Category"}
        </span>
      </button>
    </Screen>
  );
}
