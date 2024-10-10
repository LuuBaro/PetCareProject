import React from "react";  
import ArticleItem from "./ArticleItem";  

const articles = [  
  {  
    image: "/src/assets/artical1.png",  
    title: "Lorem ipsum dolor sit amet",  
    content: " Lorem ipsum dolor, sit amet consectetur adipisicing elit. Accusantium asperiores, voluptate sunt incidunt dolore in vero facere velit? Necessitatibus, et minus! Ratione similique officiis possimus libero quo dolorum repellat officia.",  
    author: "Duyen Tran",  
    authorImage: "/src/assets/author1.png"  
  },  
  {  
    image: "/src/assets/artical3.png",  
    title: "Consectetur adipiscing elit",  
    content: " Lorem ipsum dolor, sit amet consectetur adipisicing elit. Accusantium asperiores, voluptate sunt incidunt dolore in vero facere velit? Necessitatibus, et minus! Ratione similique officiis possimus libero quo dolorum repellat officia.",  
    author: "Duyen Tran",  
    authorImage: "/src/assets/author2.png"  
  },  
  {  
    image: "/src/assets/artical1.png",  
    title: "Dolor sit amet",  
    content: " Lorem ipsum dolor, sit amet consectetur adipisicing elit. Accusantium asperiores, voluptate sunt incidunt dolore in vero facere velit? Necessitatibus, et minus! Ratione similique officiis possimus libero quo dolorum repellat officia.",  
    author: "Duyen Tran",  
    authorImage: "/src/assets/author3.png"  
  }  
];  

export default function Article() {  
  return (  
    <>  
      <div>
      <div className="mx-32 text-2xl text-center font-bold py-1 clip-path-parallelogram bg-[#00b7c0] w-44">Tin tức</div>
      <div className="mx-32 grid grid-cols-3 gap-6">  
        {articles.map((article, index) => (  
          <ArticleItem  
            key={index}  
            image={article.image}  
            title={article.title}  
            content={article.content}  
            author={article.author}  
            authorImage={article.authorImage}  
          />  
        ))}  
      </div>  
      </div>
    </>  
  );  
}