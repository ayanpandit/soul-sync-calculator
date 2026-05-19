import { useState, useRef } from "react";

// ── Asset imports (all from assets folder) ──────────────────────────────────
import omSymbol from "./assets/om.png";
import kalash from "./assets/kalash.png";
import numerologyImg from "./assets/Numerology Symbols.jpg";
import planetaryImg from "./assets/Planetary Influences.jpg";
import sageBhriguImg from "./assets/Sage Bhrigu.jpg";
import relationshipTypesImg from "./assets/Relationship Types.jpg";
import nameEnergyImg from "./assets/Name Energy.jpg";
import relationshipsImg from "./assets/relationships.jpg";
import ancientAstrologersImg from "./assets/Collection of ancient Indian astrologers.jpg";
import ancientSagesImg from "./assets/Ancient Sages.jpg";
import ancientTextsImg from "./assets/Ancient Texts.jpg";
import destinyAudio from "./assets/sahani.mp3";

// ── Data ────────────────────────────────────────────────────────────────────
const letterValues = {};
for (let i = 0; i < 26; i++) letterValues[String.fromCharCode(65 + i)] = i + 1;

const planetRulerships = {
  A: "Sun (सूर्य)", B: "Jupiter (बृहस्पति)", C: "Mars (मंगल)",
  D: "Venus (शुक्र)", E: "Mercury (बुध)", F: "Moon (चंद्र)",
  G: "Saturn (शनि)", H: "Rahu (राहु)", I: "Sun (सूर्य)",
  J: "Jupiter (बृहस्पति)", K: "Mars (मंगल)", L: "Venus (शुक्र)",
  M: "Mercury (बुध)", N: "Moon (चंद्र)", O: "Saturn (शनि)",
  P: "Mars (मंगल)", Q: "Sun (सूर्य)", R: "Jupiter (बृहस्पति)",
  S: "Moon (चंद्र)", T: "Mars (मंगल)", U: "Sun (सूर्य)",
  V: "Venus (शुक्र)", W: "Saturn (शनि)", X: "Rahu (राहु)",
  Y: "Venus (शुक्र)", Z: "Saturn (शनि)",
};

const planetCompatibility = {
  "Sun-Moon": { score: 95, description: "Divine Union (दिव्य मिलन)" },
  "Sun-Mercury": { score: 85, description: "Intellectual Bond (बौद्धिक बंधन)" },
  "Sun-Venus": { score: 75, description: "Creative Partnership (सृजनात्मक साझेदारी)" },
  "Moon-Venus": { score: 90, description: "Emotional Harmony (भावनात्मक सामंजस्य)" },
  "Moon-Mercury": { score: 85, description: "Mental Connection (मानसिक संबंध)" },
  "Mercury-Venus": { score: 80, description: "Balanced Union (संतुलित मिलन)" },
  "Jupiter-Venus": { score: 85, description: "Spiritual Bond (आध्यात्मिक बंधन)" },
  "Mars-Venus": { score: 70, description: "Passionate Connection (जोशीला संबंध)" },
  "Saturn-Venus": { score: 60, description: "Karmic Relationship (कार्मिक रिश्ता)" },
};

