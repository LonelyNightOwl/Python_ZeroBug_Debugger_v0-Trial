import { ERROR_KB, ErrorInfo } from '../data/errorKnowledgeBase';

export interface PythonError {
  type: string;
  message: string;
  line: number;
  errorInfo?: ErrorInfo;
}

export class PythonErrorParser {
  static parseCode(code: string): PythonError[] {
    const errors: PythonError[] = [];
    const lines = code.split('\n');
    
    lines.forEach((line, index) => {
      const lineNumber = index + 1;
      const trimmedLine = line.trim();
      
      // Skip empty lines and comments
      if (!trimmedLine || trimmedLine.startsWith('#')) return;
      
      // Check for various error patterns
      const detectedErrors = [
        ...this.checkSyntaxErrors(line, lineNumber),
        ...this.checkIndentationErrors(line, lineNumber, lines, index),
        ...this.checkNameErrors(line, lineNumber, lines.slice(0, index)),
        ...this.checkTypeErrors(line, lineNumber),
        ...this.checkValueErrors(line, lineNumber),
        ...this.checkIndexErrors(line, lineNumber),
        ...this.checkKeyErrors(line, lineNumber),
        ...this.checkZeroDivisionErrors(line, lineNumber),
        ...this.checkAttributeErrors(line, lineNumber),
        ...this.checkImportErrors(line, lineNumber),
        ...this.checkRuntimeErrors(line, lineNumber),
        ...this.checkAssertionErrors(line, lineNumber),
        ...this.checkUnboundLocalErrors(line, lineNumber, lines),
      ];
      
      errors.push(...detectedErrors);
    });
    
    return errors;
  }
  
  private static checkSyntaxErrors(line: string, lineNumber: number): PythonError[] {
    const errors: PythonError[] = [];
    
    // Missing colon after if, for, while, def, class, etc.
    if (/^(\s*)(if|for|while|def|class|try|except|finally|with|elif|else)\s+.*[^:]\s*$/.test(line) && 
        !line.includes('#')) {
      errors.push({
        type: 'SyntaxError',
        message: 'Missing colon',
        line: lineNumber,
        errorInfo: ERROR_KB.SyntaxError
      });
    }
    
    // Unmatched brackets
    const openBrackets = (line.match(/[\(\[\{]/g) || []).length;
    const closeBrackets = (line.match(/[\)\]\}]/g) || []).length;
    if (openBrackets !== closeBrackets) {
      errors.push({
        type: 'SyntaxError',
        message: 'Unmatched brackets',
        line: lineNumber,
        errorInfo: ERROR_KB.SyntaxError
      });
    }
    
    return errors;
  }
  
  private static checkIndentationErrors(line: string, lineNumber: number, allLines: string[], currentIndex: number): PythonError[] {
    const errors: PythonError[] = [];
    
    if (line.trim() === '') return errors;
    
    // Check if line should be indented (after colon)
    if (currentIndex > 0) {
      const prevLine = allLines[currentIndex - 1].trim();
      if (prevLine.endsWith(':') && line.trim() !== '' && !line.startsWith(' ') && !line.startsWith('\t')) {
        errors.push({
          type: 'IndentationError',
          message: 'Expected an indented block',
          line: lineNumber,
          errorInfo: ERROR_KB.IndentationError
        });
      }
    }
    
    return errors;
  }
  
