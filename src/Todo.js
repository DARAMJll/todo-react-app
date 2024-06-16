import React from 'react';
import {
  Container,
  VStack,
  HStack,
  Box,
  Heading,
  Text,
  Input,
  Button,
  IconButton,
  Checkbox,
  Flex,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from "@chakra-ui/react";
import { DeleteIcon, StarIcon, ChevronDownIcon, SearchIcon } from "@chakra-ui/icons";
import ReactPaginate from 'react-paginate';
import './Todo.css';

class Todo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      items: [], // todo 항목들을 저장하는 상태
      newItem: { title: "", content: "", priority: 1 }, // 새로 추가될 항목의 상태
      pageCount: 0, // 페이지 수를 저장하는 상태
      currentPage: 0, // 현재 페이지를 저장하는 상태
      itemsPerPage: 10, // 한 페이지에 표시될 항목 수
      sortOrder: 'Date (Newest First)', // 기본 정렬 순서
      searchQuery: '', // 검색 쿼리 상태
    };
  }

  componentDidMount() {
    const savedItems = JSON.parse(localStorage.getItem('todoItems')) || []; // 로컬 스토리지에서 항목들 불러오기
    this.setState({
      items: this.sortItems(savedItems, 'Date (Newest First)'),
      pageCount: Math.ceil(savedItems.length / this.state.itemsPerPage)
    });
  }

  sortItems = (items, sortOrder) => {
    const sortedItems = [...items].sort((a, b) => {
      if (sortOrder === 'Priority') {
        return b.priority - a.priority; // 우선순위에 따른 정렬
      } else if (sortOrder === 'Date (Oldest First)') {
        return a.id - b.id; // 오래된 날짜 순 정렬
      } else {
        return b.id - a.id; // 최신 날짜 순 정렬
      }
    });
    return sortedItems;
  }

  handleAdd = () => {
    const newItem = { id: Date.now(), ...this.state.newItem, done: false, date: new Date().toISOString().split('T')[0] };
    const updatedItems = [newItem, ...this.state.items];
    this.setState((state) => ({
      items: this.sortItems(updatedItems, state.sortOrder),
      newItem: { title: "", content: "", priority: 1 },
      pageCount: Math.ceil(updatedItems.length / state.itemsPerPage)
    }));
    localStorage.setItem('todoItems', JSON.stringify(updatedItems)); // 로컬 스토리지에 저장
  };

  handleChange = (e) => {
    const { name, value } = e.target;
    this.setState((state) => ({
      newItem: { ...state.newItem, [name]: value },
    }));
  };

  handlePriorityChange = (value) => {
    this.setState((state) => ({
      newItem: { ...state.newItem, priority: value },
    }));
  };

  handleToggle = (id) => {
    const updatedItems = this.state.items.map((item) =>
      item.id === id ? { ...item, done: !item.done } : item
    );
    this.setState({ items: updatedItems });
    localStorage.setItem('todoItems', JSON.stringify(updatedItems)); // 로컬 스토리지에 저장
  };

  handleDelete = (id) => {
    const updatedItems = this.state.items.filter((item) => item.id !== id);
    this.setState((state) => ({
      items: this.sortItems(updatedItems, state.sortOrder),
      pageCount: Math.ceil(updatedItems.length / state.itemsPerPage)
    }));
    localStorage.setItem('todoItems', JSON.stringify(updatedItems)); // 로컬 스토리지에 저장
  };

  handlePageClick = (data) => {
    this.setState({ currentPage: data.selected });
  };

  handleSortChange = (sortValue) => {
    this.setState({ sortOrder: sortValue });
    const sortedItems = this.sortItems(this.state.items, sortValue);
    this.setState({ items: sortedItems });
  };

  handleSearch = (e) => {
    this.setState({ searchQuery: e.target.value });
  };

  renderStars = (priority) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <StarIcon
          key={i}
          color={i <= priority ? "yellow.400" : "gray.300"}
          className="star-icon"
        />
      );
    }
    return stars;
  }

  render() {
    const { items, currentPage, itemsPerPage, sortOrder, newItem, searchQuery } = this.state;
    const offset = currentPage * itemsPerPage;

    const filteredItems = items.filter(item => 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.content.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const currentItems = filteredItems.slice(offset, offset + itemsPerPage);

    return (
      <Container maxW="container.xl">
        <Flex direction={{ base: "column", md: "row" }} spacing={4}>
          <Box flex={1} p={4} boxShadow="md" borderWidth="1px">
            <Heading size="md" className="heading-spacing">New Todo</Heading>
            <VStack spacing={4}>
              <Input
                placeholder="제목"
                name="title"
                value={this.state.newItem.title}
                onChange={this.handleChange}
              />
              <Input
                placeholder="내용"
                name="content"
                value={this.state.newItem.content}
                onChange={this.handleChange}
                multiline
              />
              <Menu>
                <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
                  {this.renderStars(newItem.priority)}
                </MenuButton>
                <MenuList>
                  {[1, 2, 3, 4, 5].map((value) => (
                    <MenuItem key={value} onClick={() => this.handlePriorityChange(value)}>
                      {this.renderStars(value)}
                    </MenuItem>
                  ))}
                </MenuList>
              </Menu>
              <Button colorScheme="teal" onClick={this.handleAdd}>
                추가
              </Button>
            </VStack>
          </Box>
          <Box flex={2} p={4}>
            <Heading size="md" className="heading-spacing">✅Todo List</Heading>
            <Flex mb={4} align="center">
              <Input
                placeholder="제목 또는 내용 검색"
                value={searchQuery}
                onChange={this.handleSearch}
              />
              <IconButton
                icon={<SearchIcon />}
                aria-label="Search"
                ml={2}
              />
            </Flex>
            <Menu>
              <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
                {sortOrder}
              </MenuButton>
              <MenuList>
                <MenuItem onClick={() => this.handleSortChange('Date (Oldest First)')}>Date (Oldest First)</MenuItem>
                <MenuItem onClick={() => this.handleSortChange('Date (Newest First)')}>Date (Newest First)</MenuItem>
                <MenuItem onClick={() => this.handleSortChange('Priority')}>Priority</MenuItem>
              </MenuList>
            </Menu>
            <VStack spacing={4} mt={4}>
              {currentItems.map((item) => (
                <Box
                  key={item.id}
                  p={4}
                  boxShadow="md"
                  borderWidth="1px"
                  w="full"
                >
                  <HStack>
                    <Checkbox
                      isChecked={item.done}
                      onChange={() => this.handleToggle(item.id)}
                    />
                    <Box flex={1}>
                      <Text fontWeight="bold">{item.title}</Text>
                      <Text>{item.content}</Text>
                      <Box>
                        {this.renderStars(item.priority)}
                      </Box>
                    </Box>
                    <IconButton
                      icon={<DeleteIcon />}
                      onClick={() => this.handleDelete(item.id)}
                    />
                  </HStack>
                </Box>
              ))}
            </VStack>
            <ReactPaginate
              previousLabel={'<'}
              nextLabel={'>'}
              breakLabel={'...'}
              breakClassName={'break-me'}
              pageCount={this.state.pageCount}
              marginPagesDisplayed={2}
              pageRangeDisplayed={5}
              onPageChange={this.handlePageClick}
              containerClassName={'pagination'}
              activeClassName={'active'}
            />
          </Box>
        </Flex>
      </Container>
    );
  }
}

export default Todo;
