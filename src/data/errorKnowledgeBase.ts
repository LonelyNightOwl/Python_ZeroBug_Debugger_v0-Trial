export interface ErrorInfo {
  definition: string;
  cause: string;
  solution: string;
  example_before: string;
  example_after: string;
}

export const ERROR_KB: Record<string, ErrorInfo> = {
  "SyntaxError": {
    "definition": "Code violates Python grammar.",
    "cause": "Missing colons, brackets, or invalid structure.",
    "solution": "Fix the syntax as per Python rules.",
    "example_before": "if x > 5\n    print(x)",
    "example_after": "if x > 5:\n    print(x)"
  },
  "IndentationError": {
    "definition": "Incorrect indentation of code.",
    "cause": "Missing or inconsistent spaces/tabs.",
    "solution": "Use 4 spaces consistently.",
    "example_before": "def hello():\nprint('hi')",
    "example_after": "def hello():\n    print('hi')"
  },
  "NameError": {
    "definition": "Variable/function name not defined.",
    "cause": "Using a variable without declaring it.",
    "solution": "Define the variable before using.",
    "example_before": "print(age)",
    "example_after": "age = 20\nprint(age)"
  },
  "TypeError": {
    "definition": "Invalid operation between data types.",
    "cause": "e.g. adding string to integer.",
    "solution": "Convert types properly before using.",
    "example_before": "print('Age: ' + 20)",
    "example_after": "print('Age: ' + str(20))"
  },
  "ValueError": {
    "definition": "Right type but wrong value.",
    "cause": "e.g. int('abc')",
    "solution": "Sanitize and validate input.",
    "example_before": "int('hello')",
    "example_after": "val = '123'\nif val.isdigit():\n    print(int(val))"
  },
  "IndexError": {
    "definition": "List index out of range.",
    "cause": "Accessing index that doesn't exist.",
    "solution": "Use len() to check size.",
    "example_before": "nums = [1,2]\nprint(nums[5])",
    "example_after": "if len(nums) > 5:\n    print(nums[5])"
  },
  "KeyError": {
    "definition": "Dictionary key not found.",
    "cause": "Using a key that doesn't exist.",
    "solution": "Use .get() or check with 'in'.",
    "example_before": "d = {'a':1}\nprint(d['b'])",
    "example_after": "print(d.get('b', 'Not Found'))"
  },
  "ZeroDivisionError": {
    "definition": "Dividing by zero.",
    "cause": "Denominator is zero.",
    "solution": "Check before dividing.",
    "example_before": "x = 10 / 0",
    "example_after": "if y != 0:\n    x = 10 / y"
  },
  "AttributeError": {
    "definition": "Attribute/method not found.",
    "cause": "Wrong type or typo in method.",
    "solution": "Use dir(obj) to see valid attributes.",
    "example_before": "x = 5\nx.append(2)",
    "example_after": "x = []\nx.append(2)"
  },
  "ImportError": {
    "definition": "Cannot import from module.",
    "cause": "Misspelled or incorrect import.",
    "solution": "Double-check spelling and syntax.",
    "example_before": "from mathz import sqrt",
    "example_after": "from math import sqrt"
  },
  "ModuleNotFoundError": {
    "definition": "Module not found or installed.",
    "cause": "Using module not installed.",
    "solution": "Install via pip.",
    "example_before": "import boltai",
    "example_after": "# pip install boltai\nimport boltai"
  },
  "FileNotFoundError": {
    "definition": "File you're trying to access doesn't exist.",
    "cause": "Wrong path or missing file.",
    "solution": "Check path or use os.path.exists()",
    "example_before": "open('data.csv')",
    "example_after": "import os\nif os.path.exists('data.csv'):\n    open('data.csv')"
  },
  "RuntimeError": {
    "definition": "Unspecified error during runtime.",
    "cause": "Unexpected behavior in execution.",
    "solution": "Use try/except, check logic.",
    "example_before": "# infinite recursion, unsafe op",
    "example_after": "# use print() to trace and fix logic"
  },
  "RecursionError": {
    "definition": "Function called itself too many times.",
    "cause": "Missing base case in recursion.",
    "solution": "Always add a base case.",
    "example_before": "def f():\n    f()\nf()",
    "example_after": "def f(n):\n    if n == 0: return\n    f(n-1)"
  },
  "AssertionError": {
    "definition": "Assertion failed.",
    "cause": "assert condition returned False.",
    "solution": "Fix the condition or remove in production.",
    "example_before": "assert 2 + 2 == 5",
    "example_after": "assert 2 + 2 == 4"
  },
  "UnboundLocalError": {
    "definition": "Using variable before assignment.",
    "cause": "Assigning before declaring inside a function.",
    "solution": "Declare before use or use global.",
    "example_before": "def fn():\n    print(x)\n    x = 5",
    "example_after": "def fn():\n    x = 5\n    print(x)"
  },
  "IsADirectoryError": {
    "definition": "Tried to open a directory as a file.",
    "cause": "Passed a folder to open().",
    "solution": "Check using os.path.isfile().",
    "example_before": "open('/home/user/')",
    "example_after": "if os.path.isfile(path):\n    open(path)"
  },
  "PermissionError": {
    "definition": "No access rights to file/folder.",
    "cause": "Trying to read/write protected file.",
    "solution": "Change file permissions or use sudo.",
    "example_before": "open('/root/secret.txt')",
    "example_after": "# Run as admin or change perms"
  },
  "EOFError": {
    "definition": "Unexpected end of file/input.",
    "cause": "Used input() where no stdin is available.",
    "solution": "Wrap in try/except or avoid input().",
    "example_before": "data = input()",
    "example_after": "try:\n    data = input()\nexcept EOFError:\n    data = ''"
  },
  "FloatingPointError": {
    "definition": "Floating point operation failed.",
    "cause": "Divisions, underflow/overflow of float ops.",
    "solution": "Use `decimal` or error handling.",
    "example_before": "# no direct trigger",
    "example_after": "# use try/except or decimal module"
  }
};