import React from "react";
import { signin } from "./service/ApiService";
import {
  Box,
  Button,
  Container,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Link,
  VStack,
} from "@chakra-ui/react";

// Login 컴포넌트 정의
class Login extends React.Component {
  constructor(props) {
    super(props);
    // handleSubmit 메서드를 this 바인딩
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  // 폼 제출 시 호출되는 메서드
  handleSubmit(event) {
    event.preventDefault(); // 페이지 리로드 방지
    const data = new FormData(event.target); // 폼 데이터 가져오기
    const email = data.get("email"); // 이메일 필드 값
    const password = data.get("password"); // 패스워드 필드 값

    // ApiService의 signin 메서드 호출
    signin({ email: email, password: password })
      .then((response) => {
        if (response && response.success) {
          // 로그인 성공 시 사용자의 이름을 저장하고 메인 페이지로 리디렉션
          const username = response.username;
          window.location.href = `/main?username=${encodeURIComponent(username)}`;
        } else {
          throw new Error(response.message || "Login failed"); // 로그인 실패 시 에러 발생
        }
      })
      .catch((error) => console.error("Login failed: ", error)); // 에러 로그 출력
  }

  render() {
    return (
      // 로그인 폼 렌더링
      <Container maxW="xs" mt="8">
        <VStack spacing="4" as="form" onSubmit={this.handleSubmit}>
          <Heading as="h1" size="lg" mb="4">
            로그인
          </Heading>
          <FormControl id="email" isRequired>
            <FormLabel>이메일 주소</FormLabel>
            <Input name="email" type="email" />
          </FormControl>
          <FormControl id="password" isRequired>
            <FormLabel>패스워드</FormLabel>
            <Input name="password" type="password" />
          </FormControl>
          <Button type="submit" colorScheme="teal" size="lg" width="full">
            로그인
          </Button>
          <Box textAlign="center" mt="4">
            <Link href="/signup" color="teal.500">
              계정이 없습니까? 여기서 가입하세요.
            </Link>
          </Box>
        </VStack>
      </Container>
    );
  }
}

export default Login;
