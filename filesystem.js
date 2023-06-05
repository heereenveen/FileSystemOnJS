'use strict';

let currentDirectory = null;

class Permission {
    constructor(read = true, write = true, execute = true) {
        this.read = read;
        this.write = write;
        this.execute = execute;
    }
}

class File {
    constructor(name, content, permission = new Permission()) {
        this.name = name;
        this.content = content;
        this.permission = permission;
    }
}

class Directory {
    constructor(name, parent = null, permission = new Permission()) {
        this.name = name;
        this.parent = parent;
        this.files = {};
        this.directories = {};
        this.permission = permission;
    }

    mkdir(name, permission = new Permission()) {
        if (!this.permission.write) {
            console.log('Permission denied');
            return;
        }
        if (this.directories[name]) {
            console.log("Directory already exists.");
        } else {
            this.directories[name] = new Directory(name, this, permission);
            console.log(`Directory "${name}" created successfully!`);
        }
    }

    rmdir(name) {
        if (this.directories[name]) {
            delete this.directories[name];
            console.log(`Directory "${name}" removed successfully!`);
        } else {
            console.log("Directory does not exist.");
        }
    }

    touch(name, content) {
        if (this.files[name]) {
            console.log("File already exists.");
        } else {
            this.files[name] = new File(name, content, new Permission());
            console.log(`File "${name}" created successfully!`);
        }
    }

    rm(name) {
        if (this.files[name]) {
            delete this.files[name];
            console.log(`File "${name}" removed successfully!`);
        } else {
            console.log("File does not exist.");
        }
    }

    mv(name, newDirectory) {
        if (this.files[name]) {
            if (newDirectory.files[name]) {
                console.log("File already exists in the target directory.");
            } else {
                newDirectory.files[name] = this.files[name];
                delete this.files[name];
                console.log(`File "${name}" moved successfully!`);
            }
        } else {
            console.log("File does not exist.");
        }
    }

    cp(name, newDirectory) {
        if (this.files[name]) {
            if (newDirectory.files[name]) {
                console.log("File already exists in the target directory.");
            } else {
                newDirectory.files[name] = new File(this.files[name].name, this.files[name].content);
                console.log(`File "${name}" copied successfully!`);
            }
        } else {
            console.log("File does not exist.");
        }
    }

    ls() {
        return {
            directories: Object.keys(this.directories),
            files: Object.keys(this.files)
        };
    }

    print(indent = '') {
        console.log(`${indent}${this.name}/`);
        for (const name in this.directories) {
            this.directories[name].print(indent + '  ');
        }
        for (const name in this.files) {
            console.log(`${indent}  ${name}`);
        }
    }

    cat(name) {
        if (this.files[name]) {
            console.log(this.files[name].content);
        } else {
            console.log("File does not exist.");
        }
    }

    find(name) {
        for (let file in this.files) {
            if (file === name) {
                return `${this.getPath()}\\${name}`;
            }
        }
        for (let dir in this.directories) {
            if (dir === name) {
                return `${this.getPath()}\\${dir}`;
            }
            let result = this.directories[dir].find(name);
            if (result) {
                return result;
            }
        }
        return null;
    }

    edit(name, newContent) {
        if (this.files[name]) {
            this.files[name].content = newContent;
            console.log(`File "${name}" edited successfully!`);
        } else {
            console.log("File does not exist.");
        }
    }

    getPath() {
        if (this.parent === null) {
            return `C:\\${this.name}`;
        } else {
            return `${this.parent.getPath()}\\${this.name}`;
        }
    }
}

let history = [];

let root = new Directory("filesystem");

console.log('JS file system started!');

currentDirectory = root;

process.stdin.setEncoding('utf8');

const handleInput = (input) => {
    const [command, arg1, arg2, arg3, arg4] = input.split(' ');

    let newDirectory;
    let copyDirectory;
    let foundPath;

    switch (command) {
        case 'history':
            console.log(history);
            break;
        case 'mkdir':
            if (arg2 !== undefined && arg3 !== undefined && arg4 !== undefined) {
                const permission = new Permission(arg2 !== 'false', arg3 !== 'false', arg4 !== 'false');
                currentDirectory.mkdir(arg1, permission);
            } else {
                currentDirectory.mkdir(arg1);
            }
            break;
        case 'rmdir':
            currentDirectory.rmdir(arg1);
            break;
        case 'touch':
            currentDirectory.touch(arg1, arg2);
            break;
        case 'rm':
            currentDirectory.rm(arg1);
            break;
        case 'mv':
            newDirectory = currentDirectory.directories[arg2];
            if (newDirectory) {
                currentDirectory.mv(arg1, newDirectory);
            } else {
                console.log("Target directory does not exist.");
            }
            break;
        case 'cp':
            copyDirectory = currentDirectory.directories[arg2];
            if (copyDirectory) {
                currentDirectory.cp(arg1, copyDirectory);
            } else {
                console.log("Target directory does not exist.");
            }
            break;
        case 'ls':
            console.log(currentDirectory.ls());
            break;
        case 'cd':
            if (arg1 === '..') {
                if (currentDirectory.parent) {
                    currentDirectory = currentDirectory.parent;
                    console.log("Moved up to parent directory.");
                } else {
                    console.log("You're already at the root directory.");
                }
            } else if (currentDirectory.directories[arg1]) {
                currentDirectory = currentDirectory.directories[arg1];
                console.log("Changed directory to " + arg1);
            } else {
                console.log("Directory does not exist.");
            }
            break;
        case 'root':
            if (root) {
                root.print();
            } else {
                console.log("Root directory is not initialized.");
            }
            break;
        case 'find':
            foundPath = root.find(arg1);
            if (foundPath) {
                console.log(`Found at ${foundPath}`);
            } else {
                console.log("File or directory not found.");
            }
            break;
        case 'edit':
            currentDirectory.edit(arg1, arg2);
            break;
        case 'cat':
            currentDirectory.cat(arg1);
            break;
        case 'help':
            console.log('Available commands:');
            console.log('mkdir <dir> [read] [write] [execute]: creates a new directory with optional permissions (true/false)');
            console.log('rmdir <dir>: removes a directory');
            console.log('touch <file> <content>: creates a new file with the given content');
            console.log('rm <file>: removes a file');
            console.log('mv <file> <dir>: moves a file to another directory');
            console.log('cp <file> <dir>: copies a file to another directory');
            console.log('ls: lists all files and directories in the current directory');
            console.log('cd <dir>: changes the current directory');
            console.log('cd ..: moves to the parent directory');
            console.log('root: shows all directories and files from the root directory');
            console.log('find <file/dir>: finds a file or directory from the root directory');
            console.log('edit <file> <newContent>: edits the content of a file');
            console.log('cat <file>: shows the content of a file');
            break;
        default:
            console.log(`Unknown command: "${command}".`);
    }
    prompt();
};

const prompt = () => {
    if (currentDirectory) {
        process.stdout.write(`${currentDirectory.getPath()}> `);
    } else {
        console.error('Current directory is null, unable to get path');
    }
};

process.stdin.on('data', (input) => {
    const cleanedInput = input.replace(/[\n\r]+$/, '');
    handleInput(cleanedInput);
});

prompt();