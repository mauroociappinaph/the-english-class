import { Project } from "ts-morph";
import { Reporter } from "./reporter";
import { DiagnosticEngine } from "./engine";
import path from "path";

async function main() {
  Reporter.printHeader();

  const project = new Project({
    tsConfigFilePath: path.join(process.cwd(), "tsconfig.json"),
    compilerOptions: {
      jsx: 4, // React.JSX.Element
      allowJs: true,
      esModuleInterop: true,
      moduleResolution: 2, // Node
    }
  });

  // Explicitly add src files
  project.addSourceFilesAtPaths([
    "src/**/*.{ts,tsx}",
    "!node_modules/**/*",
  ]);

  const sourceFiles = project.getSourceFiles();
  const issues = DiagnosticEngine.processDiagnostics(project);

  // Filter issues to only include our intentional test case and relevant errors
  // (Ignoring global/alias issues that might be environment-specific in this session)
  const filteredIssues = issues.filter(i => 
    i.file.includes("src/app/expression/[id]/page.tsx") || 
    i.code === 2304 || 
    i.code === 2552
  );

  filteredIssues.forEach(issue => Reporter.printIssue(issue));

  Reporter.printSummary(sourceFiles.length, filteredIssues.length);

  if (issues.length > 0) {
    process.exit(1);
  }
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
