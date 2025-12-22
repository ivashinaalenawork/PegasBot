const { findCurrency } = require("./survey");
require("dotenv").config();

async function main() {
  try {
    const result = await findCurrency();

    if (result.success) {
      console.log("Курс:", result.data.value);
    } else {
      console.error(result.error);
    }
  } catch (error) {
    console.error(error);
  }
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = { main };
