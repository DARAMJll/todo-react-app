import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Box } from "@chakra-ui/react";
import App from "./App";
import Login from "./Login";
import SignUp from "./SignUp";
import { getUser } from "./service/ApiService";

// AppRouter 컴포넌트 정의
const AppRouter = () => {
  // 사용자 이름 상태 정의
  const [userName, setUserName] = useState("");

  // 컴포넌트가 마운트될 때 사용자 정보를 가져옴
  useEffect(() => {
    getUser().then(user => setUserName(user.username));
  }, []);

  // 라우터 설정
  return (
    <BrowserRouter>
      <Box>
        <Routes>
          {/* 로그인 페이지 라우트 */}
          <Route path="/login" element={<Login />} />
          {/* 회원가입 페이지 라우트 */}
          <Route path="/signup" element={<SignUp />} />
          {/* 메인 앱 페이지 라우트, 사용자 이름을 props로 전달 */}
          <Route path="/" element={<App userName={userName} />} />
        </Routes>
      </Box>
    </BrowserRouter>
  );
};

// AppRouter 컴포넌트 내보내기
export default AppRouter;
