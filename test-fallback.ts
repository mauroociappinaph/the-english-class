import "dotenv/config";
import { expressionService } from "./src/backend/infrastructure/registry";
import { prisma } from "./src/backend/infrastructure/db";

async function test() {
  console.log("Testing analyzeExpression for 'out of the blue'...");
  try {
    const result = await expressionService.analyzeExpression("out of the blue");
    console.log("\n✅ SUCCESS!");
    console.log("Expression:", result?.text);
    console.log("Meaning:", result?.meaning);
    console.log("Translation:", result?.translation);
    console.log("Has Slang Data?", !!result?.slangData);
    
    // Clean up DB so we don't pollute it
    if (result) {
      await prisma.expression.delete({ where: { id: result.id } });
    }
  } catch (error) {
    console.error("\n❌ FAILED:", error);
  } finally {
    await prisma.$disconnect();
  }
}

test();
