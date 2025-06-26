export class PythonExecutor {
  static async executeCode(code: string): Promise<{ output: string; error?: string }> {
    return new Promise((resolve) => {
      // Simulate execution delay
      setTimeout(() => {
        try {
          // This is a mock executor - in a real implementation, 
          // you'd use a Python runtime like Pyodide or a backend service
          const output = this.mockExecute(code);
          resolve({ output });
        } catch (error) {
          resolve({ 
            output: '', 
            error: error instanceof Error ? error.message : 'Unknown error' 
          });
        }
      }, 1000 + Math.random() * 1000); // Random delay between 1-2 seconds
    });
  }
  
  private static mockExecute(code: string): string {
    // Mock execution for demonstration
    const lines = code.split('\n').filter(line => line.trim());
    const outputs: string[] = [];
    
    for (const line of lines) {
      const trimmed = line.trim();
      
      // Mock print statements
      const printMatch = trimmed.match(/print\s*\(\s*(['"])(.*?)\1\s*\)/);
      if (printMatch) {
        outputs.push(printMatch[2]);
        continue;
      }
      
      // Mock simple calculations
      const calcMatch = trimmed.match(/print\s*\(\s*(\d+\s*[+\-*/]\s*\d+)\s*\)/);
      if (calcMatch) {
        try {
          const result = eval(calcMatch[1]);
          outputs.push(result.toString());
        } catch {
          outputs.push('Error in calculation');
        }
        continue;
      }
      
      // Mock variable prints
      const varPrintMatch = trimmed.match(/print\s*\(\s*(\w+)\s*\)/);
      if (varPrintMatch) {
        // Look for variable assignments in previous lines
        const varName = varPrintMatch[1];
        const varMatch = code.match(new RegExp(`${varName}\\s*=\\s*(['"])(.*?)\\1`));
        if (varMatch) {
          outputs.push(varMatch[2]);
        } else {
          const numMatch = code.match(new RegExp(`${varName}\\s*=\\s*(\\d+)`));
          if (numMatch) {
            outputs.push(numMatch[1]);
          } else {
            outputs.push(`${varName} = <variable value>`);
          }
        }
        continue;
      }
    }
    
    return outputs.length > 0 ? outputs.join('\n') : 'Program executed successfully (no output)';
  }
}