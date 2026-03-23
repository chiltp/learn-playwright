// Phase 0: Understanding async/await
// ====================================
// Before we write any Playwright tests, we need to understand async/await.
// This is the #1 concept in Playwright — every browser action takes time,
// so we need a way to say "wait for this to finish before moving on."

// --- ANALOGY ---
// Imagine you're at a coffee shop:
// 1. You order a coffee (this takes time — the barista has to make it)
// 2. You WAIT for the coffee
// 3. Then you drink it
//
// You can't drink the coffee before it's made!
// That's exactly what async/await does — it makes JavaScript WAIT
// for something to finish before moving to the next step.

// --- SYNCHRONOUS (what you're used to) ---
// This runs instantly, no waiting needed:
const name = 'Chi';
console.log('Hello, ' + name); // This is immediate — no waiting

// --- ASYNCHRONOUS (things that take time) ---
// Clicking a button on a webpage takes time.
// Loading a page takes time.
// We need to WAIT for these things.

// Let's simulate a slow action (like a page loading):
function makeCoffee(type) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(type + ' is ready!');
    }, 1000); // Takes 1 second, like a page loading
  });
}

// WITHOUT await — this is WRONG:
// The coffee isn't ready yet, but we try to use it anyway
function wrongWay() {
  const coffee = makeCoffee('Latte');
  console.log('Wrong way:', coffee); // Prints: Promise { <pending> } — NOT the coffee!
}

// WITH await — this is CORRECT:
// We wait for the coffee to be ready before using it
async function rightWay() {
  const coffee = await makeCoffee('Latte');
  console.log('Right way:', coffee); // Prints: "Latte is ready!" — the actual result!
}

// --- THE TWO RULES ---
// Rule 1: "await" means "wait for this to finish"
// Rule 2: You can only use "await" inside an "async" function

// Let's run both to see the difference:
console.log('\n--- Running wrongWay (no await) ---');
wrongWay();

console.log('\n--- Running rightWay (with await) ---');
rightWay();

// ============================================
// YOUR TURN: Uncomment the exercise below and fill in the blanks
// ============================================

// Exercise: Order two drinks, one after the other

async function orderDrinks() {
  const drink1 = await makeCoffee('Espresso');
  console.log(drink1);

  const drink2 = await makeCoffee('Cappuccino');
  console.log(drink2);
}

orderDrinks();
