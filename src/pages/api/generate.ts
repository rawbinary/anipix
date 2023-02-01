import handleParser, { FormFile } from "@/utils/handleParser";
import { createSVGTextBuffer } from "@/utils/svg";
import type { NextApiRequest, NextApiResponse } from "next";

import sharp from "sharp";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Buffer>
) {
  if (req.method !== "POST") return res.status(405);

  const data = await handleParser(req);

  if (!data) return res.status(400).end();

  if (!data["quote"]) return res.status(400).end();

  const files = data.files as [FormFile];
  if (!files || files.length != 1) return res.status(400).end();

  const imgBuffer = await processImage(
    files[0].data,
    data["quote"] as string,
    parseInt(req.query["width"] as string) || 800,
    parseInt(req.query["height"] as string) || 800,
    !!req.query["blur"]
  );

  return res.setHeader("content-type", "image/png").send(imgBuffer);
}

function processImage(
  imgBuffer: Buffer,
  quote: string,
  width: number,
  height: number,
  blur: boolean = false
) {
  const quoteSvgBuffer = createSVGTextBuffer({
    text: quote,
    width,
    height,
  });

  const quoteImg: Compositable = {
    input: quoteSvgBuffer,
  };
  let img = sharp(imgBuffer).resize(width, height);
  if (blur) img = img.blur(5);

  return img.composite([quoteImg]).png().toBuffer();
}

export const config = {
  api: {
    bodyParser: false,
  },
};

type Compositable = {
  input: Buffer;
  top?: number;
  left?: number;
};
