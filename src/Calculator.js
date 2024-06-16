import React, { useState } from "react";
import {
  Container,
  Heading,
  Box,
  Text,
  Grid,
  Button,
  VStack,
  useColorModeValue,
} from "@chakra-ui/react";

// Calculator 컴포넌트 정의
const Calculator = () => {
  // 상태 정의: input(사용자 입력), result(계산 결과), history(계산 내역)
  const [input, setInput] = useState("");
  const [result, setResult] = useState("");
  const [history, setHistory] = useState([]);

  // 버튼 클릭 핸들러
  const handleButtonClick = (value) => {
    if (value === "=") { // "=" 버튼 클릭 시 계산 수행
      try {
        const evalResult = new Function(`return ${input}`)();
        setResult(evalResult);
        const newHistory = [...history, { input, result: evalResult }];
        if (newHistory.length > 10) {
          newHistory.shift(); // 오래된 내역 제거
        }
        setHistory(newHistory);
      } catch (error) {
        setResult("Error");
      }
    } else if (value === "C") { // "C" 버튼 클릭 시 입력과 결과 초기화
      setInput("");
      setResult("");
    } else { // 다른 버튼 클릭 시 입력 추가
      setInput(input + value);
    }
  };

  return (
    <Container maxW="md">
      <VStack spacing={4}>
        {/* 계산기 디스플레이 박스 */}
        <Box
          bg={useColorModeValue("gray.50", "gray.700")}
          p={4}
          rounded="md"
          shadow="md"
          w="100%"
        >
          <Heading size="lg">Calculator</Heading>
          <Box>
            <Text>Problem: {input}</Text>
            <Text>Solution: {result}</Text>
          </Box>
        </Box>

        {/* 계산기 버튼 그리드 */}
        <Box w="100%">
          <Grid templateColumns="repeat(4, 1fr)" gap={2}>
            {["7", "8", "9", "/"].map((value) => (
              <Button key={value} onClick={() => handleButtonClick(value)}>
                {value}
              </Button>
            ))}
            {["4", "5", "6", "*"].map((value) => (
              <Button key={value} onClick={() => handleButtonClick(value)}>
                {value}
              </Button>
            ))}
            {["1", "2", "3", "-"].map((value) => (
              <Button key={value} onClick={() => handleButtonClick(value)}>
                {value}
              </Button>
            ))}
            {["0", ".", "=", "+"].map((value) => (
              <Button key={value} onClick={() => handleButtonClick(value)}>
                {value}
              </Button>
            ))}
            {/* "C" 버튼 클릭 시 입력과 결과 초기화 */}
            <Button onClick={() => handleButtonClick("C")} colSpan={4}>
              C
            </Button>
          </Grid>
        </Box>

        {/* 계산 내역 표시 */}
        <Box w="100%">
          <Heading size="md">Calculation History</Heading>
          {history.map((entry, index) => (
            <Text key={index}>
              {entry.input} = {entry.result}
            </Text>
          ))}
        </Box>
      </VStack>
    </Container>
  );
};

// Calculator 컴포넌트 내보내기
export default Calculator;
