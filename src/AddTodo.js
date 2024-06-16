import React from "react";
import {
  Input,
  Box,
  Button,
  Grid,
  GridItem,
  Flex,
  VStack,
} from "@chakra-ui/react";

// AddTodo 컴포넌트 클래스 정의
class AddTodo extends React.Component {
  constructor(props) {
    super(props);
    // 컴포넌트 상태 초기화
    this.state = { item: { title: "" } };
    // props에서 add 함수 가져오기
    this.add = props.add;
  }

  // Input 필드 변경 핸들러
  onInputChange = (e) => {
    const thisItem = this.state.item;
    thisItem.title = e.target.value;
    // 상태 업데이트
    this.setState({ item: thisItem });
  };

  // 버튼 클릭 핸들러
  onButtonClick = () => {
    // 부모 컴포넌트의 add 함수 호출
    this.add(this.state.item);
    // 입력 필드 초기화
    this.setState({ item: { title: "" } });
  };

  // 엔터 키 입력 핸들러
  enterKeyEventHandler = (e) => {
    if (e.key === "Enter") {
      this.onButtonClick();
    }
  };

  render() {
    return (
      // Todo 입력 박스
      <Box p="4" boxShadow="md" borderWidth="1px">
        {/* 그리드 레이아웃 사용 */}
        <Grid templateColumns="repeat(12, 1fr)" gap={4}>
          {/* 입력 필드 */}
          <GridItem colSpan={11}>
            <Input
              placeholder="Add Todo here"
              value={this.state.item.title}
              onChange={this.onInputChange}
              onKeyPress={this.enterKeyEventHandler}
            />
          </GridItem>
          {/* 추가 버튼 */}
          <GridItem colSpan={1}>
            <Button colorScheme="teal" onClick={this.onButtonClick}>
              +
            </Button>
          </GridItem>
        </Grid>
      </Box>
    );
  }
}

export default AddTodo;
