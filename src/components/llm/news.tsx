/* eslint-disable @next/next/no-img-element */
"use client";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, } from "@/components/ui/carousel";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

interface Article {
  title: string;
  author: string;
  published_utc: string;
  article_url: string;
  image_url: string;
  description: string;
  tickers: string[];
}

export function NewsCarousel({ articles }: { articles: Article[] }) {
  return (
    <Carousel
      opts={{
        align: "start",
      }}
      className="w-full"
    >
      <CarouselContent className="flex space-x-4 p-4">
        {articles.map((article, index) => (
          <CarouselItem key={index} className="md:basis-1/2">
            <Card className="w-full h-full flex flex-col">
              <img
                className="w-full h-48 object-cover"
                src={article.image_url}
                alt={article.title}
              />
              <CardContent className="space-y-2 flex-grow pt-2">
                <h3 className="text-base font-semibold">{article.title}</h3>
                <p className="text-sm text-gray-600">by {article.author}</p>
                <p className="mt-2 text-sm line-clamp-4">
                  {article.description}
                </p>
              </CardContent>
              <CardFooter className="flex gap-2">
                {article.tickers.slice(0, 4).map((tickerName: string, index: number) => (
                  <Badge key={index}>{tickerName}</Badge>
                ))}
              </CardFooter>
              <CardFooter className="flex justify-between">
                <Link href={article.article_url} rel="noopener noreferrer" target="_blank">
                  <Button variant="outline">Read more</Button>
                </Link>
                <span className="text-sm">
                  {new Date(article.published_utc).toLocaleDateString()}
                </span>
              </CardFooter>
            </Card>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}
