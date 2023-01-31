import type { NextApiRequest, NextApiResponse } from "next";

import sharp from "sharp";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Buffer>
) {
  const resp = await fetch("https://pic.re/image", {
    method: "GET",
  });

  if (!resp.ok) {
    return res.status(500);
  }

  const imgBuffer = await processImage(
    Buffer.from(await resp.arrayBuffer()),
    parseInt(req.query["width"] as string) || 800,
    parseInt(req.query["height"] as string) || 800
  );

  const respType = resp.headers.get("content-type") || "image/png";
  return res.setHeader("content-type", respType).send(imgBuffer);
}

function processImage(imgBuffer: Buffer, width: number, height: number) {
  return sharp(imgBuffer).resize(width, height).toBuffer();
}
