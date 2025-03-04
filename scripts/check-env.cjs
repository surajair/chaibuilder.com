const fs = require("fs");
const path = require("path");

// Read .env.sample and .env files
const sampleEnvPath = path.resolve(process.cwd(), ".env.sample");
const envPath = path.resolve(process.cwd(), ".env");

const delimiter = "\n" + "-".repeat(48) + "\n";

try {
  const sampleEnvContent = fs.readFileSync(sampleEnvPath, "utf8");
  const envContent = fs.readFileSync(envPath, "utf8");

  // Extract variables and their comments from .env.sample
  const sampleVarsWithComments = sampleEnvContent
    .split("\n")
    .filter((line) => line.trim() && !line.startsWith("#"))
    .map((line) => {
      const [varPart, ...commentParts] = line.split("#");
      const [key] = varPart.split("=");
      return {
        key: key.trim(),
        comment: commentParts.join("#").trim(), // Join in case comment contains #
      };
    });

  // Extract variables from .env
  const envVars = envContent
    .split("\n")
    .filter((line) => line.trim() && !line.startsWith("#"))
    .reduce((acc, line) => {
      const [key, ...valueParts] = line.split("=");
      // Join value parts in case the value contains = characters
      const value = valueParts.join("=");
      // Remove any comments from the value
      const valueWithoutComments = value.split("#")[0].trim();
      acc[key.trim()] = valueWithoutComments;
      return acc;
    }, {});

  // Check for missing or empty variables
  const missingVars = [];
  const emptyVars = [];
  const extraVars = [];

  // Check for missing and empty vars from .env.sample
  sampleVarsWithComments.forEach(({ key, comment }) => {
    if (!(key in envVars)) {
      missingVars.push({ key, comment });
    } else if (!envVars[key] || envVars[key].length === 0) {
      emptyVars.push({ key, comment });
    }
  });

  // Check for extra vars in .env that are not in .env.sample
  const sampleVarKeys = sampleVarsWithComments.map(({ key }) => key);
  Object.keys(envVars).forEach((key) => {
    if (!sampleVarKeys.includes(key)) {
      extraVars.push(key);
    }
  });

  console.log(delimiter);

  const hasErrors = missingVars.length > 0 || emptyVars.length > 0;

  if (hasErrors) {
    console.error(
      "\x1b[31m%s\x1b[0m",
      "❌ Environment variables check failed!"
    );
  } else {
    console.log(
      "\x1b[32m%s\x1b[0m",
      "✅ All defined environment variables are properly set!"
    );
  }

  if (missingVars.length > 0) {
    console.error("\nMissing variables in .env file:");
    missingVars.forEach(({ key, comment }) =>
      console.error(`  - ${key}${comment ? `\n\t${comment}` : ""}`)
    );
  }

  if (emptyVars.length > 0) {
    console.error("\nEmpty variables in .env file:");
    emptyVars.forEach(({ key, comment }) =>
      console.error(`  - ${key}${comment ? `\n\t${comment}` : ""}`)
    );
  }

  // if (extraVars.length > 0) {
  //   console.log(
  //     "\n\x1b[33m%s\x1b[0m",
  //     "ℹ️  Additional variables found in .env:"
  //   );
  //   extraVars.forEach((key) => console.log(`  - ${key}`));
  //   console.log(
  //     "\x1b[33m%s\x1b[0m",
  //     "\nADD THEM TO .env.sample SO COLLEAGUES ARE WARNED THEY ARE MISSING FROM THEIR .env FILE."
  //   );
  // }

  console.log(delimiter);

  if (hasErrors) {
    console.error(
      "\nPlease check your .env.sample file and update your .env file accordingly."
    );
    process.exit(1);
  }
} catch (error) {
  if (error.code === "ENOENT") {
    console.error("\x1b[31m%s\x1b[0m", "❌ Error: Missing required files!");
    if (!fs.existsSync(sampleEnvPath)) {
      console.error("  - .env.sample file not found");
    }
    if (!fs.existsSync(envPath)) {
      console.error("  - .env file not found");
    }
  } else {
    console.error("An error occurred:", error);
  }
  process.exit(1);
}
