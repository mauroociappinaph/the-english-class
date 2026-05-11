import fs from 'fs';
import path from 'path';

/**
 * AuditConfig: Centralized configuration for the Semantic Audit Suite.
 */
export interface AuditConfig {
  ignorePaths: string[];
  severityOverrides: Record<string, 'HIGH' | 'MEDIUM' | 'LOW'>;
  rules: {
    giantInterfaces: {
      maxProperties: number;
      maxNesting: number;
      complexityThreshold: number;
    };
    anyUsage: {
      allowTypeAssertions: boolean;
    };
    circularDeps: {
      enforcePureDomain: boolean;
    };
  };
  reporting: {
    outputDir: string;
    formats: ('json' | 'markdown' | 'html')[];
  };
}

const DEFAULT_CONFIG: AuditConfig = {
  ignorePaths: ['node_modules', '.next', 'dist', 'build'],
  severityOverrides: {},
  rules: {
    giantInterfaces: {
      maxProperties: 20,
      maxNesting: 3,
      complexityThreshold: 300,
    },
    anyUsage: {
      allowTypeAssertions: false,
    },
    circularDeps: {
      enforcePureDomain: true,
    },
  },
  reporting: {
    outputDir: 'reports',
    formats: ['json', 'markdown', 'html'],
  },
};

export class ConfigLoader {
  private readonly CONFIG_FILE = '.typecheckrc';

  public load(): AuditConfig {
    const projectRoot = process.cwd();
    const configPath = path.join(projectRoot, this.CONFIG_FILE);
    
    let fileConfig: Partial<AuditConfig> = {};
    if (fs.existsSync(configPath)) {
      try {
        const content = fs.readFileSync(configPath, 'utf-8');
        fileConfig = JSON.parse(content);
      } catch (error) {
        console.warn(`\x1b[33m⚠️  Failed to parse ${this.CONFIG_FILE}. Using defaults.\x1b[0m`);
      }
    }

    const config = this.deepMerge(DEFAULT_CONFIG, fileConfig) as AuditConfig;
    return this.applyEnvOverrides(config);
  }

  private deepMerge(target: Record<string, unknown>, source: Record<string, unknown>): Record<string, unknown> {
    const output = { ...target };
    if (this.isObject(target) && this.isObject(source)) {
      Object.keys(source).forEach(key => {
        const sourceVal = source[key];
        const targetVal = target[key];

        if (this.isObject(sourceVal) && this.isObject(targetVal)) {
          output[key] = this.deepMerge(targetVal as Record<string, unknown>, sourceVal as Record<string, unknown>);
        } else {
          output[key] = sourceVal;
        }
      });
    }
    return output;
  }

  private isObject(item: unknown): item is Record<string, unknown> {
    return (item !== null && typeof item === 'object' && !Array.isArray(item));
  }

  private applyEnvOverrides(config: AuditConfig): AuditConfig {
    if (process.env.AUDIT_IGNORE_PATHS) {
      config.ignorePaths = process.env.AUDIT_IGNORE_PATHS.split(',');
    }
    if (process.env.AUDIT_OUTPUT_DIR) {
      config.reporting.outputDir = process.env.AUDIT_OUTPUT_DIR;
    }
    if (process.env.VERBOSE === 'true') {
      config.rules.anyUsage.allowTypeAssertions = true;
    }
    return config;
  }
}

export const auditConfig = new ConfigLoader().load();
