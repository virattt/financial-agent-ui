import { Card, Title, Text, Flex } from "@tremor/react";

interface Article {
  id: string;
  publisher: object;
  title: string;
  author: string;
  published_utc: string;
  article_url: string;
  tickers: string[];
  amp_url?: string;
  image_url: string;
  description: string;
  keywords: string[];
}

interface NewsCardProps {
  article: Article;
}

const NewsCard = ({ article }: NewsCardProps) => {
  return (
    <Card className="px-4 mb-4 w-44 h-full flex-shrink-0">
      <img
        src={article.image_url}
        alt={article.title}
        className="w-full h-40 object-cover mb-4"
      />
      <Title className="text-lg mb-2 line-clamp-2">{article.title}</Title>
      <Text className="text-gray-500 mb-2 line-clamp-3">
        {article.description}
      </Text>
      <a href={article.article_url} className="text-blue-500 hover:underline">
        Read more
      </a>
    </Card>
  );
};

interface NewsListProps {
  articles: Article[];
}

export const NewsList = ({ articles }: NewsListProps) => {
  return (
    <Flex className="overflow-x-auto">
      {articles.map((article) => (
        <NewsCard key={article.id} article={article} />
      ))}
    </Flex>
  );
};
