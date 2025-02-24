// import dotenv
import "dotenv/config";

export default async function (eleventyConfig) {
  // avoid processing and watching files
  eleventyConfig.ignores.add("./src/assets/**/*");
  eleventyConfig.watchIgnores.add("./src/assets/**/*");

  // make sure files are physically copied with --serve
  eleventyConfig.setServerPassthroughCopyBehavior("copy");

  // copy files
  eleventyConfig.addPassthroughCopy("./src/assets/fonts");
  eleventyConfig.addPassthroughCopy("./src/assets/img");

  // Eleventy dev server config
  eleventyConfig.setServerOptions({
    port: 3000,
    watch: ["./dist/assets/css/**/*.css", "./dist/assets/js/**/*.js"],
  });
}

export const config = {
  dir: {
    input: "src",
    output: "dist",
  },
};
