import { useState, useEffect } from "react";

export default function App() {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth()); // 0~11
  const [reservations, setReservations] = useState({}); // key: "YYYY-M-D", value: name
  const [users, setUsers] = useState([]); // { name, pin }
  const [selectedDay, setSelectedDay] = useState(null); // 선택한 날짜
  const [isAuthOpen, setIsAuthOpen] = useState(false); // 로그인/회원가입 화면 표시
  const [authName, setAuthName] = useState(""); // 입력 이름
  const [authPin, setAuthPin] = useState(""); // 입력 PIN
  const [isLoginMode, setIsLoginMode] = useState(true); // 로그인 모드/회원가입 모드

  // --- localStorage에서 초기 데이터 불러오기 ---
  useEffect(() => {
    const savedRes = localStorage.getItem("reservations");
    const savedUsers = localStorage.getItem("users");
    if (savedRes) setReservations(JSON.parse(savedRes));
    if (savedUsers) setUsers(JSON.parse(savedUsers));
  }, []);

  // --- reservations 변경 시 localStorage 저장 ---
  useEffect(() => {
    localStorage.setItem("reservations", JSON.stringify(reservations));
  }, [reservations]);

  // --- users 변경 시 localStorage 저장 ---
  useEffect(() => {
    localStorage.setItem("users", JSON.stringify(users));
  }, [users]);

  const getDaysInMonth = (y, m) => new Date(y, m + 1, 0).getDate();
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = new Date(year, month, 1).getDay();

  // --- 예약 클릭 처리 ---
  const handleDayClick = (day) => {
    setSelectedDay(day);
    setIsAuthOpen(true); // 예약 시 로그인/회원가입 화면 열기
  };

  // --- 로그인 처리 ---
  const handleLogin = () => {
    const user = users.find(u => u.name === authName && u.pin === authPin);
    if (!user) {
      alert("회원 정보가 없거나 PIN이 잘못되었습니다.");
      return;
    }
    handleReserve(user.name);
    setAuthName(""); setAuthPin(""); setIsAuthOpen(false);
  };

  // --- 회원가입 처리 ---
  const handleSignup = () => {
    if (!authName.trim() || authPin.length !== 4) {
      alert("이름과 4자리 PIN을 입력하세요.");
      return;
    }
    if (users.find(u => u.name === authName)) {
      alert("이미 등록된 이름입니다.");
      return;
    }
    const newUser = { name: authName.trim(), pin: authPin };
    setUsers(prev => [...prev, newUser]);
    alert("회원가입 완료! 로그인 후 예약하세요.");
    setAuthName(""); setAuthPin(""); setIsLoginMode(true);
  };

  // --- 예약 / 취소 처리 ---
  const handleReserve = (name) => {
    if (!selectedDay) return;
    const key = `${year}-${month + 1}-${selectedDay}`;
    const current = reservations[key];

    if (!current) {
      // 예약 없음 → 등록
      setReservations(prev => ({ ...prev, [key]: name }));
    } else if (current === name) {
      // 본인 예약 취소
      const newRes = { ...reservations };
      delete newRes[key];
      setReservations(newRes);
    } else {
      // 다른 사람 예약 → 불가
      alert(`${current}님이 이미 예약했습니다!`);
    }
    setSelectedDay(null);
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1 style={{ textAlign: "center" }}>🏠 가족 숙소 예약</h1>

      {/* 연도/월 선택 */}
      <div style={{ marginBottom: "20px", textAlign: "center" }}>
        <select value={year} onChange={e => setYear(Number(e.target.value))}>
          {Array.from({ length: 5 }, (_, i) => today.getFullYear() - 2 + i)
            .map(y => <option key={y} value={y}>{y}년</option>)}
        </select>
        <select value={month} onChange={e => setMonth(Number(e.target.value))} style={{ marginLeft: "10px" }}>
          {Array.from({ length: 12 }, (_, i) => i)
            .map(m => <option key={m} value={m}>{m + 1}월</option>)}
        </select>
      </div>

      {/* 요일 헤더 */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", textAlign: "center", fontWeight: "bold", marginBottom: "10px" }}>
        {["일","월","화","수","목","금","토"].map(d => <div key={d}>{d}</div>)}
      </div>

      {/* 달력 */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: "10px" }}>
        {Array.from({ length: firstDay }).map((_,i)=><div key={`empty-${i}`}></div>)}
        {Array.from({ length: daysInMonth }).map((_,i)=>{
          const day = i+1;
          const key = `${year}-${month+1}-${day}`;
          const current = reservations[key];
          return (
            <div key={day}
              style={{
                border:"1px solid #ccc",
                borderRadius:"5px",
                padding:"5px",
                textAlign:"center",
                cursor:"pointer",
                backgroundColor:selectedDay===day?"#e0f7fa":"transparent"
              }}
              onClick={()=>handleDayClick(day)}
            >
              <div>{day}일</div>
              <div style={{ fontSize:"12px", color:current?"red":"#555", fontWeight:current?"bold":"normal"}}>
                {current||"예약 없음"}
              </div>
            </div>
          )
        })}
      </div>

      {/* 로그인 / 회원가입 모달 */}
      {isAuthOpen && (
        <div style={{
          position:"fixed", top:0,left:0,right:0,bottom:0,
          backgroundColor:"rgba(0,0,0,0.5)", display:"flex", alignItems:"center", justifyContent:"center"
        }}>
          <div style={{ backgroundColor:"#fff", padding:"20px", borderRadius:"10px", width:"300px", textAlign:"center" }}>
            <h3>{isLoginMode?"로그인":"회원가입"}</h3>
            <input type="text" placeholder="이름" value={authName} onChange={e=>setAuthName(e.target.value)}
              style={{ width:"80%", padding:"5px", marginBottom:"10px"}} />
            <input type="password" placeholder="PIN 4자리" value={authPin} onChange={e=>setAuthPin(e.target.value)}
              style={{ width:"80%", padding:"5px", marginBottom:"10px"}} maxLength={4} />
            {isLoginMode?
              <button onClick={handleLogin} style={{ padding:"5px 10px", marginRight:"5px" }}>로그인</button>
              :
              <button onClick={handleSignup} style={{ padding:"5px 10px", marginRight:"5px" }}>회원가입</button>
            }
            <button onClick={()=>setIsLoginMode(!isLoginMode)} style={{ padding:"5px 10px", marginTop:"10px" }}>
              {isLoginMode?"회원가입으로":"로그인으로"}
            </button>
            <div style={{ marginTop:"10px", fontSize:"12px", color:"#555" }}>
              {isLoginMode?"예약하려면 로그인하세요":"이름과 PIN 입력 후 회원가입"}
            </div>
            <button onClick={()=>setIsAuthOpen(false)} style={{ position:"absolute", top:"10px", right:"10px", background:"none", border:"none", fontSize:"16px", cursor:"pointer" }}>✖</button>
          </div>
        </div>
      )}
    </div>
  );
}