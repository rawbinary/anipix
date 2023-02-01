"use client";

import Button from "@/components/Button";
import Image from "next/image";
import { useState } from "react";

type AnimeQuote = {
  quote: string;
  character: string;
  anime: string;
};

export default function Home() {
  const [quote, setQuote] = useState("None.");
  const [imgBlob, setImgBlob] = useState<Blob>();
  const [imgPath, setImgPath] = useState(
    "https://via.placeholder.com/800x600.png?text=Original+Anime+Image"
  );
  const [finalPath, setFinalPath] = useState(
    "https://via.placeholder.com/800x600.png?text=Generated+Anime+Image"
  );

  const refreshImage = async () => {
    const resp = await fetch("/api/image?width=800&height=600");
    if (!resp.ok) return alert("Unable to fetch image.");
    const respBlob = await resp.blob();
    setImgPath(URL.createObjectURL(respBlob));
    setImgBlob(respBlob);
  };

  const refreshQuote = async () => {
    const resp = await fetch("/api/quote");
    if (!resp.ok) return alert("Unable to fetch Quote.");
    const quoteData = (await resp.json()) as AnimeQuote;
    setQuote(quoteData.quote);
  };

  const generateImage = async () => {
    if (!imgBlob)
      return alert("No image fetched to generate on. Refresh Image first.");

    const formData = new FormData();
    formData.append("quote", quote);
    formData.append(
      "image",
      new File([imgBlob], "original.png", {
        type: "image/png",
      })
    );
    // formData.append(
    //   "testBlob",
    //   new File([new Blob(["Hello Worl🤣 d!\n"])], "original.txt")
    // );

    const resp = await fetch("/api/generate?width=800&height=600", {
      method: "POST",
      body: formData,
    });

    if (!resp.ok)
      return alert("Unable to generate image. Please try again later.");

    const respBlob = await resp.blob();
    setFinalPath(URL.createObjectURL(respBlob));
  };

  return (
    <main className="flex flex-col items-center justify-center pt-3 transition-all duration-100">
      <div className="container flex flex-col items-center justify-center gap-6 px-4 py-5 ">
        <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
          <span className="text-[hsl(305,100%,56%)]">Ani</span>Pix
        </h1>
        <div className="mt-5 flex gap-5">
          <Button className="w-[10rem]" onClick={() => refreshImage()}>
            Refresh Image
          </Button>
          <Button className="w-[10rem]" onClick={() => refreshQuote()}>
            Refresh Quote
          </Button>
          <Button className="w-[10rem]" onClick={() => generateImage()}>
            Generate Image
          </Button>
        </div>
        <div className="border rounded py-1 w-full text-center border-stone-500">
          <h1 className="text-2xl underline">Quote:</h1>
          <h2 className="mt-3 mb-3 text-3xl italic">{quote}</h2>
        </div>
        <div className="flex flex-row gap-5 w-full">
          <div className="w-1/2 border border-stone-500">
            <Image
              width={800}
              height={600}
              alt="Original Anime Image"
              src={imgPath}
            />
          </div>
          <div className="w-1/2 border border-stone-500">
            <Image
              alt="Generated Anime Image"
              width={800}
              height={600}
              src={finalPath}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
