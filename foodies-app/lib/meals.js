import sql from "better-sqlite3";
import fs from "node:fs";
import slugify from "slugify";
import xss from "xss";

const db = sql("meals.db");

export const getAllMeals = async () => {
  const stmt = db.prepare("SELECT * FROM meals");
  await new Promise((resolve) => setTimeout(resolve, 2000));
  return stmt.all();
};

export const getMeal = (mealSlug) => {
  const stmt = db.prepare("SELECT * FROM meals WHERE slug = ?");
  return stmt.get(mealSlug);
};

// The createMeal function uses slugify to generate a URL-friendly slug from the meal title.
// Example:
//   slugify("Grandma's Best Apple Pie!", { lower: true })
//   returns: "grandmas-best-apple-pie"
// This ensures readable, SEO-friendly URLs for each meal.

// The xss package is used to sanitize user input and prevent cross-site scripting (XSS) attacks.
// The xss() function takes a string and returns a sanitized version, removing or escaping dangerous HTML/JS.
// Example:
//   xss('<img src="x" onerror="alert(1)">Hello <b>world</b>')
//   returns: 'Hello <b>world</b>'
// This helps ensure only safe HTML is stored and rendered.

export const saveMeal = async (mealData) => {
  mealData.slug = slugify(mealData.title, { lower: true });
  mealData.instructions = xss(mealData.instructions);

  const imageExtension = mealData.image.name.split(".").pop();
  const imageName = `${mealData.slug}.${imageExtension}`;

  const stream = fs.createWriteStream(`public/images/${imageName}`);
  const bufferedImage = await mealData.image.arrayBuffer();
  stream.write(Buffer.from(bufferedImage), (error) => {
    if (error) {
      throw new Error("Error saving image file: " + error.message);
    } else {
      console.log("Image file saved successfully.");
    }
  });

  mealData.image = `/images/${imageName}`;

  const stmt = db.prepare(
    "INSERT INTO meals (title, summary, instructions, creator, creator_email, image, slug) VALUES (@title, @summary, @instructions, @creator, @creator_email, @image, @slug)",
  );

  const result = stmt.run(mealData);
  return result;
};
