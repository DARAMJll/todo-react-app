import React from "react";
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
  Text,
} from "@chakra-ui/react";
import { signup } from "./service/ApiService";

class SignUp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null, // 오류 메시지 상태
      success: null, // 성공 메시지 상태
    };
    this.handleSubmit = this.handleSubmit.bind(this); // this 바인딩
  }

  // 폼 제출 시 호출되는 함수
  handleSubmit(event) {
    event.preventDefault(); // 기본 폼 제출 동작 방지

    const data = new FormData(event.target); // 폼 데이터 가져오기
    const username = data.get("username"); // 사용자 이름
    const email = data.get("email"); // 이메일 주소
    const password = data.get("password"); // 패스워드
    const confirmPassword = data.get("confirmPassword"); // 패스워드 확인

    // 패스워드와 패스워드 확인이 일치하지 않을 경우 오류 메시지 설정
    if (password !== confirmPassword) {
      this.setState({ error: "패스워드가 일치하지 않습니다.", success: null });
      return;
    }

    // 계정 생성 API 호출
    signup({ email: email, username: username, password: password })
      .then((response) => {
        if (response.id) {
          // 성공 시 성공 메시지 설정
          this.setState({ success: "계정 생성이 완료되었습니다.", error: null });
        }
      })
      .catch((error) => {
        console.error("Signup failed: ", error);
        // 실패 시 오류 메시지 설정
        this.setState({
          error: "계정 생성에 실패했습니다. 이미 존재하는 계정일 수 있습니다.",
          success: null,
        });
      });
  }

  render() {
    return (
      <Container maxW="xs" mt="8">
        <VStack spacing="4" as="form" onSubmit={this.handleSubmit}>
          <Heading as="h1" size="lg" mb="4">
            계정 생성
          </Heading>
          <FormControl id="username" isRequired>
            <FormLabel>사용자 이름</FormLabel>
            <Input name="username" />
          </FormControl>
          <FormControl id="email" isRequired>
            <FormLabel>이메일 주소</FormLabel>
            <Input name="email" type="email" />
          </FormControl>
          <FormControl id="password" isRequired>
            <FormLabel>패스워드</FormLabel>
            <Input name="password" type="password" />
          </FormControl>
          <FormControl id="confirmPassword" isRequired>
            <FormLabel>패스워드 확인</FormLabel>
            <Input name="confirmPassword" type="password" />
          </FormControl>
          <Button type="submit" colorScheme="teal" size="lg" width="full">
            계정 생성
          </Button>
          {/* 오류 메시지 표시 */}
          {this.state.error && (
            <Text color="red.500" mt="4">
              {this.state.error}
            </Text>
          )}
          {/* 성공 메시지 표시 */}
          {this.state.success && (
            <Text color="green.500" mt="4">
              {this.state.success}
            </Text>
          )}
          <Box textAlign="center" mt="4">
            <Link href="/login" color="teal.500">
              이미 계정이 있습니까? 로그인하세요.
            </Link>
          </Box>
        </VStack>
      </Container>
    );
  }
}

export default SignUp;
