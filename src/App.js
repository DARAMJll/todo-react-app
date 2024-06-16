import React, { useEffect, useState } from "react";
import {
  Box,
  Container,
  Heading,
  Flex,
  Button,
  Text,
  Select,
} from "@chakra-ui/react";
import { signout } from "./service/ApiService";
import Calculator from "./Calculator";
import Todo from "./Todo";
import Diary from "./Diary";
import Portfolio from "./Portfolio";
import News from "./News";
import "./App.css";

// 메인 App 컴포넌트
const App = ({ userName }) => {
  // 현재 페이지 상태
  const [currentPage, setCurrentPage] = useState("main");
  // 현재 시간 상태
  const [time, setTime] = useState(new Date());
  // 현재 달 상태
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // 컴포넌트가 마운트될 때마다 현재 시간을 업데이트
  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // 로그아웃 핸들러
  const handleLogout = () => {
    signout();
    window.location.href = "/login";
  };

  // 이전 달로 이동
  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() - 1)));
  };

  // 다음 달로 이동
  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() + 1)));
  };

  // 연도 선택 핸들러
  const handleYearChange = (event) => {
    const newDate = new Date(currentMonth);
    newDate.setFullYear(event.target.value);
    setCurrentMonth(newDate);
  };

  // 월 선택 핸들러
  const handleMonthChange = (event) => {
    const newDate = new Date(currentMonth);
    newDate.setMonth(event.target.value - 1);
    setCurrentMonth(newDate);
  };

  // 달력 생성 함수
  const generateCalendar = () => {
    const startDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay();
    const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();

    const calendar = [];
    let day = 1;
    for (let i = 0; i < 6; i++) {
      const week = [];
      for (let j = 0; j < 7; j++) {
        if (i === 0 && j < startDay) {
          week.push(<div key={`empty-${i}-${j}`} className="empty-day" />);
        } else if (day > daysInMonth) {
          week.push(<div key={`empty-${i}-${j}`} className="empty-day" />);
        } else {
          const today = new Date();
          const isToday =
            today.getDate() === day &&
            today.getMonth() === currentMonth.getMonth() &&
            today.getFullYear() === currentMonth.getFullYear();
          week.push(
            <div
              key={`day-${day}`}
              className={`day ${isToday ? "today" : ""}`}
            >
              {day}
            </div>
          );
          day++;
        }
      }
      calendar.push(<div className="week" key={`week-${i}`}>{week}</div>);
    }
    return calendar;
  };

  // 연도와 월 리스트 생성
  const years = Array.from({ length: 101 }, (_, i) => new Date().getFullYear() - 50 + i);
  const months = Array.from({ length: 12 }, (_, i) => i + 1);

  // 네비게이션 바
  const navigationBar = (
    <Flex
      as="nav"
      p="4"
      bg="teal.500"
      color="white"
      justify="space-between"
      align="center"
    >
      <Heading
        size="lg"
        cursor="pointer"
        color={currentPage === "main" ? "orange.300" : "white"}
        onClick={() => setCurrentPage("main")}
      >
        All In One
      </Heading>
      <Flex>
        <Button
          variant="link"
          mx="2"
          color={currentPage === "J" ? "orange.300" : "white"}
          onClick={() => setCurrentPage("J")}
        >
          J가 되는 법
        </Button>
        <Button
          variant="link"
          mx="2"
          color={currentPage === "diary" ? "orange.300" : "white"}
          onClick={() => setCurrentPage("diary")}
        >
          일기장
        </Button>
        <Button
          variant="link"
          mx="2"
          color={currentPage === "news" ? "orange.300" : "white"}
          onClick={() => setCurrentPage("news")}
        >
          News
        </Button>
        <Button
          variant="link"
          mx="2"
          color={currentPage === "portfolio" ? "orange.300" : "white"}
          onClick={() => setCurrentPage("portfolio")}
        >
          주식 포트폴리오
        </Button>
        <Button
          variant="link"
          mx="2"
          color={currentPage === "calculator" ? "orange.300" : "white"}
          onClick={() => setCurrentPage("calculator")}
        >
          계산기
        </Button>
      </Flex>
      <Button variant="link" color="white" onClick={handleLogout}>
        logout
      </Button>
    </Flex>
  );

  // 페이지 푸터
  const footer = (
    <Text fontSize="sm" color="gray.600" textAlign="center" mt="10">
      전과생이 만든 홈페이지
    </Text>
  );

  // 현재 페이지에 따라 다른 컴포넌트 렌더링
  const renderPage = () => {
    switch (currentPage) {
      case "J":
        return <Todo />;
      case "diary":
        return <Diary />;
      case "calculator":
        return <Calculator />;
      case "portfolio":
        return <Portfolio />;
      case "news":
        return <News />;
      default:
        return (
          <Box textAlign="center" mt={5}>
            <Heading as="h2" size="xl" mb={5}>
              안녕하세요, {userName}님! 올인원에 오신 것을 환영합니다.
            </Heading>
            <Text fontSize="lg" mb={5}>
              "올인원"은 당신의 일상 관리를 위한 최적의 도구입니다. 할 일 목록, 일기장, 계산기, 주식 포트폴리오, 최신 뉴스를 한 곳에서 편리하게 이용하세요.
            </Text>
            <Text fontSize="lg" mb={5}>
              하루를 계획하고, 중요한 순간을 기록하며, 필요한 정보를 즉시 얻을 수 있는 "올인원"과 함께 스마트한 라이프스타일을 즐기세요.
            </Text>
            <Text fontSize="lg" mb={5}>
              지금 시작하세요. 당신의 모든 것을 한 곳에서 관리할 수 있습니다.
            </Text>
            <Flex className="main-container">
              <Box className="clock-container">
                <div className="clock">
                  <div className="hand hour" style={{ transform: `rotate(${time.getHours() * 30 + time.getMinutes() / 2}deg)` }}></div>
                  <div className="hand minute" style={{ transform: `rotate(${time.getMinutes() * 6}deg)` }}></div>
                  <div className="hand second" style={{ transform: `rotate(${time.getSeconds() * 6}deg)` }}></div>
                </div>
                <div className="digital-time">
                  {time.toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                  })}
                </div>
                <div className="date">
                  {time.toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </div>
              </Box>
              <Box className="calendar">
                <header className="calendar-header">
                  <button onClick={handlePrevMonth}>&lt;</button>
                  <Select
                    value={currentMonth.getFullYear()}
                    onChange={handleYearChange}
                    size="sm"
                    width="auto"
                  >
                    {years.map(year => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </Select>
                  <Select
                    value={currentMonth.getMonth() + 1}
                    onChange={handleMonthChange}
                    size="sm"
                    width="auto"
                  >
                    {months.map(month => (
                      <option key={month} value={month}>{month}</option>
                    ))}
                  </Select>
                  <button onClick={handleNextMonth}>&gt;</button>
                </header>
                <div className="calendar-grid">
                  <div className="day">일</div>
                  <div className="day">월</div>
                  <div className="day">화</div>
                  <div className="day">수</div>
                  <div className="day">목</div>
                  <div className="day">금</div>
                  <div className="day">토</div>
                  {generateCalendar()}
                </div>
              </Box>
              <Box className="card-container">
                <Box className="card" onClick={() => setCurrentPage("J")}>
                  <img src="images/todo.png" alt="J가 되는 법" />
                  <Text className="card-title">J가 되는 법</Text>
                </Box>
                <Box className="card" onClick={() => setCurrentPage("diary")}>
                  <img src="images/diary.png" alt="일기장" />
                  <Text className="card-title">일기장</Text>
                </Box>
                <Box className="card" onClick={() => setCurrentPage("news")}>
                  <img src="images/news.png" alt="News" />
                  <Text className="card-title">News</Text>
                </Box>
                <Box className="card" onClick={() => setCurrentPage("portfolio")}>
                  <img src="images/portfolio.png" alt="주식 포트폴리오" />
                  <Text className="card-title">주식 포트폴리오</Text>
                </Box>
                <Box className="card" onClick={() => setCurrentPage("calculator")}>
                  <img src="images/calculator.png" alt="계산기" />
                  <Text className="card-title">계산기</Text>
                </Box>
              </Box>
            </Flex>
          </Box>
        );
    }
  };

  return (
    <>
      {navigationBar}
      <Container maxW="container.md">
        {renderPage()}
      </Container>
      {footer}
    </>
  );
};

export default App;
