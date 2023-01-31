import type { NextApiRequest, NextApiResponse } from "next";

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

  const respType = resp.headers.get("content-type") || "image/png";

  return res
    .setHeader("content-type", respType)
    .send(Buffer.from(await resp.arrayBuffer()));
}
