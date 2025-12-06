import { router } from '../src/main/ipc/router';
import { OpenAPIGenerator } from '@orpc/openapi';
import { ZodToJsonSchemaConverter } from '@orpc/zod/zod4';
import * as fs from 'node:fs';
import * as path from 'node:path';

(async () => { // Start async IIFE
  // Load the AppRouter
  const appRouter = router;

  // Create generator with schema converters
  const generator = new OpenAPIGenerator({
    schemaConverters: [new ZodToJsonSchemaConverter()],
  });

  // Generate OpenAPI spec
  const openApiSpec = await generator.generate(appRouter, {
    info: {
      title: 'Electron Shadcn oRPC API',
      version: '1.0.0',
    },
  });

  // Define output path
  const outputPath = path.resolve(process.cwd(), 'test/mocks/openapi.json');
  const outputDir = path.dirname(outputPath);

  // Ensure output directory exists
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Write the OpenAPI spec to a file
  fs.writeFileSync(outputPath, JSON.stringify(openApiSpec, null, 2));

  console.log(`OpenAPI spec generated to ${outputPath}`);
})(); // End async IIFE