  private static checkNameErrors(line: string, lineNumber: number, previousLines: string[]): PythonError[] {
    const errors: PythonError[] = [];
    
    // Extract variable usage
    const variableUsage = line.match(/\b([a-zA-Z_][a-zA-Z0-9_]*)\s*(?=[\(\[\.]|\s|$)/g);
    if (!variableUsage) return errors;
    
    // Get all defined variables from previous lines
    const definedVars = new Set<string>();
    const builtins = new Set(['print', 'len', 'str', 'int', 'float', 'list', 'dict', 'range', 'input', 'open', 'type', 'isinstance', 'hasattr', 'getattr', 'setattr']);
    
    previousLines.forEach(prevLine => {
      // Variable assignments
      const assignments = prevLine.match(/([a-zA-Z_][a-zA-Z0-9_]*)\s*=/g);
      if (assignments) {
        assignments.forEach(assign => {
          const varName = assign.split('=')[0].trim();
          definedVars.add(varName);
        });
      }
      
      // Function definitions
      const funcDefs = prevLine.match(/def\s+([a-zA-Z_][a-zA-Z0-9_]*)/g);
      if (funcDefs) {
        funcDefs.forEach(func => {
          const funcName = func.split(/\s+/)[1];
          definedVars.add(funcName);
        });
      }
      
      // Import statements
      const imports = prevLine.match(/(?:from\s+\w+\s+)?import\s+([a-zA-Z_][a-zA-Z0-9_]*)/g);
      if (imports) {
        imports.forEach(imp => {
          const parts = imp.split(/\s+/);
          const importName = parts[parts.length - 1];
          definedVars.add(importName);
        });
      }
    });
    
    // Check for undefined variables
    variableUsage.forEach(variable => {
      const varName = variable.trim();
      if (!definedVars.has(varName) && !builtins.has(varName) && !/^\d/.test(varName)) {
        errors.push({
          type: 'NameError',
          message: `name '${varName}' is not defined`,
          line: lineNumber,
          errorInfo: ERROR_KB.NameError
        });
      }
    });
    
    return errors;
  }
  
  private static checkTypeErrors(line: string, lineNumber: number): PythonError[] {
    const errors: PythonError[] = [];
    
    // String + number concatenation
    if (/['"][^'"]*['"]\s*\+\s*\d+/.test(line) || /\d+\s*\+\s*['"][^'"]*['"]/.test(line)) {
      errors.push({
        type: 'TypeError',
        message: 'unsupported operand type(s) for +: string and int',
        line: lineNumber,
        errorInfo: ERROR_KB.TypeError
      });
    }
    
    return errors;
  }
  
  private static checkValueErrors(line: string, lineNumber: number): PythonError[] {
    const errors: PythonError[] = [];
    
    // int() with non-numeric string
    if (/int\s*\(\s*['"][^'"]*['"]\s*\)/.test(line)) {
      const match = line.match(/int\s*\(\s*['"]([^'"]*)['"]\s*\)/);
      if (match && match[1] && !/^\d+$/.test(match[1])) {
        errors.push({
          type: 'ValueError',
          message: `invalid literal for int() with base 10: '${match[1]}'`,
          line: lineNumber,
          errorInfo: ERROR_KB.ValueError
        });
      }
    }
    
    return errors;
  }
  
  private static checkIndexErrors(line: string, lineNumber: number): PythonError[] {
    const errors: PythonError[] = [];
    
    // Simple index access with obviously wrong index
    if (/\[\s*\d+\s*\]/.test(line)) {
      const match = line.match(/\[\s*(\d+)\s*\]/);
      if (match && parseInt(match[1]) > 10) { // Assume arrays with index > 10 might be problematic
        errors.push({
          type: 'IndexError',
          message: 'list index out of range',
          line: lineNumber,
          errorInfo: ERROR_KB.IndexError
        });
      }
    }
    
    return errors;
  }
  
  private static checkKeyErrors(line: string, lineNumber: number): PythonError[] {
    const errors: PythonError[] = [];
    
    // Dictionary access without .get()
    if (/\w+\s*\[\s*['"][^'"]*['"]\s*\]/.test(line) && !line.includes('.get(')) {
      errors.push({
        type: 'KeyError',
        message: 'dictionary key not found',
        line: lineNumber,
        errorInfo: ERROR_KB.KeyError
      });
    }
    
    return errors;
  }
  
  private static checkZeroDivisionErrors(line: string, lineNumber: number): PythonError[] {
    const errors: PythonError[] = [];
    
    // Division by zero
    if (/\/\s*0\s*$/.test(line) || /\/\s*0\s*[^\d]/.test(line)) {
      errors.push({
        type: 'ZeroDivisionError',
        message: 'division by zero',
        line: lineNumber,
        errorInfo: ERROR_KB.ZeroDivisionError
      });
    }
    
    return errors;
  }
  
  private static checkAttributeErrors(line: string, lineNumber: number): PythonError[] {
    const errors: PythonError[] = [];
    
    // Common attribute errors
    if (/\d+\s*\.\s*append\s*\(/.test(line)) {
      errors.push({
        type: 'AttributeError',
        message: "'int' object has no attribute 'append'",
        line: lineNumber,
        errorInfo: ERROR_KB.AttributeError
      });
    }
    
    return errors;
  }
  
  private static checkImportErrors(line: string, lineNumber: number): PythonError[] {
    const errors: PythonError[] = [];
    
    // Common import typos
    const commonModules = ['math', 'os', 'sys', 'json', 'datetime', 'random', 'time'];
    const importMatch = line.match(/(?:from\s+(\w+)\s+import|import\s+(\w+))/);
    
    if (importMatch) {
      const moduleName = importMatch[1] || importMatch[2];
      // Simple check for obvious typos
      if (moduleName && moduleName.includes('z') && !commonModules.includes(moduleName)) {
        errors.push({
          type: 'ModuleNotFoundError',
          message: `No module named '${moduleName}'`,
          line: lineNumber,
          errorInfo: ERROR_KB.ModuleNotFoundError
        });
      }
    }
    
    return errors;
  }
  
  private static checkRuntimeErrors(line: string, lineNumber: number): PythonError[] {
    const errors: PythonError[] = [];
    
    // Infinite recursion pattern
    if (/def\s+(\w+).*:\s*\1\s*\(/.test(line)) {
      errors.push({
        type: 'RecursionError',
        message: 'maximum recursion depth exceeded',
        line: lineNumber,
        errorInfo: ERROR_KB.RecursionError
      });
    }
    
    return errors;
  }
  
  private static checkAssertionErrors(line: string, lineNumber: number): PythonError[] {
    const errors: PythonError[] = [];
    
    // Obviously false assertions
    if (/assert\s+.*==\s*.*/.test(line)) {
      // Simple mathematical assertions that are obviously wrong
      if (/assert\s+\d+\s*\+\s*\d+\s*==\s*\d+/.test(line)) {
        const match = line.match(/assert\s+(\d+)\s*\+\s*(\d+)\s*==\s*(\d+)/);
        if (match) {
          const [, a, b, expected] = match;
          if (parseInt(a) + parseInt(b) !== parseInt(expected)) {
            errors.push({
              type: 'AssertionError',
              message: 'assertion failed',
              line: lineNumber,
              errorInfo: ERROR_KB.AssertionError
            });
          }
        }
      }
    }
    
    return errors;
  }
  
  private static checkUnboundLocalErrors(line: string, lineNumber: number, allLines: string[]): PythonError[] {
    const errors: PythonError[] = [];
    
    // Check for variable used before assignment in function
    const currentLine = line.trim();
    if (currentLine.includes('print(') && /print\s*\(\s*\w+\s*\)/.test(currentLine)) {
      // Look for function definition and variable assignment after print
      let inFunction = false;
      let functionStarted = false;
      
      for (let i = 0; i < allLines.length; i++) {
        const checkLine = allLines[i].trim();
        
        if (checkLine.startsWith('def ')) {
          inFunction = true;
          functionStarted = true;
          continue;
        }
        
        if (i === lineNumber - 1 && inFunction) {
          // This is our print line, check if variable is assigned later in function
          for (let j = i + 1; j < allLines.length; j++) {
            const laterLine = allLines[j].trim();
            if (laterLine.startsWith('def ') || (!laterLine.startsWith(' ') && laterLine !== '')) {
              break; // End of function
            }
            
            const printMatch = currentLine.match(/print\s*\(\s*(\w+)\s*\)/);
            if (printMatch && laterLine.includes(`${printMatch[1]} =`)) {
              errors.push({
                type: 'UnboundLocalError',
                message: `local variable '${printMatch[1]}' referenced before assignment`,
                line: lineNumber,
                errorInfo: ERROR_KB.UnboundLocalError
              });
              break;
            }
          }
        }
      }
    }
    
    return errors;
  }
}