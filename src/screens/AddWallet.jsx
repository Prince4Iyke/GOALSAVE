import React from "react";
import { Wallet } from "lucide-react";
import { useApp } from "../context/AppContext";
import { useTheme } from "../theme";
import { BackHeader, Screen } from "../components/UI";

const GREEN = "#14AD4C";
const FONT = "'Roboto Condensed', sans-serif";

export default function AddWallet() {
  const ctx = useApp();
  const C = useTheme();
  const { goBack, goToTab, newWalletName, setNewWalletName, walletFormError, handleCreateWallet, apiBusy } = ctx;

  return (
    <Screen nav active="dashboard" onNavigate={goToTab}>
      <BackHeader title="Add Wallet" onBack={goBack} />

      <h4 style={{ fontFamily: FONT, color: "#000", fontSize: 23, fontWeight: 600, letterSpacing: "-0.02em", marginBottom: 8 }}>
        Wallet name
      </h4>
      <input
        value={newWalletName}
        onChange={(e) => setNewWalletName(e.target.value)}
        placeholder="e.g Main wallet"
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
          marginBottom: 8,
        }}
      />
      {walletFormError && (
        <div style={{ fontFamily: FONT, color: "#D64545", fontSize: 14, marginBottom: 12 }}>{walletFormError}</div>
      )}

      <div style={{ height: 8 }} />

      <button
        onClick={handleCreateWallet}
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
        <Wallet size={20} color="#fff" />
        <span style={{ fontFamily: FONT, color: "#fff", fontWeight: 600, fontSize: 24, letterSpacing: "-0.02em" }}>
          {apiBusy ? "Saving..." : "Save Wallet"}
        </span>
      </button>
    </Screen>
  );
}
