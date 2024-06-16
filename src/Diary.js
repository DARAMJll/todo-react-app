import React, { useState, useEffect } from 'react';
import {
  Container,
  Heading,
  VStack,
  Input,
  Textarea,
  Button,
  Box,
  Select,
  Text,
  HStack,
  IconButton,
  Flex,
} from '@chakra-ui/react';
import { DeleteIcon, SearchIcon } from '@chakra-ui/icons';
import ReactPaginate from 'react-paginate';
import './Diary.css';

// Diary 컴포넌트 정의
const Diary = () => {
  // 상태 정의
  const [date, setDate] = useState(''); // 일기 날짜
  const [mood, setMood] = useState(''); // 기분
  const [content, setContent] = useState(''); // 일기 내용
  const [entries, setEntries] = useState([]); // 모든 일기 항목
  const [pageCount, setPageCount] = useState(0); // 총 페이지 수
  const [currentPage, setCurrentPage] = useState(0); // 현재 페이지 번호
  const [sortOrder, setSortOrder] = useState('desc'); // 정렬 순서 (오름차순, 내림차순)
  const [searchDate, setSearchDate] = useState(''); // 검색 날짜
  const [searchKeyword, setSearchKeyword] = useState(''); // 검색 키워드
  const itemsPerPage = 10; // 페이지당 항목 수

  // 컴포넌트 마운트 시 로컬 스토리지에서 일기 항목 불러오기
  useEffect(() => {
    const savedEntries = JSON.parse(localStorage.getItem('diaryEntries')) || [];
    setEntries(savedEntries);
    setPageCount(Math.ceil(savedEntries.length / itemsPerPage));
  }, []);

  // 일기 저장 함수
  const handleSave = () => {
    if (!date || !content) {
      alert('날짜와 내용을 입력해주세요.');
      return;
    }

    const newEntry = { date, mood, content };
    const updatedEntries = [newEntry, ...entries];

    setEntries(updatedEntries);
    localStorage.setItem('diaryEntries', JSON.stringify(updatedEntries));
    setPageCount(Math.ceil(updatedEntries.length / itemsPerPage));

    setDate('');
    setMood('');
    setContent('');
  };

  // 일기 삭제 함수
  const handleDelete = (index) => {
    const updatedEntries = entries.filter((entry, i) => i !== index);
    setEntries(updatedEntries);
    localStorage.setItem('diaryEntries', JSON.stringify(updatedEntries));
    setPageCount(Math.ceil(updatedEntries.length / itemsPerPage));
  };

  // 페이지 변경 핸들러
  const handlePageClick = (data) => {
    setCurrentPage(data.selected);
  };

  // 정렬 순서 변경 핸들러
  const handleSortChange = (event) => {
    setSortOrder(event.target.value);
    const sortedEntries = [...entries].sort((a, b) => {
      if (event.target.value === 'asc') {
        return new Date(a.date) - new Date(b.date);
      } else {
        return new Date(b.date) - new Date(a.date);
      }
    });
    setEntries(sortedEntries);
  };

  // 검색 날짜 변경 핸들러
  const handleSearchDateChange = (e) => {
    setSearchDate(e.target.value);
  };

  // 검색 키워드 변경 핸들러
  const handleSearchKeywordChange = (e) => {
    setSearchKeyword(e.target.value);
  };

  // 검색 조건에 맞는 일기 항목 필터링
  const filteredEntries = entries.filter(entry => {
    const isDateMatch = searchDate ? entry.date === searchDate : true;
    const isKeywordMatch = searchKeyword
      ? entry.mood.includes(searchKeyword) || entry.content.includes(searchKeyword)
      : true;
    return isDateMatch && isKeywordMatch;
  });

  // 현재 페이지에 표시할 일기 항목 계산
  const offset = currentPage * itemsPerPage;
  const currentEntries = filteredEntries.slice(offset, offset + itemsPerPage);

  return (
    <Container maxW="container.xl">
      <Heading as="h1" mb="4" size="lg">
        오늘 하루 기록📝
      </Heading>
      <VStack spacing="4" p="4" boxShadow="md" borderWidth="1px">
        {/* 날짜 입력 */}
        <Input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          placeholder="날짜"
        />
        {/* 기분 입력 */}
        <Input
          value={mood}
          onChange={(e) => setMood(e.target.value)}
          placeholder="기분"
        />
        {/* 일기 내용 입력 */}
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="내용"
          rows={5}
        />
        {/* 저장 버튼 */}
        <Button onClick={handleSave} colorScheme="teal" width="full">
          저장하기
        </Button>
      </VStack>
      <Box mt="4">
        <Heading as="h2" size="md" mb="4">
          일기장
        </Heading>
        {/* 검색 및 정렬 필터 */}
        <Flex mb="4" align="center" width="full">
          <IconButton
            icon={<SearchIcon />}
            aria-label="Search"
            mr={2}
          />
          <Input
            type="date"
            value={searchDate}
            onChange={handleSearchDateChange}
            placeholder="날짜 검색"
            width="30%"
            mr="2"
          />
          <Input
            placeholder="기분 또는 내용 검색"
            value={searchKeyword}
            onChange={handleSearchKeywordChange}
            width="68%"
          />
        </Flex>
        {/* 정렬 순서 선택 */}
        <Select value={sortOrder} onChange={handleSortChange} width="full">
          <option value="asc">과거 날짜 순</option>
          <option value="desc">최근 날짜 순</option>
        </Select>
        {/* 일기 항목 목록 */}
        {currentEntries.map((entry, index) => (
          <HStack key={index} align="start" spacing="4" mt="4">
            <Box>
              <Text fontWeight="bold">{entry.date} - {entry.mood}</Text>
              <Text>{entry.content}</Text>
            </Box>
            <IconButton
              icon={<DeleteIcon />}
              onClick={() => handleDelete(offset + index)}
            />
          </HStack>
        ))}
        {/* 페이지네이션 */}
        <ReactPaginate
          previousLabel={'<'}
          nextLabel={'>'}
          breakLabel={'...'}
          breakClassName={'break-me'}
          pageCount={pageCount}
          marginPagesDisplayed={2}
          pageRangeDisplayed={5}
          onPageChange={handlePageClick}
          containerClassName={'pagination'}
          activeClassName={'active'}
        />
      </Box>
    </Container>
  );
};

export default Diary;
