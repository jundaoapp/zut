import Zut from "../dist/index.js";
import t from "./t";

type test = "one" | "two";
// test comment

try {
  t();
} catch (error) {
  console.log(error);
  const zut = new Zut(error, {mutedEntries: [/custom/]});
}