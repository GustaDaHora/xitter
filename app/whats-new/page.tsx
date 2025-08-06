import fs from "fs";
import path from "path";

interface Update {
  date: string;
  updates: string[];
}

const WhatsNewPage = () => {
  const filePath = path.join(process.cwd(), "updates.json");
  const fileContents = fs.readFileSync(filePath, "utf8");
  const updates: Update[] = JSON.parse(fileContents);

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">What&apos;s New?</h1>
      {updates.map((update, index) => (
        <div key={index} className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">{update.date}</h2>
          <ul className="list-disc list-inside space-y-2">
            {update.updates.map((item, itemIndex) => (
              <li key={itemIndex}>{item}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default WhatsNewPage;
