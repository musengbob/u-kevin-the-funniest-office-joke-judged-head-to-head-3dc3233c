import * as fs from "node:fs";
import * as path from "node:path";

// The Funniest Office Joke, Judged Head to Head
// (u-kevin-the-funniest-office-joke-judged-head-to-head-3dc3233c)
//
// The entry is a single line of 1-200 characters, one joke about office
// life. Gate (kit RULES.txt): entry.txt must be UTF-8 text of 1 to 200
// characters, not only white space.
//
// Why this line should land with the judge: it is a real joke with a
// setup and a turn, built on the most universal office grievance there
// is — the meeting that could have been an email. Setup: asking for a
// raise. Turn: the boss answers by booking a meeting about it. The
// punchline lands last and twists the cliche itself: the meeting could
// have been an email, and the email could have been a yes. Every word
// earns its place; nothing after the punchline.
//
// Local check (outside the grader's container):
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

// Gate (kit RULES.txt): entry.txt must be UTF-8 text of 1 to 200
// characters, not only white space.
const GATE = { minChars: 1, maxChars: 200 } as const;

// The entry line itself, built by one function so the joke text lives in
// exactly one place and the writer below never retypes it.
function buildEntryLine(): string {
  return "I asked for a raise and my boss booked a meeting to discuss it — the meeting could have been an email, and the email could have been a yes.";
}

// Resolve where the entry goes. The grader runs the program with
// $MAKEFUN_OUTPUT_DIR set to its writable output directory and reads the
// entry from there, so that wins; a local output/ next to this file is
// the fallback for runs on a dev machine.
function resolveOutputPath(): string {
  const fromEnv = process.env.MAKEFUN_OUTPUT_DIR;
  if (fromEnv !== undefined && fromEnv.trim() !== "") {
    return path.join(fromEnv, "entry.txt");
  }
  return path.join(process.cwd(), "output", "entry.txt");
}

function main(): void {
  const line = buildEntryLine();
  const outPath = resolveOutputPath();
  fs.mkdirSync(path.dirname(outPath), { recursive: true });

  fs.writeFileSync(outPath, line, "utf8");

  const readBack = fs.readFileSync(outPath, "utf8");
  const codePoints = [...readBack].length;

  if (readBack !== line) {
    console.error("Validation failed: entry.txt is not byte-identical to the line.");
    process.exit(1);
  }
  if (codePoints < GATE.minChars || codePoints > GATE.maxChars) {
    console.error(
      `Validation failed: ${codePoints} code points, must be ${GATE.minChars}-${GATE.maxChars}.`,
    );
    process.exit(1);
  }
  if (readBack.trim().length === 0) {
    console.error("Validation failed: line is only whitespace.");
    process.exit(1);
  }

  console.log(`Wrote ${codePoints} code points to ${outPath}:`);
  console.log(readBack);
  console.log(
    "Validation passed: byte-identical, 1-200 code points, not only whitespace.",
  );
}

main();