const faqs = [
  {
    question: "What is Numerology in Vedic Tradition?",
    img: numerologyImg, imgSide: "right",
    answer: "Imagine each letter of your name as a magical number! Just like how you count your toys, in Vedic numerology, we count the special energy of each letter. A is like 1 sun, B is like 2 moons, and so on. When we add these numbers together, they tell us about your special qualities, just like how mixing different colors makes a new beautiful color!",
  },
  {
    question: "How do Planets Influence Us?",
    img: planetaryImg, imgSide: "left",
    answer: `Think of planets as your celestial friends! Each planet has its own personality:\n- Sun is like a loving father, giving warmth and strength\n- Moon is like a caring mother, giving love and comfort\n- Mars is like a brave warrior, giving courage\n- Mercury is like a wise teacher, giving intelligence\n- Jupiter is like a kind guru, giving wisdom\n- Venus is like a beautiful artist, giving love and creativity\n- Saturn is like a strict but fair judge, teaching important lessons`,
  },
  {
    question: "What is Bhrigu Samhita?",
    img: sageBhriguImg, imgSide: "right",
    answer: "Long, long ago, there lived a very wise sage named Bhrigu. He was like a magical storyteller who wrote a special book called Bhrigu Samhita. This book is like a giant collection of everyone's life stories, written even before they were born! It's like having a magical diary that knows about your past, present, and future.",
  },
  {
    question: "What are Planetary Relationships?",
    img: relationshipTypesImg, imgSide: "left",
    answer: `Just like how some of your friends get along better than others, planets also have their best friends!\n- Sun and Moon are best friends (like cookies and milk!)\n- Jupiter and Mercury love to play together\n- Venus and Mars have an exciting relationship\n- Saturn likes to teach important lessons to everyone`,
  },
  {
    question: "How Does Name Energy Work?",
    img: nameEnergyImg, imgSide: "right",
    answer: "Your name is like a beautiful melody! Each letter sings its own special note, and when we put them all together, they create your life's song. The first letter is extra special — it's like the conductor of your orchestra! That's why in Vedic astrology, we pay special attention to your name's first letter to understand which planet is your special guide.",
  },
  {
    question: "What are the Different Types of Relationships in Vedic Astrology?",
    img: relationshipsImg, imgSide: "left",
    answer: `In Vedic tradition, relationships are like different types of beautiful flowers in a garden:\n- Soulmate (आत्मीय): The most divine connection, blessed by the gods\n- Life Partner (जीवनसाथी): A harmonious union of minds and hearts\n- Divine Friend (दिव्य मित्र): A spiritual connection that transcends ordinary friendship\n- Karmic Connection (कर्मिक संबंध): A relationship meant to teach important life lessons\nEach type has its own special purpose in our spiritual journey!`,
  },
];

// ── Helpers ─────────────────────────────────────────────────────────────────
function getNameNumber(name) {
  return name.toUpperCase().split("").reduce((s, l) => s + (letterValues[l] || 0), 0);
}
function reduceToSingle(num) {
  while (num > 9) num = String(num).split("").reduce((s, d) => s + parseInt(d), 0);
  return num;
}
function getPlanetaryCompatibility(n1, n2) {
  const p1 = planetRulerships[n1[0].toUpperCase()];
  const p2 = planetRulerships[n2[0].toUpperCase()];
  const key = `${p1.split(" ")[0]}-${p2.split(" ")[0]}`;
  return planetCompatibility[key] || { score: 70, description: "Neutral Connection (तटस्थ संबंध)" };
}
function determineRelationship(score, gender) {
  if (score > 90) return "Divine Soulmate (दिव्य आत्मीय)";
  if (score > 80) return gender === "male" ? "Destined Wife (भाग्यशाली पत्नी)" : "Destined Husband (भाग्यशाली पति)";
  if (score > 70) return "Spiritual Partner (आध्यात्मिक साथी)";
  if (score > 60) return "Karmic Friend (कर्मिक मित्र)";
  return "Divine Acquaintance (दैवी परिचित)";
}

// ── Sub-components ───────────────────────────────────────────────────────────
function FaqItem({ faq }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{
      background: "rgba(128,0,128,0.2)", borderRadius: 8,
      marginBottom: 12, border: "1px solid #FF9933", overflow: "hidden",
    }}>
      <div
        onClick={() => setOpen(!open)}
        style={{
          padding: "1.2rem 1.5rem", cursor: "pointer", display: "flex",
          justifyContent: "space-between", alignItems: "center",
          fontSize: "1.05rem", color: "#FF9933",
        }}
      >
        {faq.question}
        <span style={{ fontSize: "1.4rem", lineHeight: 1 }}>{open ? "−" : "+"}</span>
      </div>
      {open && (
        <div style={{ padding: "1.2rem 1.5rem", background: "rgba(0,0,0,0.3)", lineHeight: 1.8 }}>
          <img
            src={faq.img}
            alt={faq.question}
            style={{
              width: 180, borderRadius: 6, border: "1px solid #FF9933",
              float: faq.imgSide, margin: faq.imgSide === "right" ? "0 0 10px 14px" : "0 14px 10px 0",
            }}
          />
          {faq.answer.split("\n").map((line, i) => (
            <p key={i} style={{ marginBottom: 4 }}>{line}</p>
          ))}
          <div style={{ clear: "both" }} />
        </div>
      )}
    </div>
  );
}

