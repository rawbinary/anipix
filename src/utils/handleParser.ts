import { NextApiRequest } from "next";

export default function handleParser(req: NextApiRequest) {
  // required to properly parse binary
  req.setEncoding("latin1");

  const type = req.headers["content-type"];
  if (!type) return null;

  const types = type.split(";").map((x) => x.trim());

  // extracting boundary from content-type header,
  // which separates every form-data item
  const boundaryStart = "boundary=";
  let boundary = types.find((x) => x.startsWith(boundaryStart));
  if (!boundary) return null;

  boundary = boundary.slice(boundaryStart.length).trim();
  if (!boundary) return null;

  let rawData = "";
  const formData: Record<string, string | [FormFile]> = {};

  return new Promise<Record<string, string | [FormFile]>>((resolve, reject) => {
    req.on("data", (chunk) => {
      rawData += chunk;
    });

    req.on("end", () => {
      // spliting through boundary, which gives every form data item
      for (const itm of rawData.split(boundary as string)) {
        let key = /(?:name=")(.+?)(?:")/.exec(itm)?.[1];
        if (!key || !(key = key.trim())) continue;

        let value = /(?:\r\n\r\n)([\S\s]*)(?:\r\n--$)/.exec(itm)?.[1];
        if (!value) continue;

        const bufferValue = Buffer.from(value, "latin1");

        let filename = /(?:filename=")(.*?)(?:")/.exec(itm)?.[1];
        if (filename && (filename = filename.trim())) {
          const file: FormFile = {
            data: bufferValue,
            filename,
          };
          let contentType = /(?:Content-Type:)(.*?)(?:\r\n)/.exec(itm)?.[1];
          if (contentType && (contentType = contentType.trim())) {
            file["content-type"] = contentType;
          }
          if (!formData.files) formData.files = [file];
          else (formData.files as [FormFile]).push(file);
        } else {
          formData[key] = value;
        }
      }

      resolve(formData);
    });
  });
}

export type FormFile = {
  filename: string;
  data: Buffer;
  "content-type"?: string;
};
