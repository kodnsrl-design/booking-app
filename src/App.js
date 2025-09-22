import { useState } from "react";

export default function App() {
  const users = ["와우리", "경민", "신디", "건영"];
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth()); // 0~11
  const [reservations, setReservations] = useState({}); // key: "YYYY-M-D", value: user

  const handleReserve = (day, user) => {
    const key = `${year}-${month + 1}-${day}`;
    const current = reservations[key];

    if (!current) {
      // 예약 없는 경우 → 누구나 예약 가능
      setReservations(prev => ({ ...prev, [key]: user }));
    } else if (current === user) {
      // 예약자 본인 클릭 → 취소
      const newRes = { ...reservations };
      delete newRes[key];
      setReservations(newRes);
    } else {
      // 다른 사람 예약 → 아무 일도 안 일어남
      alert(`${current}님이 이미 예약했습니다!`);
    }
  };

  const getDaysInMonth = (y, m) => new Date(y, m + 1, 0).getDate();
  const daysInMonth = getDaysInMonth(year, month);

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1 style={{ textAlign: "center" }}>🏠 숙소 예약 공유</h1>

      {/* 연도, 월 선택 */}
      <div style={{ marginBottom: "20px", textAlign: "center" }}>
        <select value={year} onChange={e => setYear(Number(e.target.value))}>
          {Array.from({ length: 5 }, (_, i) => today.getFullYear() - 2 + i).map(y => (
            <option key={y} value={y}>{y}년</option>
          ))}
        </select>

        <select value={month} onChange={e => setMonth(Number(e.target.value))} style={{ marginLeft: "10px" }}>
          {Array.from({ length: 12 }, (_, i) => i).map(m => (
            <option key={m} value={m}>{m + 1}월</option>
          ))}
        </select>
      </div>

      {/* 날짜 달력 */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(7, 1fr)",
        gap: "10px"
      }}>
        {Array.from({ length: daysInMonth }, (_, i) => {
          const day = i + 1;
          const key = `${year}-${month + 1}-${day}`;
          const current = reservations[key];

          return (
            <div key={day} style={{
              border: "1px solid #ccc",
              borderRadius: "5px",
              padding: "5px",
              textAlign: "center"
            }}>
              <div>{day}일</div>
              <div style={{ fontSize: "12px", color: "#555" }}>
                {current || "예약 없음"}
              </div>
              <div style={{ marginTop: "5px" }}>
                {users.map(u => (
                  <button
                    key={u}
                    style={{
                      fontSize: "10px",
                      margin: "2px",
                      padding: "2px 5px",
                      backgroundColor: current === u ? "#ff7f7f" : "#87cefa",
                      border: "none",
                      borderRadius: "3px",
                      cursor: "pointer"
                    }}
                    onClick={() => handleReserve(day, u)}
                  >
                    {u}
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}