function ShareModal({ open, onClose, name1, name2, relationship, score, calculations, planetaryInfo }) {
  if (!open) return null;
  return (
    <div
      onClick={(e) => e.target === e.currentTarget && onClose()}
      style={{
        position: "fixed", inset: 0, background: "rgba(0,0,0,0.82)",
        zIndex: 1000, display: "flex", justifyContent: "center",
        alignItems: "flex-start", padding: "20px 10px", overflowY: "auto",
      }}
    >
      <div style={{
        background: "rgba(10,0,20,0.95)", border: "2px solid #FF9933",
        borderRadius: 15, padding: "2rem", maxWidth: 600, width: "95%",
        position: "relative", color: "#fff", margin: "20px auto",
        maxHeight: "90vh", overflowY: "auto",
      }}>
        <span
          onClick={onClose}
          style={{
            position: "sticky", float: "right", top: 0, cursor: "pointer",
            color: "#FF9933", fontSize: 22, width: 30, height: 30,
            border: "1px solid #FF9933", borderRadius: "50%",
            display: "inline-flex", alignItems: "center", justifyContent: "center",
            background: "rgba(0,0,0,0.7)", zIndex: 10,
          }}
        >×</span>
        <h2 style={{ textAlign: "center", color: "#FF9933", marginBottom: "1.5rem" }}>
          ॥ Your Divine Connection ॥
        </h2>
        <div style={{
          background: "rgba(128,0,128,0.2)", padding: "1.2rem",
          borderRadius: 8, border: "1px solid #FF9933",
        }}>
          <div style={{ textAlign: "center" }}>
            <h3 style={{ color: "#FF9933", marginBottom: 8, fontSize: "clamp(1.1rem,4vw,1.4rem)" }}>
              {name1} &amp; {name2}
            </h3>
            <div style={{ fontSize: "clamp(1.2rem,4vw,1.7rem)", color: "#FF9933", marginBottom: 8 }}>
              {relationship}
            </div>
            <div style={{ fontSize: "clamp(1.8rem,5vw,2.5rem)", color: "#FF9933", marginBottom: 16 }}>
              {score}%
            </div>
            <pre style={{ textAlign: "left", fontSize: "clamp(0.85rem,3vw,0.95rem)", whiteSpace: "pre-wrap", marginBottom: 8 }}>
              {calculations}
            </pre>
            <pre style={{ textAlign: "left", fontSize: "clamp(0.85rem,3vw,0.95rem)", whiteSpace: "pre-wrap" }}>
              {planetaryInfo}
            </pre>
          </div>
        </div>
        <button
          onClick={() => alert("🕉 Capture Screenshot! And share with the world!")}
          style={{
            background: "linear-gradient(45deg,#FF9933,#FF7722)", color: "#fff",
            border: "none", padding: "12px 24px", borderRadius: 8, cursor: "pointer",
            fontSize: "1rem", width: "100%", marginTop: "1rem",
            textTransform: "uppercase", letterSpacing: 2,
          }}
        >
          🕉 Capture Divine Moment 🕉
        </button>
      </div>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function SoulSyncCalculator() {
  const [gender, setGender] = useState("");
  const [name1, setName1] = useState("");
  const [name2, setName2] = useState("");
  const [result, setResult] = useState(null);
  const [saveStatus, setSaveStatus] = useState("idle");
  const [saveError, setSaveError] = useState("");
  const [shareOpen, setShareOpen] = useState(false);
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactMessage, setContactMessage] = useState("");
  const audioRef = useRef(null);
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:3001";

  const saveResult = async (payload) => {
    setSaveStatus("saving");
    setSaveError("");
    try {
      const response = await fetch(`${apiBaseUrl}/api/results`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorBody = await response.json().catch(() => ({}));
        const message = errorBody.error || `Save failed with status ${response.status}`;
        throw new Error(message);
      }

      setSaveStatus("saved");
    } catch (error) {
      console.error("Failed to save result", error);
      setSaveError(error instanceof Error ? error.message : "Unknown error");
      setSaveStatus("error");
    }
  };

  const calculate = () => {
    if (!gender || !name1 || !name2) {
      alert("Please fill in all fields 🙏");
      return;
    }
    const num1 = reduceToSingle(getNameNumber(name1));
    const num2 = reduceToSingle(getNameNumber(name2));
    const planetaryInfo = getPlanetaryCompatibility(name1, name2);
    const numerologyScore = 100 - Math.abs(num1 - num2) * 5;
    const finalScore = Math.round((numerologyScore + planetaryInfo.score) / 2);
    const relationship = determineRelationship(finalScore, gender);

    if (finalScore > 80 && audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => {});
    }

    const calculations = `Divine Calculations (दैवी गणना):\n1. Name Numerology (नाम अंक):\n   ${name1} = ${num1} (आपका अंक)\n   ${name2} = ${num2} (साथी का अंक)\n\n2. Planetary Influence (ग्रह प्रभाव):\n   Your Ruling Planet: ${planetRulerships[name1[0].toUpperCase()]}\n   Partner's Ruling Planet: ${planetRulerships[name2[0].toUpperCase()]}\n\n3. Connection Type: ${planetaryInfo.description}\n\n4. Final Divine Score: ${finalScore}% (दैवी अंक)`;
    const planetaryDetail = `Planetary Wisdom (ग्रह ज्ञान):\n${planetaryInfo.description}\nThis connection is blessed by the divine energies of your ruling planets.\nMay this union be guided by cosmic grace! 🕉`;

    setResult({ score: finalScore, relationship, calculations, planetaryDetail });

    const now = new Date();
    const time = now.toLocaleTimeString("en-GB", { hour12: false });
    void saveResult({
      date: now.toISOString(),
      time,
      gender,
      yourName: name1,
      theirName: name2,
      result: `${relationship} (${finalScore}%)`,
    });
  };

  const submitContact = () => {
    if (!contactName || !contactEmail || !contactMessage) {
      alert("Please fill in all fields 🙏");
      return;
    }
    alert("Om Namah Shivaya 🕉\nThank you for reaching out. We will connect with you soon!");
    setContactName(""); setContactEmail(""); setContactMessage("");
  };

  // ── Shared styles ────────────────────────────────────────────────────────
  const inputStyle = {
    width: "100%", padding: "12px", border: "2px solid #FF9933",
    borderRadius: 8, background: "rgba(0,0,0,0.35)", color: "#fff",
    fontSize: "1rem", outline: "none", fontFamily: "inherit",
  };
  const labelStyle = { display: "block", marginBottom: 6, fontSize: "1.05rem", color: "#FF9933" };
  const cardStyle = {
    background: "rgba(128,0,128,0.2)", padding: "2rem",
    borderRadius: 15, backdropFilter: "blur(10px)",
    marginBottom: "2rem", border: "1px solid #FF9933",
  };
  const btnStyle = {
    background: "linear-gradient(45deg,#FF9933,#FF7722)", color: "#fff",
    border: "none", padding: "15px 30px", borderRadius: 8, cursor: "pointer",
    fontSize: "1.15rem", width: "100%", textTransform: "uppercase",
    letterSpacing: 2, fontFamily: "inherit",
  };

  return (
    <div style={{
      minHeight: "100vh", background: "#0a0010",
      color: "#fff", fontFamily: "'Segoe UI', serif", lineHeight: 1.6,
    }}>
      {/* Hidden audio */}
      <audio ref={audioRef} src={destinyAudio} preload="auto" />

      {/* Om symbol */}
      <img src={omSymbol} alt="Om" style={{
        position: "fixed", top: 20, right: 20, width: 50, opacity: 0.5, zIndex: 99,
      }} />

      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "20px" }}>

        {/* ── Header ──────────────────────────────────────────────────────── */}
        <header style={{
          textAlign: "center", padding: "3rem 1.5rem",
          background: "rgba(128,0,128,0.3)", borderRadius: 15,
          marginBottom: "2rem", border: "2px solid #FF9933",
          position: "relative", overflow: "hidden",
        }}>
          <div style={{
            position: "absolute", inset: 0, background: "rgba(0,0,0,0.55)",
            borderRadius: 13,
          }} />
          <div style={{ position: "relative" }}>
            <h1 style={{ fontSize: "clamp(1.8rem,5vw,3rem)", color: "#FF9933", marginBottom: "0.8rem" }}>
              ॥ Soul Sync Calculator ॥
            </h1>
            <p style={{ fontSize: "1.15rem", color: "#fff", fontStyle: "italic", marginBottom: "0.5rem" }}>
              ॥ जीवन साथी योग्यता ॥
            </p>
            <p>Ancient Vedic Wisdom for Modern Love</p>
          </div>
        </header>

        {/* ── Calculator Form ──────────────────────────────────────────────── */}
        <div style={cardStyle}>
          <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
            <img src={kalash} alt="Kalash" style={{ width: 100, height: 100 }} />
          </div>

          <div style={{ marginBottom: "1.5rem" }}>
            <label style={labelStyle}>Your Gender:</label>
            <select value={gender} onChange={(e) => setGender(e.target.value)} style={inputStyle}>
              <option value="">Select Gender</option>
              <option value="male">Male (पुरुष)</option>
              <option value="female">Female (स्त्री)</option>
            </select>
          </div>

          <div style={{ marginBottom: "1.5rem" }}>
            <label style={labelStyle}>Your Name (आपका नाम):</label>
            <input
              type="text" value={name1}
              onChange={(e) => setName1(e.target.value)}
              placeholder="Enter your name" style={inputStyle}
            />
          </div>

          <div style={{ marginBottom: "1.5rem" }}>
            <label style={labelStyle}>Their Name (उनका नाम):</label>
            <input
              type="text" value={name2}
              onChange={(e) => setName2(e.target.value)}
              placeholder="Enter their name" style={inputStyle}
            />
          </div>

          <button onClick={calculate} style={btnStyle}>Calculate Destiny</button>
        </div>

        {/* ── Result ──────────────────────────────────────────────────────── */}
        {result && (
          <div style={{
            ...cardStyle, textAlign: "center",
            border: "2px solid #FF9933", animation: "fadeIn 0.5s ease",
          }}>
            <div style={{ fontSize: "2.2rem", color: "#FF9933", marginBottom: "0.8rem" }}>
              {result.relationship}
            </div>
            <div style={{ fontSize: "4rem", fontWeight: "bold", color: "#FF9933", margin: "1rem 0" }}>
              {result.score}%
            </div>
            {saveStatus === "saving" && (
              <div style={{ color: "#FF9933", marginBottom: "0.8rem" }}>
                Saving to database...
              </div>
            )}
            {saveStatus === "saved" && (
              <div style={{ color: "#7CFFB2", marginBottom: "0.8rem" }}>
                Saved to database.
              </div>
            )}
            {saveStatus === "error" && (
              <div style={{ color: "#FF7766", marginBottom: "0.8rem" }}>
                Could not save to database{saveError ? ` (${saveError})` : ""}.
              </div>
            )}
            <pre style={{
              background: "rgba(0,0,0,0.5)", padding: "1.2rem", borderRadius: 8,
              textAlign: "left", border: "1px solid #FF9933",
              whiteSpace: "pre-wrap", fontSize: "0.95rem", marginBottom: "1rem",
            }}>
              {result.calculations}
            </pre>
            <pre style={{
              background: "rgba(0,0,0,0.4)", padding: "1rem", borderRadius: 8,
              textAlign: "left", whiteSpace: "pre-wrap", fontSize: "0.95rem",
            }}>
              {result.planetaryDetail}
            </pre>
            <button onClick={() => setShareOpen(true)} style={{ ...btnStyle, marginTop: "1.5rem" }}>
              Share Divine Connection 🕉
            </button>
          </div>
        )}

        {/* ── Share Modal ──────────────────────────────────────────────────── */}
        <ShareModal
          open={shareOpen}
          onClose={() => setShareOpen(false)}
          name1={name1} name2={name2}
          relationship={result?.relationship}
          score={result?.score}
          calculations={result?.calculations}
          planetaryInfo={result?.planetaryDetail}
        />

        {/* ── FAQ ─────────────────────────────────────────────────────────── */}
        <section style={{ marginTop: "3rem" }}>
          <h2 style={{ color: "#FF9933", marginBottom: "1.5rem" }}>॥ Divine Knowledge ॥</h2>
          {faqs.map((faq, i) => <FaqItem key={i} faq={faq} />)}
        </section>

        {/* ── Blog ────────────────────────────────────────────────────────── */}
        <section style={{ marginTop: "3rem" }}>
          <h2 style={{ color: "#FF9933", marginBottom: "1.5rem" }}>॥ Ancient Wisdom Blog ॥</h2>
          <div style={{ ...cardStyle, border: "1px solid #FF9933" }}>
            <img
              src={ancientAstrologersImg}
              alt="Ancient Indian Astrologers"
              style={{
                width: "100%", height: 300, objectFit: "cover",
                borderRadius: 8, marginBottom: "1.5rem", border: "2px solid #FF9933",
              }}
            />
            <h3 style={{ color: "#FF9933", fontSize: "1.7rem", marginBottom: "1rem" }}>
              The Legacy of Ancient Indian Astrologers
            </h3>
            <p style={{ lineHeight: 1.8, marginBottom: "1rem" }}>
              In the mystical lands of ancient India, great sages and astrologers unlocked the secrets of the cosmos.
              These wise beings, through deep meditation and divine connection, developed sophisticated systems to
              understand human relationships and destiny.
            </p>
            <h4 style={{ color: "#FF9933", marginBottom: "0.5rem" }}>The Great Sages</h4>
            <img
              src={ancientSagesImg} alt="Ancient Sages"
              style={{ float: "right", margin: "0 0 10px 14px", width: 200, borderRadius: 6 }}
            />
            <p>1. Maharishi Bhrigu: Known as the father of predictive astrology, created the legendary Bhrigu Samhita</p>
            <p>2. Maharishi Parasara: Developed the fundamental principles of Vedic astrology</p>
            <p>3. Varahamihira: Combined Western and Eastern astrological wisdom</p>
            <h4 style={{ color: "#FF9933", margin: "1rem 0 0.5rem" }}>Their Major Contributions</h4>
            <img
              src={ancientTextsImg} alt="Ancient Texts"
              style={{ float: "left", margin: "0 14px 10px 0", width: 200, borderRadius: 6 }}
            />
            <ul style={{ paddingLeft: "1.2rem", lineHeight: 2 }}>
              <li>Development of the Nakshatras system</li>
              <li>Creation of detailed planetary combinations</li>
              <li>Understanding of karmic relationships</li>
              <li>Methods for calculating compatibility</li>
            </ul>
            <div style={{ clear: "both" }} />
            <p style={{ marginTop: "1rem" }}>
              These ancient seers created complex systems that continue to guide millions in their journey of love and life.
            </p>
          </div>
        </section>

        {/* ── Contact Form ─────────────────────────────────────────────────── */}
        <section style={{ ...cardStyle, marginTop: "3rem", border: "2px solid #FF9933" }}>
          <h2 style={{ color: "#FF9933", marginBottom: "0.5rem" }}>॥ Divine Connection ॥</h2>
          <p style={{ marginBottom: "1.5rem" }}>Reach out to us for spiritual guidance and relationship insights</p>

          <div style={{ marginBottom: "1.2rem" }}>
            <label style={labelStyle}>Name (नाम):</label>
            <input type="text" value={contactName} onChange={(e) => setContactName(e.target.value)} style={inputStyle} />
          </div>
          <div style={{ marginBottom: "1.2rem" }}>
            <label style={labelStyle}>Email (ईमेल):</label>
            <input type="email" value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} style={inputStyle} />
          </div>
          <div style={{ marginBottom: "1.2rem" }}>
            <label style={labelStyle}>Message (संदेश):</label>
            <textarea
              rows={4} value={contactMessage}
              onChange={(e) => setContactMessage(e.target.value)}
              style={{ ...inputStyle, resize: "vertical" }}
            />
          </div>
          <button onClick={submitContact} style={btnStyle}>Send Message 🕉</button>
        </section>
      </div>

      {/* ── Footer ──────────────────────────────────────────────────────────── */}
      <footer style={{
        background: "rgba(128,0,128,0.2)", borderTop: "2px solid #FF9933",
        padding: "2rem 0", marginTop: "3rem",
      }}>
        <div style={{
          maxWidth: 1200, margin: "0 auto", padding: "0 20px",
          display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
          gap: "2rem",
        }}>
          {[
            { title: "॥ Divine Wisdom ॥", links: ["About Vedic Astrology", "Sacred Texts", "Spiritual Guidance", "Ancient Traditions"] },
            { title: "॥ Sacred Services ॥", links: ["Relationship Reading", "Compatibility Analysis", "Spiritual Counseling", "Divine Guidance"] },
            { title: "॥ Connect ॥", links: ["Sacred Newsletter", "Divine Community", "Spiritual Blog", "Contact Temple"] },
          ].map((col) => (
            <div key={col.title}>
              <h3 style={{ color: "#FF9933", marginBottom: "1rem" }}>{col.title}</h3>
              <ul style={{ listStyle: "none", padding: 0 }}>
                {col.links.map((link) => (
                  <li key={link} style={{ marginBottom: "0.5rem" }}>
                    <a href="#" style={{ color: "#fff", textDecoration: "none" }}>{link}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div style={{
          textAlign: "center", paddingTop: "2rem", marginTop: "2rem",
          borderTop: "1px solid rgba(255,153,51,0.3)", color: "#fff",
        }}>
          <p>॥ Om Namah Shivaya ॥</p>
          <p>© 2024 Soul Sync Calculator. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}