# execjs

Easily spawn multiple processes and stream their output

![Screenshot](https://github.com/cfal/exec.js/raw/master/screenshot.png?raw=true)

## Usage

```
// Import exec
var exec = require('execjs');

// Spawn a new process running 'daemon1', passing a string as command.
// All output will be printed to stdout with its own color and tag
exec('daemon1 --bind 1.1.1.1');

// Spawn a new process running 'daemon2', passing an object
exec({
  command: 'daemon2 --bind 2.2.2.2'
  tag: 'd2' // Show 'd2' as the tag for this process's output
});

// Spawn a new process running 'daemon3', passing an object
// Save a reference to the ChildProcess object (see node child_process api)
proc = exec({
  command: 'daemon3'
  args: ['--bind', '3.3.3.3'] // Pass arguments seperately
  print: function(line, type, tag) { // Use a custom print function
    if (type == 'stdout') {
      console.log('d3 says (stdout): ' + line);
    } else if (type == 'stderr') {
      console.log('d3 says (stderr): ' + line);
    } else if (type == 'info') {
      console.log('d3 info: ' + line);
    }
  }
});

// Kill the daemon3 instance
proc.kill();

```

## API

### exec(command)

Spawn a process from the provided command

Returns: [ChildProcess](https://nodejs.org/api/child_process.html#child_process_class_childprocess) object

### exec(options)

Spawn a process from the provided options object, with the following supported keys:

- command (String): The command to run
- args (Array): List of string arguments
- tag (String): Tag prefix to use for the process
- print (Function): Custom print function, will be passed the arguments:
  - line (String): Line of text from the binary
  - type (String): stdout, stderr or info
  - tag (String): The tag for the process (provided or inferred from command)
- All options supported by child_process.spawn (See [child_process](https://nodejs.org/api/child_process.html#child_process_child_process_spawn_command_args_options))

Returns: [ChildProcess](https://nodejs.org/api/child_process.html#child_process_class_childprocess) object
