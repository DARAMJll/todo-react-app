import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box,
  Container,
  Heading,
  VStack,
  Text,
  Link,
  Image,
  Spinner,
  Grid,
} from '@chakra-ui/react';
import './News.css';

// News 컴포넌트 정의
const News = () => {
  // 상태 변수 정의
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 컴포넌트 마운트 시 뉴스 데이터를 가져오는 함수 실행
  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await axios.get('https://newsapi.org/v2/top-headlines', {
          params: {
            language: 'ko',
            apiKey: '40f71efc163d4c849ed7475b1f677f72', // 여기에 자신의 API 키를 입력하세요
          },
        });
        setArticles(response.data.articles); // 가져온 뉴스 데이터를 상태에 저장
      } catch (error) {
        setError('Error fetching news'); // 에러 발생 시 에러 메시지 저장
      } finally {
        setLoading(false); // 로딩 상태 해제
      }
    };

    fetchNews(); // 뉴스 데이터 가져오기 함수 호출
  }, []);

  // 로딩 상태 시 스피너 표시
  if (loading) return <Spinner size="xl" />;
  // 에러 발생 시 에러 메시지 표시
  if (error) return <Box>{error}</Box>;

  // 뉴스 기사 분류
  const mainArticle = articles[0]; // 메인 기사
  const secondaryArticles = articles.slice(1, 4); // 두 번째로 중요한 기사
  const recentArticles = articles.slice(4, 10); // 최근 뉴스 기사

  return (
    <Container className="news-container">
      <Grid templateColumns="1fr 3fr" gap={10}>
        <Box>
          <Heading as="h2" size="md" mb={4}>
            Recent News
          </Heading>
          <VStack align="stretch" spacing={4}>
            {recentArticles.map((article, index) => (
              <Box key={index}>
                <Text fontSize="sm">{new Date(article.publishedAt).toLocaleTimeString()}</Text>
                <Link href={article.url} isExternal color="teal.500" fontSize="sm">
                  {article.title}
                </Link>
              </Box>
            ))}
          </VStack>
        </Box>
        <Box>
          <Heading as="h1" size="xl" mb={6} textAlign="center">
            Main News
          </Heading>
          {mainArticle && (
            <Box mb={10} p={5} shadow="md" borderWidth="1px" borderRadius="md">
              {mainArticle.urlToImage && (
                <Image src={mainArticle.urlToImage} alt={mainArticle.title} mb={4} />
              )}
              <Box>
                <Link href={mainArticle.url} isExternal>
                  <Heading as="h2" size="md" mb={4}>
                    {mainArticle.title}
                  </Heading>
                </Link>
                <Text noOfLines={3} fontSize="sm">
                  {mainArticle.description}
                </Text>
              </Box>
            </Box>
          )}
          <Grid className="secondary-articles">
            {secondaryArticles.map((article, index) => (
              <Box key={index} className="secondary-article" p={5} shadow="md" borderWidth="1px" borderRadius="md">
                {article.urlToImage && (
                  <Image src={article.urlToImage} alt={article.title} mb={4} className="secondary-article-image" />
                )}
                <Box className="secondary-article-content">
                  <Link href={article.url} isExternal>
                    <Heading as="h3" size="sm" mb={2}>
                      {article.title}
                    </Heading>
                  </Link>
                  <Text noOfLines={3} color="gray.500" fontSize="xs">
                    {article.description}
                  </Text>
                </Box>
              </Box>
            ))}
          </Grid>
        </Box>
      </Grid>
    </Container>
  );
};

export default News;
