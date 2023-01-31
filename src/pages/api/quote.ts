// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

// I know this is not a good way of doing things, but this is a faster way.
// might change later to a better way of loading quotes.
import quotesData from "../../utils/quotes.json";

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<AnimeQuote>
) {
  res.status(200).json(fetchQuote());
}

function fetchQuote(): AnimeQuote {
  let selectedQuote = quotesData[Math.floor(Math.random() * quotesData.length)];
  if (selectedQuote.quote.split(" ").length > 20) return fetchQuote();
  return selectedQuote;
}

type AnimeQuote = {
  quote: string;
  character: string;
  anime: string;
};
