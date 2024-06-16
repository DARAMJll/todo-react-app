import React, { useState } from 'react';
import {
  Container,
  Box,
  Heading,
  Input,
  Button,
  Grid,
  VStack,
} from '@chakra-ui/react';
import { Pie, Bar } from 'react-chartjs-2';
import { Chart, ArcElement, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

// 차트에 필요한 컴포넌트 등록
Chart.register(ArcElement, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Portfolio = () => {
  // 상태 변수 정의
  const [stocks, setStocks] = useState([]); // 주식 목록
  const [name, setName] = useState(''); // 주식명
  const [value, setValue] = useState(''); // 주식 가치

  // 주식을 추가하는 함수
  const handleAddStock = () => {
    const newStock = { name, value: parseFloat(value) };
    setStocks([...stocks, newStock]); // 주식 목록에 새로운 주식 추가
    setName(''); // 입력 필드 초기화
    setValue(''); // 입력 필드 초기화
  };

  // 파이 차트 데이터 설정
  const pieData = {
    labels: stocks.map(stock => stock.name),
    datasets: [{
      data: stocks.map(stock => stock.value),
      backgroundColor: stocks.map(() => '#' + Math.floor(Math.random()*16777215).toString(16)), // 랜덤 색상 생성
    }],
  };

  // 바 차트 데이터 설정
  const barData = {
    labels: stocks.map(stock => stock.name),
    datasets: [{
      label: 'Stock Value',
      data: stocks.map(stock => stock.value),
      backgroundColor: 'rgba(75,192,192,0.6)',
    }],
  };

  return (
    <Container>
      <Heading as="h1" mb="4" size="lg">주식 포트폴리오📈</Heading>
      <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={6}>
        <VStack spacing={4}>
          <Input
            placeholder="주식명"
            value={name}
            onChange={(e) => setName(e.target.value)} // 주식명 입력 필드 변경 시 상태 업데이트
          />
          <Input
            placeholder="가치"
            type="number"
            value={value}
            onChange={(e) => setValue(e.target.value)} // 주식 가치 입력 필드 변경 시 상태 업데이트
          />
          <Button colorScheme="teal" onClick={handleAddStock} width="full">
            추가
          </Button>
        </VStack>
        <Box p={4} boxShadow="md" borderWidth="1px" borderRadius="md">
          <Pie data={pieData} /> {/* 파이 차트 렌더링 */}
        </Box>
      </Grid>
      <Box mt={6} p={4} boxShadow="md" borderWidth="1px" borderRadius="md">
        <Bar data={barData} /> {/* 바 차트 렌더링 */}
      </Box>
    </Container>
  );
};

export default Portfolio;
