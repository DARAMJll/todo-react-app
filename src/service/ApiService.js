import { API_BASE_URL } from "../app-config";

// API 호출 함수
export function call(api, method, request) {
  // 헤더 설정
  let headers = new Headers({
    "Content-Type": "application/json",
  });

  // 로컬 스토리지에서 액세스 토큰 가져오기
  const accessToken = localStorage.getItem("ACCESS_TOKEN");
  if (accessToken) {
    headers.append("Authorization", "Bearer " + accessToken);
  }

  // 옵션 설정
  let options = {
    headers: headers,
    url: API_BASE_URL + api,
    method: method,
  };

  // 요청 본문 설정
  if (request) {
    options.body = JSON.stringify(request);
  }

  // fetch API 호출
  return fetch(options.url, options)
    .then((response) =>
      response.json().then((json) => {
        if (!response.ok) {
          // 응답이 정상적이지 않으면 오류 반환
          return Promise.reject(json);
        }
        // 정상 응답 반환
        return json;
      })
    )
    .catch((error) => {
      // 오류 처리
      console.log("Oops!");
      console.log(error);
      // 403 오류인 경우 로그인 페이지로 리디렉션
      if (error.status === 403) {
        window.location.href = "/login";
      }
      return Promise.reject(error);
    });
}

// 로그인 함수
export function signin(userDTO) {
  return call("/auth/signin", "POST", userDTO)
    .then((response) => {
      // 토큰이 있는 경우 로컬 스토리지에 저장하고 홈으로 리디렉션
      if (response.token) {
        localStorage.setItem("ACCESS_TOKEN", response.token);
        window.location.href = "/";
      }
    })
    .catch((error) => {
      // 로그인 오류 처리
      console.error("Login error: ", error);
      alert("로그인에 실패했습니다. 이메일과 비밀번호를 확인하세요.");
    });
}

// 회원가입 함수
export function signup(userDTO) {
  return call("/auth/signup", "POST", userDTO)
    .then((response) => {
      // 회원가입이 성공하면 응답 반환
      if (response.id) {
        return response;
      }
    })
    .catch((error) => {
      // 회원가입 오류 처리
      console.error("Signup error: ", error);
      throw error;
    });
}

// 로그아웃 함수
export function signout() {
  // 로컬 스토리지에서 토큰 제거하고 홈으로 리디렉션
  localStorage.removeItem("ACCESS_TOKEN");
  window.location.href = "/";
}

// 사용자 정보 가져오기 함수
export function getUser() {
  return call("/auth/user", "GET", null);
}
