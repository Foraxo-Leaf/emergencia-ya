
// This script is deprecated and no longer needed.
// The educational content is now managed via a local JSON file (`src/lib/data/educationData.json`)
// and is no longer synced with Firestore.
// Keeping this file empty with a comment to prevent accidental execution and to clarify its status.

async function main() {
    console.log("This script is deprecated.");
    console.log("Educational content is now hardcoded in the application via a JSON file.");
    console.log("No action is required from this script.");
}

main().then(() => {
  process.exit(0);
}).catch((err) => {
  console.error(err);
  process.exit(1);
});
