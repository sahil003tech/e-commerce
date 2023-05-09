import multiParty from "multiparty";

export default async function handle(req, res) {
  const form = new multiParty.Form();
  form.parse(req, (err, fields, files) => {});
  console.log("length", files.file.length);
}

export const config = {
  api: { bodyParser: false },
};
