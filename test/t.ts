import MyCustomError from "./custom";

export default function test() {
  s();
}

function computeStuff(fn: () => void) {
  // Run the callback
  fn();
}

function s() {
  computeStuff(callbackFunction);
  
  function callbackFunction() {
    // Let's throw an error
    throw new MyCustomError("Your code has an error");
  }
}