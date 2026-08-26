const { MongoClient } = require("mongodb");

const uri = process.env.MONGODB_URI;

console.log("URI loaded:", !!uri);
console.log(
  "URI host:",
  uri?.match(/@([^/?]+)/)?.[1] || "NOT FOUND"
);

const client = new MongoClient(uri, {
  serverSelectionTimeoutMS: 10000,
  connectTimeoutMS: 10000,
  tls: true,
});

async function test() {
  try {
    console.log("Connecting...");
    await client.connect();

    console.log("✅ Connected!");

    const result = await client.db("admin").command({ ping: 1 });
    console.log("✅ Ping:", result);
  } catch (error) {
    console.error("❌ Error:", error);
    console.error("\nNAME:", error.name);
    console.error("MESSAGE:", error.message);
    console.error("CAUSE:", error.cause);
  } finally {
    await client.close().catch(() => {});
  }
}

test();