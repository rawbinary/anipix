import handleParser, { FormFile } from "@/utils/handleParser";
import type { NextApiRequest, NextApiResponse } from "next";

import sharp from "sharp";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Buffer>
) {
  if (req.method !== "POST") return res.status(405);

  const data = await handleParser(req);

  if (!data) return res.status(405).end();

  const files = data.files as [FormFile];

  const imgBuffer = await processImage(
    files[0].data,
    parseInt(req.query["width"] as string) || 800,
    parseInt(req.query["height"] as string) || 800,
    !!req.query["blur"]
  );

  return res.setHeader("content-type", "image/png").send(imgBuffer);
}

function processImage(
  imgBuffer: Buffer,
  width: number,
  height: number,
  blur: boolean = false
) {
  let img = sharp(imgBuffer).resize(width, height);

  if (blur) img = img.blur();

  return img.png().toBuffer();
}

export const config = {
  api: {
    bodyParser: false,
  },
};
