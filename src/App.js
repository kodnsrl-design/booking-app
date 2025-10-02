import { useState, useEffect } from "react";

export default function App() {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth()); // 0~11
  const [reservations, setReservations] = useState(() => {
    return JSON.parse(localStorage.getItem("reservations") || "{}");
  });
  const [inputName, setInputName] = useState(""); 
  const [selectedDay, setSelectedDay] = useState(null); 
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });
  const [pin, setPin] = useState("");

  // 저장된 예약 업데이트
  useEffect(() => {
    localStorage.setItem("reservations", JSON.stringify(reservations));
  }, [reservations]);

  // 회원가입 함수
  const handleSignup = () => {
    if (!inputName.trim() || pin.length !== 4) {
      alert("이름과 4자리 PIN을 정확히 입력하세요.");
      return;
    }
    const newUser = { name: inputName.trim(), pin };
    setUser(newUser);
    localStorage.setItem("user", JSON.stringify(newUser));
    setInputName("");
    setPin("");
  };

  // 하루 2명 예약 가능 handleReserve
  const handleReserve = () => {
    if (!selectedDay) return;
    const key = `${year}-${month + 1}-${selectedDay}`;
    const current = reservations[key] || [];

    if (current.includes(user.name)) {
      // 본인 예약 취소
      const newRes = { ...reservations };
      newRes[key] = current.filter((name) => name !== user.name);
      if (newRes[key].length === 0) delete newRes[key];
      setReservations(newRes);
      setSelectedDay(null);
    } else if (current.length >= 2) {
      // 이미 2명 예약
      alert("이 날짜는 이미 2명이 예약했습니다!");
    } else {
      // 예약 가능 → 추가
      setReservations((prev) => ({ ...prev, [key]: [...current, user.name] }));
      setSelectedDay(null);
    }
  };

  const handleBack = () => {
    setSelectedDay(null);
  };

  const getDaysInMonth = (y, m) => new Date(y, m + 1, 0).getDate();
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = new Date(year, month, 1).getDay();

  // 요일 배열 (일~토)
  const weekdays = ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"];

  // 공휴일 예시 (MM-DD 형식)
  const holidays = ["01-01", "12-25"]; 

  // 요일/공휴일 색상
  const getDateColor = (day) => {
    const date = new Date(year, month, day);
    const dayOfWeek = date.getDay();
    const mmdd = `${String(month + 1).padStart(2,"0")}-${String(day).padStart(2,"0")}`;
    if (holidays.includes(mmdd) || dayOfWeek === 0) return "#FF4C4C"; // 일요일/공휴일 빨강
    if (dayOfWeek === 6) return "#1E90FF"; // 토요일 파랑
    return "#000"; // 평일 검정
  };

  // 지난 날짜 판별
  const isPastDate = (day) => {
    const date = new Date(year, month, day);
    const todayDate = new Date();
    todayDate.setHours(0, 0, 0, 0); // 오늘 00:00 기준
    return date < todayDate;
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1 style={{ textAlign: "center" }}>🏠 숙소 예약 공유</h1>

      {!user && (
        <div style={{ textAlign: "center", marginBottom: "20px" }}>
          <h3>회원가입</h3>
          <input
            type="text"
            placeholder="이름 입력"
            value={inputName}
            onChange={(e) => setInputName(e.target.value)}
            style={{ padding: "5px", marginRight: "10px" }}
          />
          <input
            type="password"
            placeholder="PIN 4자리"
            maxLength={4}
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            style={{ padding: "5px", marginRight: "10px" }}
          />
          <button 
            onClick={handleSignup} 
            style={{ 
              padding: "5px 10px", 
              borderRadius: "5px", 
              backgroundColor: "#87cefa", 
              border: "none", 
              cursor: "pointer" 
            }}
          >
            회원가입
          </button>
        </div>
      )}

      {user && (
        <>
          {/* 연도, 월 선택 */}
          <div style={{ marginBottom: "20px", textAlign: "center" }}>
            <select value={year} onChange={(e) => setYear(Number(e.target.value))}>
              {Array.from({ length: 5 }, (_, i) => today.getFullYear() - 2 + i).map((y) => (
                <option key={y} value={y}>{y}년</option>
              ))}
            </select>

            <select value={month} onChange={(e) => setMonth(Number(e.target.value))} style={{ marginLeft: "10px" }}>
              {Array.from({ length: 12 }, (_, i) => i).map((m) => (
                <option key={m} value={m}>{m + 1}월</option>
              ))}
            </select>
          </div>

          {/* 요일 헤더 */}
          <div style={{ 
            display: "grid", 
            gridTemplateColumns: "repeat(7, 1fr)", 
            textAlign: "center", 
            fontWeight: "bold", 
            marginBottom: "10px" 
          }}>
            {weekdays.map((day, idx) => (
              <div 
                key={day} 
                style={{ 
                  color: idx === 0 ? "#FF4C4C" : idx === 6 ? "#1E90FF" : "#000" 
                }}
              >
                {day}
              </div>
            ))}
          </div>

          {/* 날짜 달력 */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "10px" }}>
            {Array.from({ length: firstDay }).map((_, i) => <div key={`empty-${i}`} />)}

            {Array.from({ length: daysInMonth }, (_, i) => {
              const day = i + 1;
              const key = `${year}-${month + 1}-${day}`;
              const current = reservations[key] || [];
              const isMyReservation = current.includes(user.name);
              const past = isPastDate(day);

              return (
                <div
                  key={day}
                  style={{
                    border: "1px solid #ccc",
                    borderRadius: "5px",
                    padding: "5px",
                    textAlign: "center",
                    cursor: past ? "not-allowed" : "pointer",
                    backgroundColor: past
                      ? "#A9A9A9" // 지난 날짜 = 진한 회색
                      : selectedDay === day
                      ? "#e0f7fa"
                      : "transparent",
                  }}
                  onClick={() => !past && setSelectedDay(day)} // 지난 날짜 선택 불가
                >
                  <div style={{ color: getDateColor(day) }}>{day}일</div>
                  <div 
                    style={{ 
                      fontSize: "12px", 
                      color: isMyReservation ? "#0066CC" : current.length > 0 ? "#555" : "#555" 
                    }}
                  >
                    {current.length > 0 ? current.join(", ") : "예약 없음"}
                  </div>
                </div>
              );
            })}
          </div>

          {/* 예약 입력창 */}
          {selectedDay && (
            <div style={{ marginTop: "20px", textAlign: "center" }}>
              <h3>{year}년 {month + 1}월 {selectedDay}일 예약</h3>
              {reservations[`${year}-${month + 1}-${selectedDay}`]?.includes(user.name) ? (
                <>
                  <button 
                    onClick={handleReserve} 
                    style={{ 
                      padding: "5px 10px", 
                      border: "none", 
                      borderRadius: "5px", 
                      backgroundColor: "#87cefa", 
                      cursor: "pointer", 
                      marginRight: "10px" 
                    }}
                  >
                    예약 취소
                  </button>
                  <button 
                    onClick={handleBack} 
                    style={{ 
                      padding: "5px 10px", 
                      border: "none", 
                      borderRadius: "5px", 
                      backgroundColor: "#ccc", 
                      cursor: "pointer" 
                    }}
                  >
                    돌아가기
                  </button>
                </>
              ) : reservations[`${year}-${month + 1}-${selectedDay}`]?.length >= 2 ? (
                <>
                  <button disabled style={{ 
                    padding: "5px 10px", 
                    border: "none", 
                    borderRadius: "5px", 
                    backgroundColor: "#ccc", 
                    cursor: "not-allowed", 
                    marginRight: "10px" 
                  }}>
                    예약 불가
                  </button>
                  <button 
                    onClick={handleBack} 
                    style={{ 
                      padding: "5px 10px", 
                      border: "none", 
                      borderRadius: "5px", 
                      backgroundColor: "#ccc", 
                      cursor: "pointer" 
                    }}
                  >
                    돌아가기
                  </button>
                </>
              ) : (
                <>
                  <button 
                    onClick={handleReserve} 
                    style={{ 
                      padding: "5px 10px", 
                      border: "none", 
                      borderRadius: "5px", 
                      backgroundColor: "#87cefa", 
                      cursor: "pointer", 
                      marginRight: "10px" 
                    }}
                  >
                    예약하기
                  </button>
                  <button 
                    onClick={handleBack} 
                    style={{ 
                      padding: "5px 10px", 
                      border: "none", 
                      borderRadius: "5px", 
                      backgroundColor: "#ccc", 
                      cursor: "pointer" 
                    }}
                  >
                    돌아가기
                  </button>
                </>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
