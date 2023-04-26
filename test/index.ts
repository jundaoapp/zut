import Zut from "../dist/index.js";
import t from "./t";

type test = "one" | "two";
// test comment

try {
  t();
} catch (error) {
  console.log(error);
  new Zut(error, {shortcuts: ["one", "two"]});
}