import { JSDOM } from "jsdom";

type TextDetails = {
  text: string;
  width: number;
  height: number;
};

function createSVGtext(textArgs: Omit<TextDetails, "width">) {
  const dom = new JSDOM();

  const document = dom.window.document;

  const MAXIMUM_CHARS_PER_LINE = 20;
  const LINE_HEIGHT = 60;

  const words = textArgs.text.split(" ");
  let line = "";

  const x = "50%";
  let y =
    textArgs.height / 2 -
    ((textArgs.text.length / MAXIMUM_CHARS_PER_LINE) * LINE_HEIGHT) / 2;

  const svgText = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "text"
  );
  svgText.setAttributeNS(null, "x", x);
  svgText.setAttributeNS(null, "y", y.toString());
  // svgText.setAttributeNS(null, "font-size", 60);
  // svgText.setAttributeNS(null, "fill", "#FFFFFF"); //  White text
  svgText.setAttributeNS(null, "text-anchor", "middle"); //  Center the text
  svgText.setAttributeNS(null, "class", "text");

  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + " ";
    if (testLine.length > MAXIMUM_CHARS_PER_LINE) {
      //  Add a new <tspan> element
      const svgTSpan = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "tspan"
      );
      svgTSpan.setAttributeNS(null, "x", x);
      svgTSpan.setAttributeNS(null, "y", y.toString());
      // svgTSpan.setAttributeNS(null, "class", "text");
      // svgTSpan.setAttributeNS(null, "font-family", "Comic Sans MS");

      const tSpanTextNode = document.createTextNode(line);
      svgTSpan.appendChild(tSpanTextNode);
      svgText.appendChild(svgTSpan);

      line = words[n] + " ";
      y += LINE_HEIGHT;
    } else {
      line = testLine;
    }
  }

  const svgTSpan = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "tspan"
  );
  svgTSpan.setAttributeNS(null, "x", x);
  svgTSpan.setAttributeNS(null, "y", y.toString());

  const tSpanTextNode = document.createTextNode(line);
  svgTSpan.appendChild(tSpanTextNode);

  svgText.appendChild(svgTSpan);

  return svgText;
}

export function createSVGTextBuffer(textArgs: TextDetails) {
  return Buffer.from(`
    <svg xmlns="http://www.w3.org/2000/svg" width="${textArgs.width}" height="${
    textArgs.height
  }">
    <style>
      .text {
        font-size: 48px;
        font-weight: 800;
        fill: #fff;
        background-color: #000;
        stroke: #000;
        stroke-miterlimit: 10;
        stroke-width: 1px;
        font-family: 'Righteous', cursive;
      }
    </style>
    ${createSVGtext(textArgs).outerHTML}
</svg>
    `);
}
