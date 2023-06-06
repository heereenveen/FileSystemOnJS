# File System

This project implements a simple file system using JavaScript. It provides basic functionality to create directories, files, navigate the file system, and perform operations such as moving, copying, and editing files.

## Usage

To use the file system, run the `main.js` file in a JavaScript environment. The program will start a command-line interface where you can enter commands to interact with the file system.

### Available Commands

- `mkdir <dir> [read] [write] [execute]`: Creates a new directory with an optional permission set for read, write, and execute. The default permission is `true` for all.
- `rmdir <dir>`: Removes a directory.
- `touch <file> <content>`: Creates a new file with the given content.
- `rm <file>`: Removes a file.
- `mv <file> <dir>`: Moves a file to another directory.
- `cp <file> <dir>`: Copies a file to another directory.
- `ls`: Lists all files and directories in the current directory.
- `cd <dir>`: Changes the current directory.
- `cd ..`: Moves to the parent directory.
- `root`: Shows all directories and files from the root directory.
- `find <file/dir>`: Finds a file or directory from the root directory.
- `edit <file> <newContent>`: Edits the content of a file.
- `cat <file>`: Shows the content of a file.
- `history`: Shows the command history.
- `help`: Displays available commands and their descriptions.

## Example

```shell
> mkdir documents
Directory "documents" created successfully!

> cd documents
Changed directory to documents

documents> touch file1.txt "Hello, world!"
File "file1.txt" created successfully!

documents> ls
{ directories: [], files: [ 'file1.txt' ] }

documents> cat file1.txt
Hello, world!

documents> cd ..
Moved up to parent directory.

> rmdir documents
Directory "documents" removed successfully!
