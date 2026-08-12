import React from "react";
import {
  ChevronRight, User, Fingerprint, Lock, Bell, HelpCircle, Building2,
  Settings, LogOut,
} from "lucide-react";
import { useApp } from "../context/AppContext";
import { useTheme } from "../theme";
import { Screen } from "../components/UI";

// NOTE: this design uses 'Roboto Condensed'. If it isn't already loaded in
// your project, add this to your index.html <head> (or global CSS):
// <link href="https://fonts.googleapis.com/css2?family=Roboto+Condensed:wght@400;600&display=swap" rel="stylesheet" />
const FONT = "'Roboto Condensed', sans-serif";
const GREEN = "#0F9841";
const RED = "#FF383C";
const DIVIDER = "rgba(0,0,0,0.45)";

// Hides the scrollbar (Chrome/Safari/Edge + Firefox + IE) while keeping
// scroll behavior intact. Scoped to this screen's scroll container plus a
// couple of common wrapper patterns so it works regardless of how <Screen>
// implements scrolling internally.
function HideScrollbarStyle() {
  return (
    <style>{`
      /* Applied globally (not just to descendants of .profile-screen) so it
         also covers ancestor scroll containers like <Screen>'s own wrapper,
         and works the same on mobile viewports, tablets, and desktop. */
      html, body, #root, #__next,
      .profile-screen,
      .profile-screen * {
        scrollbar-width: none !important;    /* Firefox, all breakpoints */
        -ms-overflow-style: none !important; /* old Edge / IE */
      }
      html::-webkit-scrollbar, body::-webkit-scrollbar,
      #root::-webkit-scrollbar, #__next::-webkit-scrollbar,
      .profile-screen::-webkit-scrollbar,
      .profile-screen *::-webkit-scrollbar,
      *::-webkit-scrollbar {
        display: none !important;   /* Chrome, Safari, new Edge, mobile webviews */
        width: 0 !important;
        height: 0 !important;
      }
    `}</style>
  );
}

function Row({ r, showBorder, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 20,
        padding: "10px",
        borderBottom: showBorder ? `1px solid ${DIVIDER}` : "none",
        cursor: "pointer",
      }}
    >
      <r.icon size={22} color="#000" strokeWidth={1.6} />
      <span
        style={{
          flex: 1,
          fontFamily: FONT,
          fontWeight: 400,
          fontSize: 20,
          lineHeight: "24px",
          color: "#000",
        }}
      >
        {r.l}
      </span>
      <ChevronRight size={16} color="#000" />
    </div>
  );
}

export default function Profile() {
  const ctx = useApp();
  useTheme(); // kept for provider/context parity with the rest of the app
  const { name, lastName, profileEmail, navigate, goToTab, showToast } = ctx;
  const fullName = [name, lastName].filter(Boolean).join(" ");

  const accountRows = [
    { l: "Personal Information", icon: User, go: "personalInfo" },
    { l: "Bank Accounts", icon: Building2 },
    { l: "Preferences", icon: Settings },
  ];

  const securityRowsTop = [
    { l: "Biometric Login", icon: Fingerprint },
    { l: "Two-factor Authentication", icon: Lock },
  ];

  const securityRowsBottom = [
    { l: "Notification Settings", icon: Bell, go: "notifications" },
    { l: "Help & support", icon: HelpCircle },
  ];

  const handleRow = (r) =>
    r.go ? navigate(r.go) : showToast(`${r.l} isn't available in this demo yet.`);

  return (
    <Screen nav active="profile" onNavigate={goToTab}>
      <div className="profile-screen">
      <HideScrollbarStyle />
      {/* Green header card with growth illustration */}
      <div
        onClick={() => navigate("personalInfo")}
        style={{
         width: "91%", borderRadius: 2, padding: 22, minHeight: 220, marginTop: 2, backgroundImage: "url(/images/visa-card-bg.jpg)", backgroundSize: "cover", backgroundPosition: "center", position: "relative", overflow: "hidden", boxShadow: "0 16px 30px -12px rgba(12,122,56,0.45)"
        }}
      >
        
          <User style={{
                margin: "50px 1px 0",
                transform: "scaleX(1.3)",
                transformOrigin: "center",
                position: "absolute",
              }} size={40} color="#fff" strokeWidth={1.2} />
          <div style={{ flex: 1 }}>
            <div
              style={{
                fontFamily: FONT,
                color: "#fff",
                fontWeight: 600,
                fontSize: 26,
                lineHeight: "30px",
                letterSpacing: "-0.02em",
                margin: "50px 100px 0"
              }}
            >
              {fullName}
            </div>
            <div
              style={{
                fontFamily: FONT,
                color: "rgba(255,255,255,0.9)",
                fontSize: 15,
                margin: "5px 100px 0"
              }}
            >
              {profileEmail}

              
            </div>
                        
          </div>
          <ChevronRight 
          style={{
                margin: "-40px 350px 90px",
                transform: "scaleX(1.3)",
                transformOrigin: "center",
                position: "absolute",
                left: 20,
              }} 
          color="#fff" size={20} />
        </div>
      

      {/* White sheet, overlapping the header like the reference */}
      <div
        style={{
          background: "#fff",
          borderRadius: "20px 20px 0 0",
          margin: "-70px 3.5px 0",
          position: "relative",
          padding: "20px 10px 0",
          width: "95%"
        }}
      >
        <h4
          style={{
            fontFamily: FONT,
            color: "#000",
            fontSize: 23,
            fontWeight: 600,
            lineHeight: "28px",
            letterSpacing: "-0.02em",
            margin: "0 0 8px",
          }}
        >
          Account
        </h4>
        <div style={{ marginBottom: 24 }}>
          {accountRows.map((r, i) => (
            <Row key={r.l} r={r} showBorder={i < accountRows.length - 1} onClick={() => handleRow(r)} />
          ))}
        </div>

        <div style={{ borderTop: `1px solid ${DIVIDER}`, marginBottom: 20 }} />

        <h4
          style={{
            fontFamily: FONT,
            color: "#000",
            fontSize: 22,
            fontWeight: 600,
            lineHeight: "28px",
            letterSpacing: "-0.01em",
            margin: "0 10px 8px",
          }}
        >
          Security
        </h4>
        <div>
          {securityRowsTop.map((r, i) => (
            <Row key={r.l} r={r} showBorder={i < securityRowsTop.length - 1} onClick={() => handleRow(r)} />
          ))}
        </div>

        <div style={{ borderTop: `1px solid ${DIVIDER}`, margin: "20px 0" }} />

        <div>
          {securityRowsBottom.map((r, i) => (
            <Row key={r.l} r={r} showBorder={i < securityRowsBottom.length - 1} onClick={() => handleRow(r)} />
          ))}
        </div>

        <div style={{ borderTop: `1px solid ${DIVIDER}`, margin: "20px 0" }} />

        <div
          onClick={() => goToTab("login")}
          style={{ display: "flex", alignItems: "center", gap: 20, padding: "10px", cursor: "pointer" }}
        >
          <LogOut size={22} color={RED} strokeWidth={1.6} />
          <span
            style={{
              fontFamily: FONT,
              fontWeight: 400,
              fontSize: 20,
              lineHeight: "24px",
              color: RED,
            }}
          >
            Logout
          </span>
        </div>
      </div>
      </div>
    </Screen>
  );
}