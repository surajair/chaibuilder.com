const { exec } = require("child_process");

const tailwindConfigPath = "./tailwind.config.ts"; // Adjust if your config is in a different location
const outputCssPath = "./app/(public)/globals.css"; // Tailwind input CSS file
const publicCssPath = "./public/chaistyles.css"; // Final output location

const generateTailwindCss = () => {
  console.log("Generating Tailwind CSS...");
  exec(
    `npx tailwindcss -c ${tailwindConfigPath} -i "${outputCssPath}" -o "${publicCssPath}" --minify`,
    (err, stdout, stderr) => {
      if (err) {
        console.error("Error generating Tailwind CSS:", stderr);
        return;
      }
      console.log(stdout);
      console.log("Copying CSS to public folder...");
      console.log("CSS generation and copy complete!");
    }
  );
};

generateTailwindCss();
