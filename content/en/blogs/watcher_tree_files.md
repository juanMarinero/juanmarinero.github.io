---
title: "Watcher Tree Files"
description: "Monitor Hugo projects with Linux's inotify tools. Learn to track file changes, build directory monitors, and integrate with Git for automated workflows."
keywords: ["inotifywait", "inotifywatch", "file system monitoring", "Linux commands", "Hugo development", "directory monitor", "shell scripting", "inotify-tools", "automate workflow", "file change detection", "Git integration", "systemd daemon", "infinite loop", "tree command", "real-time monitoring", "project monitoring", "development tools", "bash scripting", "file events", "Hugo project"]
---

Keeping track of file system changes is crucial for many development workflows,
for example when working with static site generators like Hugo.

What if you could not only see that a file changed but also get immediate, contextual information about its state?
This guide dives deep into using Linux's powerful `inotify` tools—`inotifywatch` and `inotifywait`—to monitor your project directory.

We'll start with basic usage examples for tracking new and modified files and then progress to building a little more sophisticated monitoring script that integrates with Git.


{{< details summary="**Index** - Click to expand 📜">}}

* [inotifywatch](#inotifywatch)
  * [Create a new post](#create-a-new-post)
  * [Render a new post](#render-a-new-post)
  * [Documentation](#documentation)
* [inotifywait](#inotifywait)
  * [Create the script](#create-the-script)
    * [Pitfall](#pitfall)
    * [Fixed script](#fixed-script)
  * [Documentation](#documentation)
* [inotifywait daemon mode](#inotifywait-daemon-mode)
  * [-d flag](#-d-flag)
* [Complement inotify](#complement-inotify)
  * [Install](#install)
  * [Test project](#test-project)
    * [File birth Git untracked](#file-birth-git-untracked)
    * [Modify a git tracked file](#modify-a-git-tracked-file)
    * [Commit a Git tracked file](#commit-a-git-tracked-file)
    * [Remove and commit a Git tracked file](#remove-and-commit-a-git-tracked-file)
    * [Rename a file](#rename-a-file)
{{< /details >}}

{{< rawhtml >}}
<div class="html-content">
<br>
</div>
{{< /rawhtml >}}

## inotifywatch

### Create a new post

Terminal 1:

```sh
cd <project_root> # edit!

inotifywatch -v -e modify -e create -t 60 -r ./
```

This command watches `-v`erbosely for `e`vents on files/dirs of type `modify` or `creat`ion in the current directory (`./`) and its subdirectories (`-r`ecursive).
It listens for an amount of `-t`ime of 60 seconds.

Terminal 2 (same CWD):

```sh
> hugo new postNew/index.md
Content "[...]/content/en/postNew/index.md" created
```

When the 60 seconds are done then the terminal 1 shows:


```text
Establishing watches...
Setting up watch(es) on ./
OK, ./ is now being watched.
Total of 451 watches.
Finished establishing watches, now collecting statistics.
Will listen for events for 60 seconds.
total  modify  create  filename
2      2       0       ./content/en/postNew/
1      0       1       ./content/en/
```


### Render a new post

Terminal 1 (same CWD):

```sh
inotifywatch -v -e modify -e create -t 60 -r ./
```


Terminal 2 (same CWD):

```sh
hugo server --disableFastRender
```

And browse [http://localhost:1313/postnew/](http://localhost:1313/postnew/) to make sure the new post is rendered.

When the 60 seconds are done then the terminal 1 shows:

```text
Establishing watches...
Setting up watch(es) on ./
OK, ./ is now being watched.
Total of 453 watches.
Finished establishing watches, now collecting statistics.
Will listen for events for 60 seconds.
total  modify  filename
2      2       ./public/postnew/
[...]
```

### Documentation

- `inotifywatch --help`
- [inotify-tools/man/inotifywatch.1.in](https://github.com/inotify-tools/inotify-tools/blob/master/man/inotifywatch.1.in)
- [atareao](https://atareao-es.translate.goog/software/utilidades/inotify-tools-o-automatizar-tu-sistema-de-archivos/?_x_tr_sl=en&_x_tr_tl=es&_x_tr_hl=es&_x_tr_pto=wapp#inotifywatch)
(Original version in Spanish)


## inotifywait

### Create the script

#### Pitfall

```sh
cd <project_root> # edit!

$EDITOR tree-monitor.sh
```

Paste next content to create a directory tree monitor

```sh
#!/bin/bash
inotifywait -m -r -e create,delete,move,modify ./ | while read path action file; do
  timestamp=$(date +%y%m%d-%H%M%S)
  tree ./ > "tree_${timestamp}.txt"
  echo "[$(date)] Tree updated due to $action in $path"
done
```

The flag `-m` is for monitoring mode:

> Keep listening for events forever or until --timeout expires.
> Without this option, inotifywait will exit after one event is received.

And make it executable

```sh
chmod +x tree-monitor.sh
```

##### Test it

Terminal 1:

```sh
cd <project_root> # edit!

# Remove previous new post
rm -rf  postNew/

# Run the script
./tree-monitor.sh
```

Terminal 2 (same CWD):

```sh
> hugo new postNew/index.md
Content "[...]/content/en/postNew/index.md" created
```

And now **STOP** the terminal 1 script (Ctrl+C) because it felt in an endless loop.

The terminal 1 outputs next. Note:
- `[...]` symbolizes previous output line repeated multiple times.
- While the diagonal dots mean that after last shown output is echoed several times,
then the next printed line is echoed also multiple times in a row,
and so on till the script is stopped.
- `dayD` and `yearY` represent the day and the year of the outputs. Shorted for brevity.

```text
> ./tree-monitor.sh
Setting up watches.  Beware: since -r was given, this may take a while!
Watches established.
[dayD 06:17:19 yearY] Tree updated due to CREATE,ISDIR in ./content/en/
[dayD 06:17:19 yearY] Tree updated due to CREATE in ./
[dayD 06:17:19 yearY] Tree updated due to MODIFY in ./
[dayD 06:17:19 yearY] Tree updated due to MODIFY in ./
[dayD 06:17:19 yearY] Tree updated due to MODIFY in ./
[dayD 06:17:19 yearY] Tree updated due to MODIFY in ./
[dayD 06:17:19 yearY] Tree updated due to MODIFY in ./
[dayD 06:17:19 yearY] Tree updated due to MODIFY in ./content/en/postNew/
[dayD 06:17:19 yearY] Tree updated due to MODIFY in ./content/en/postNew/
[dayD 06:17:19 yearY] Tree updated due to MODIFY in ./
[dayD 06:17:19 yearY] Tree updated due to MODIFY in ./
[...]
[dayD 06:17:20 yearY] Tree updated due to MODIFY in ./
[...]
[dayD 06:17:21 yearY] Tree updated due to MODIFY in ./
[.
  .
   .]
```

Just compare the two oldest `tree-*.txt` files in the directory. For example:

```sh
vim -d tree_250925-181719.txt \
       tree_250925-181720.txt
```

It shows that 

```text
├── tree_250925-181719.txt | ├── tree_250925-181719.txt
---------------------------| ├── tree_250925-181720.txt
├── tree-monitor.sh        | ├── tree-monitor.sh
└── _vendor                | └── _vendor
```

So `tree-monitor.sh` listens for events, among others it's triggered when the event `create` (new file/dir) happens.
The events order was:
1. The script is run manually (`./tree-monitor.sh`)
2. A new file is created manually (`hugo new postNew/index.md`)
3. The `inotifywait` command is run automatically (`inotifywait -m -r -e create,delete,move,modify ./`)
And executes the command `tree ./ > "tree_${timestamp}.txt"`
4. This new tree file is created in the current directory (`./`), thus the `inotifywait` listens for this creation and is run again.
5. Which generates a new tree file again.
6. And so on.


**TL;DR** The `inotifywait` command should (normally) not run a command that triggers itself. Otherwise it creates an infinite loop.


#### Fixed script

Just modify the script to save the tree files to another directory.

```sh
#!/bin/bash

# Set default values
WATCH_DIR="${1:-./}"
SAVE_DIR="${2:-$HOME/Downloads/tree-monitor}"
RUN_ONCE="${3:-false}"

# Create save directory if it doesn't exist
mkdir -p "$SAVE_DIR"

# Function to generate tree snapshot
generate_tree_snapshot() {
  local path="$1"
  local action="$2"
  local file="$3"
  
  local timestamp=$(date +%y%m%d-%H%M%S)
  local tree_file="tree_${timestamp}.txt"
  tree "$WATCH_DIR" > "$SAVE_DIR/$tree_file"
  echo "[$(date)] Tree updated due to $action in $path (saved to $SAVE_DIR/$tree_file)"
}

# If third argument is "true", generate one snapshot and exit
if [[ "$RUN_ONCE" == "true" ]]; then
  echo "Generating single tree snapshot..."
  generate_tree_snapshot "$WATCH_DIR" "manual" "triggered"
  exit 0
else
  echo "Monitoring directory: $WATCH_DIR"
  echo "Saving tree files to: $SAVE_DIR"

  inotifywait -m -r -e create,delete,move,modify "$WATCH_DIR" | while read path action file; do
    generate_tree_snapshot "$path" "$action" "$file"
  done
fi
```

You can move this script to any directory you want, e.g. `~/tree-monitor.sh`. But remember to pass the directory to watch as the first argument:

```sh
~/tree-monitor.sh /path/to/watch
```

And the path to save the tree files as the second argument (defaults to `~/Downloads/tree-monitor`):

```sh
~/tree-monitor.sh /path/to/watch /path/for/tree/files
```

For example

```sh
~/tree-monitor.sh [...]/Hugo_project ~/Downloads/tree-monitor
```

##### Test it

Terminal 1:

```sh
cd <project_root> # edit!

# Remove previous new post
rm -rf  postNew/
```

Run the script once with third argument `true` to generate a single tree snapshot.
Modify the script path (`./`) and the path to liston to, first argument (`./`), if needed.

```text
> ./tree-monitor.sh ./ ~/Downloads/tree-monitor "true"
Generating single tree snapshot...
[Thu Sep 25 06:41:54 PM CEST 2025] Tree updated due to manual in ./ (saved to ~/Downloads/tree-monitor/tree_250925-184154.txt)
```

In same terminal lets make the watcher listen for events:

```sh
# Run the script (adapt path if needed)
./tree-monitor.sh
```


Terminal 2 (same CWD):

```sh
> hugo new postNew/index.md
Content "[...]/content/en/postNew/index.md" created
```

And now **STOP** the terminal 1 script (Ctrl+C) because we no longer need it running.
It outputs:

```text
> ./tree-monitor.sh
Monitoring directory: ./
Saving tree files to: ~/Downloads/tree-monitor
Setting up watches.  Beware: since -r was given, this may take a while!
Watches established.
[Thu Sep 25 06:45:07 PM CEST 2025] Tree updated due to CREATE,ISDIR in ./content/en/ (saved to ~/Downloads/tree-monitor/tree_250925-184507.txt)
[Thu Sep 25 06:45:07 PM CEST 2025] Tree updated due to MODIFY in ./content/en/postNew/ (saved to ~/Downloads/tree-monitor/tree_250925-184507.txt)
[Thu Sep 25 06:45:07 PM CEST 2025] Tree updated due to MODIFY in ./content/en/postNew/ (saved to ~/Downloads/tree-monitor/tree_250925-184507.txt)
```

Just compare the only two `tree-*.txt` files:

```sh
vim -d ~/Downloads/tree-monitor/*.txt
```

It shows that the only difference is in the dir `content/en/postNew/` and its `index.md` file.

```text
│       └── license.md         |│       ├── license.md
-------------------------------|│       └── postNew
-------------------------------|│           └── index.md
├── data                       |├── data
```


### Documentation

- `inotifywait --help`
- [inotify-tools/man/inotifywait.1.in](https://github.com/inotify-tools/inotify-tools/blob/master/man/inotifywait.1.in)
- [atareao](https://atareao-es.translate.goog/software/utilidades/inotify-tools-o-automatizar-tu-sistema-de-archivos/?_x_tr_sl=en&_x_tr_tl=es&_x_tr_hl=es&_x_tr_pto=wapp#inotifywait)
(original version in Spanish)

## inotifywait daemon mode

In previous section we:
- Created a `inotifywait` process to listen for events
- We activated that script
- We triggered an event to test it, and we read the logs (directory tree snapshots in our case)
- Finally we stopped the `inotifywait` process

We can automate the previous steps by daemonizing the `inotifywait` process (enabling and starting a **`systemd`** unit).
This way the process runs on startup in the background and we don't have to stop it manually.

[Iespai](https://www-iespai-com.translate.goog/2025/06/12/%F0%9F%9B%A1%EF%B8%8F-como-usar-inotifywait-con-systemd-para-vigilar-directorios-en-linux/?_x_tr_sl=es&_x_tr_tl=en&_x_tr_hl=es&_x_tr_pto=wapp)
explains how
(original version in Spanish).


Problems with daemonizing `inotifywait`:

1. File descriptor issues - `inotify` watches can get lost when processes *daemonize*
2. Signal handling problems - `daemon`s might not handle signals properly
3. Resource leaks - `inotify` instances might not get cleaned up correctly
4. Buffer overruns - in background mode, output can get lost

Alternatives:
- [pm2](https://pm2.keymetrics.io/)
- tmux
- [screen](https://www.geeksforgeeks.org/linux-unix/screen-command-in-linux-with-examples/)
- Simple background process with proper logging like:
```sh
# Start with output logging
nohup inotifywait -m -r -e create,delete,move,modify ./ 2>&1 | while read path action file; do
    timestamp=$(date +%y%m%d-%H%M%S)
    tree ./ > "tree_${timestamp}.txt"
    echo "[$(date)] Tree updated due to $action in $path" >> tree-monitor.log
done > tree-monitor.out 2>&1 &

# Save the PID
echo $! > tree-monitor.pid

# Check if running
ps -p $(cat tree-monitor.pid 2>/dev/null) >/dev/null 2>&1 && echo "Running" || echo "Stopped"
```

### -d flag

The `-d` or `--daemon` flags are used, to run the `inotifywait` process in daemon mode.
The [man pages](https://github.com/inotify-tools/inotify-tools/blob/a8f024da45b8cc2c4c040a7165841f06841a00ad/man/inotifywait.1.in#L105C1-L107C59) states:

> Same as \-\-monitor, except run in the background logging events to a file
> that must be specified by \-\-outfile. Implies \-\-syslog.

Further details in [#144](https://github.com/inotify-tools/inotify-tools/issues/144).

Official practical examples:
- [inotify-tools/t/inotifywait-daemon-logs-chown.t](https://github.com/inotify-tools/inotify-tools/blob/master/t/inotifywait-daemon-logs-chown.t)
- [inotify-tools/t/inotifywait-daemon-logs-to-relative-paths.t](https://github.com/inotify-tools/inotify-tools/blob/master/t/inotifywait-daemon-logs-to-relative-paths.t)


## Complement inotify

The `inotify` events are a bit limited.
We can't watch for:
- New git-ignored files (just for new files)
- New git-tracked files (just for new files)
- Removed git-tracked files (just for removed files)
- Etc.

Lets create a monitoring script that integrates `inotify` with Git.

### Install

We are gonna install a easy program that will listen for events when `inotify` triggers it.

Find last file modified/added/removed/....
- What's its status: modified, commited, ignored, untracked,...
- If tracked and had a commit then show "git log" oneline of the last commit that this file participed

Follow the **simple install** steps of my [event file watcher](https://github.com/juanMarinero/watcher_tree_files#installation) repository.

### Test project

To make sure we are in the same scenario, lets download the [Hugo Scroll demo](https://zjedi.github.io/hugo-scroll/).

```sh
cd ~/Downloads
git clone https://github.com/zjedi/hugo-scroll
```

And make our CWD the `exampleSite` directory:

```sh
cd hugo-scroll/exampleSite
```


#### File birth Git untracked

We are going create a new Git-ignored file (`.lock`), but any file would work.

Inspect with [`watcher_tree_files/src/git_find_recent_events.sh`](https://github.com/juanMarinero/watcher_tree_files/blob/main/src/git_find_recent_events.sh)
in debug mode:

```sh
touch new_file_gitignored.lock
```


```sh
watcher_tree_files --cmd find_recent_events --debug
```

This shows that the birth and modify events are at same epoch time.
That's why our code uses a `BIRTH_GAP` constant to avoid that, the modify event must happend at least `BIRTH_GAP` mili-seconds after the birth event.

```text
Newest file by event:
"birth,file" -> ./new_file_gitignored.lock
"birth,time" -> 1758889657
"mod,file" -> ./new_file_gitignored.lock
"mod,time" -> 1758889657
"rename_uncommited,file" -> fix__rename_uncommited_func
"rename_uncommited,time" -> 0
"rm,file" -> 
"rm,time" -> 
"rm_uncommited,file" -> fix__rm_uncommited_func
"rm_uncommited,time" -> 0

Highest time: 2025-09-26 14:29:16 1758889657
Event:    birth
For file: ./new_file_gitignored.lock
```

The [`watcher_tree_files/src/git_info_lastfile.sh`](https://github.com/juanMarinero/watcher_tree_files/blob/main/src/git_info_lastfile.sh)
depends on the *last file* found in previous logic.
Now we just show the last commit involved (if any).

```sh
watcher_tree_files --cmd git_info_lastfile
```

Prints that is is not a Git tracked file. Which is value information *per se*, by itself.

```
Log file: ~/Downloads/tree-monitor/1758889657_-_birth_-_new_file_gitignored.lock.txt
Last event is:    birth
On file:          ./new_file_gitignored.lock
Time since epoch: 1758889657
----------------------------------------
🆕 Untracked
🚫 Not tracked by Git
----------------------------------------
File info: -rw-rw-r-- 1 USER USER 0 Sep 26 14:27 ./new_file_gitignored.lock
./new_file_gitignored.lock birth 1758889657
```


##### Combine with `inotifywait`

Create `~/Downloads/hugo-scroll/exampleSite/tree_monitor.sh` with next code.

```sh
#!/bin/bash

# Set default values
WATCH_DIR="${1:-./}"
SAVE_DIR="${2:-$HOME/Downloads/tree-monitor}"
RUN_ONCE="${3:-false}"

# Create save directory if it doesn't exist
mkdir -p "$SAVE_DIR"

# Function to generate tree snapshot
generate_tree_snapshot() {
  path="$1"
  action="$2"
  file="$3"
  tree_file="$4"
  
  echo "path: $path, action: $action, file: $file" > "$tree_file"
  tree "$WATCH_DIR" >> "$tree_file"
  echo "Tree updated due to $action in $path (saved to $tree_file)"
}

# If third argument is "true", generate one snapshot and exit
if [[ "$RUN_ONCE" == "true" ]]; then
  echo "Generating single tree snapshot..."
  generate_tree_snapshot "$WATCH_DIR" "manual" "triggered" $SAVE_DIR/000000-000000-tree.txt
  exit 0
else
  echo "Monitoring directory: $WATCH_DIR"
  echo "Saving tree files to: $SAVE_DIR"

  inotifywait -m -r -e create,delete,move,modify "$WATCH_DIR" | while read path action file; do
    # Get last file and event
    results=($(watcher_tree_files --cmd git_info_lastfile --save-dir $SAVE_DIR));
    last_file=${results[0]}
    event=${results[1]}
    event_time=${results[2]}
    # Remove initial "./" and replace all "/" with "__"
    filename=$(echo "$last_file" | sed 's|^\./||' | sed 's/\//__/g')
    # Add time and event in log file
    tree_file="$SAVE_DIR/${event_time}_-_${event}_-_${filename}_-_tree.txt"

    if [ ! -s "$tree_file" ]; then
      # File does not exist or is empty, so output to it
      generate_tree_snapshot "$path" "$action" "$file" "$tree_file"
      sleep 0.1
    else
      echo "[$(date)] Already exists the tree $tree_file"
    fi
  done
fi
```

Remove the previous file:

```sh
rm new_file_gitignored.lock
```

Generate a tree snapshot:

```
> ./tree-monitor.sh ./ ~/Downloads/tree-monitor "true"
Generating single tree snapshot...
Tree updated due to manual in ./ (saved to ~/Downloads/tree-monitor/000000-000000-tree.txt)
```

In terminal 1 activate the watcher:

```sh
# Run the script (adapt path if needed)
./tree-monitor.sh
```

Terminal 2 (same CWD):

```sh
touch new_file_gitignored.lock
```


And now **STOP** the terminal 1 script (Ctrl+C) because we no longer need it running.
It outputs:

```text
> ./tree-monitor.sh
Monitoring directory: ./
Saving tree files to: ~/Downloads/tree-monitor
Setting up watches.  Beware: since -r was given, this may take a while!
Watches established.
Getting info about last file-event...

Last event is:    birth
On file:          ./new_file_gitignored.lock
Time since epoch: 1758889657
----------------------------------------
🆕 Untracked
🚫 Not tracked by Git
----------------------------------------
File info:
-rw-rw-r-- 1 USER USER 0 Sep 26 14:27 ./new_file_gitignored.lock
Tree updated due to CREATE in ./ (saved to ~/Downloads/tree-monitor/1758889657_-_birth_-_new_file_gitignored.lock_-_tree.txt)
Getting info about last file-event...

[dayD 02:27:38 yearY] Already exists the tree ~/Downloads/tree-monitor/1758889657_-_birth_-_new_file_gitignored.lock_-_tree.txt
Getting info about last file-event...

[dayD 02:27:39 yearY] Already exists the tree ~/Downloads/tree-monitor/1758889657_-_birth_-_new_file_gitignored.lock_-_tree.txt
Getting info about last file-event...

[...]
```

Just compare the only two `*tree.txt` files (the manual generated one and the one created by the watcher):

```sh
vim -d ~/Downloads/tree-monitor/*tree.txt
```

It shows that the only difference is in the dir `content/en/postNew/` and its `index.md` file.

```text
├── LICENSE            | ├── LICENSE
-----------------------| ├── new_file_gitignored.lock
├── public             | ├── public
│   ├── 404.html       | │   ├── 404.html
```

The file `1758889657_-_birth_-_new_file_gitignored.lock.txt` is also created (if we did previously removed it) with same content as seen before.

In summary, the watcher created:
- A `epochTime_-_event_-_filepath_-_tree.txt` tree file
- A `epochTime_-_event_-_filepath.txt` file describing the Git event


#### Modify a git tracked file

In terminal 1 activate the watcher:

```sh
# Run the script (adapt path if needed)
./tree-monitor.sh
```

Terminal 2 (same CWD):

```sh
echo "# new line" >> hugo.toml
```

And now **STOP** the terminal 1 script (Ctrl+C) because we no longer need it running.
It outputs:

```text
> ./tree-monitor.sh
Monitoring directory: ./
Saving tree files to: ~/Downloads/tree-monitor
Setting up watches.  Beware: since -r was given, this may take a while!
Watches established.
Getting info about last file-event...

Last event is:    mod
On file:          ./hugo.toml
Time since epoch: 1758898130
----------------------------------------
📝 Modified (tracked but changed)
📋 Tracked by Git
📜 Last commit involving this file:
   2c765e4 Initial commit
----------------------------------------
File info: -rw-rw-r-- 1 USER USER 4347 Sep 26 16:48 ./hugo.toml
Tree updated due to MODIFY in ./ (saved to ~/Downloads/tree-monitor/1758898130_-_mod_-_hugo.toml_-_tree.txt)
Getting info about last file-event...

[Fri Sep 26 04:48:51 PM CEST 2025] Already exists the tree ~/Downloads/tree-monitor/1758898130_-_mod_-_hugo.toml_-_tree.txt
Getting info about last file-event...

[Fri Sep 26 04:48:51 PM CEST 2025] Already exists the tree ~/Downloads/tree-monitor/1758898130_-_mod_-_hugo.toml_-_tree.txt
Getting info about last file-event...

[...]
```

Check the files in the logs directory.

```text
> ls -l ~/Downloads/tree-monitor/
[...] 14:27 000000-000000-tree.txt
[...] 14:27 1758889657_-_birth_-_new_file_gitignored.lock_-_tree.txt
[...] 14:27 1758889657_-_birth_-_new_file_gitignored.lock.txt
[...] 16:48 1758898130_-_mod_-_hugo.toml_-_tree.txt
[...] 16:48 1758898130_-_mod_-_hugo.toml.txt
```

Read the log file `1758898130_-_mod_-_hugo.toml.txt`:

```text
Last event is:    mod
On file:          ./hugo.toml
Time since epoch: 1758898130
----------------------------------------
📝 Modified (tracked but changed)
📋 Tracked by Git
📜 Last commit involving this file:
   2c765e4 Initial commit
----------------------------------------
File info: -rw-rw-r-- 1 USER USER 4347 Sep 26 16:48 ./hugo.toml
```


Diff the newest trees. Define next auxiliar function and call it (`vimdiff_newest_trees`).

```sh
vimdiff_newest_trees() {
  # Find the two newest files matching the pattern
  newest_files=( $(\ls -t ~/Downloads/tree-monitor/*tree.txt 2>/dev/null | head -n 2) )

  # Check if we got two files
  if [ ${#newest_files[@]} -lt 2 ]; then
    echo "Less than two matching files found."
    exit 1
  fi

  # Compare their contents
  if cmp -s "${newest_files[0]}" "${newest_files[1]}"; then
    echo "The two newest files have identical content."
  else
    vim -d $newest_files
  fi
}
```

The project file structure is identical. Just the header differs:

```
path: ./, action: MODIFY, file: hugo.toml | path: ./, action: CREATE, file: new_file_gitignored.lock
```


#### Commit a Git tracked file


In terminal 1 activate the watcher:

```sh
# Run the script (adapt path if needed)
./tree-monitor.sh
```

Terminal 2 (same CWD):

```sh
git add ./hugo.toml
# But still do not commit
```

And now **STOP** the terminal 1 script (Ctrl+C) because we no longer need it running.
It outputs nothing, so no listening event happens.
`ls -l ~/Downloads/tree-monitor/` does neither change.

Thus, no `inotifywait` event is triggered after staging a file.

Though we can run `watcher_tree_files --cmd git_info_lastfile --debug` and the next log file is created:

```text
> cat 1758901794_-_mod_-_hugo.toml.txt
Last event is:    mod
On file:          ./hugo.toml
Time since epoch: 1758901809
----------------------------------------
📝 Staged modified
📋 Tracked by Git
📜 Last commit involving this file:
   d326aa7 Use Font Awesome instead of Fork Awesome
----------------------------------------
File info: -rw-rw-r-- 1 USER USER 4347 Sep 26 17:50 ./hugo.toml
```

We can manually trigger the creation of another tree.
But it would be in vain since a stage does not remove nor create a file (except in the `.git/` directory).


The commit would have same effects.

1. Run `./tree-monitor.sh` again in a terminal.
2. Then commit the file with `git commit -m "mod hugo.toml"`
3. Observe that the watcher is still running but no event is triggered. Stop it.
4. Manually inspect the git status with `watcher_tree_files --cmd git_info_lastfile --debug`, it outputs:

```text
Highest time: 2025-09-26 18:03:25 1758901809
Event:    mod
For file: ./hugo.toml

Log file: ~/Downloads/tree-monitor/1758901809_-_mod_-_hugo.toml.txt
Last event is:    mod
On file:          ./hugo.toml
Time since epoch: 1758901809
----------------------------------------
✅ Tracked and clean (no modifications)
📋 Tracked by Git
📜 Last commit involving this file:
   174e324 mod hugo.toml
----------------------------------------
File info: -rw-rw-r-- 1 USER USER 4347 Sep 26 17:50 ./hugo.toml
./hugo.toml mod 1758901809
```

Notice the epoch time did not change, thus the record file was not modified (`watcher_tree_files` checks if the file is empty, if not it does not overwrite it).



#### Remove and commit a Git tracked file

In our Git repo, remove a tracked file.

```sh
git rm assets/images/chef-hat.png
```

If `./tree-monitor.sh` was listening our project then the event `delete` of `inotifywait -m -r -e create,delete,move,modify` should have make it trigger.

But `watcher_tree_files/src/git_find_recent_events.sh` has no function for the `delete` event (`rm_uncommited_func` is a TODO).
Therefore, other previous events will have more recent time of epoch.

On the other hand, if we commit the staged delete with

```sh
git commit -m "remove chef-hat.png"
```

Then:
- `inotifywait` does not monitor that commit.
- But at least `watcher_tree_files/src/git_find_recent_events.sh` will find the git-`delete` event.

Thus, run manually
```sh
watcher_tree_files --cmd git_info_lastfile --debug
```

To obtain alike:

```
Highest time: 2025-09-26 18:20:11 1758903596
Event:    rm
For file: exampleSite/assets/images/chef-hat.png

Log file: ~/Downloads/tree-monitor/1758903596_-_rm_-_exampleSite__assets__images__chef-hat.png.txt
Last event is:    rm
On file:          exampleSite/assets/images/chef-hat.png
Time since epoch: 1758903596
----------------------------------------
✅ Tracked and clean (no modifications)
🚫 Not tracked by Git
----------------------------------------
exampleSite/assets/images/chef-hat.png rm 1758903596
```


#### Rename a file

The `git mv` command to rename files present analogous inconsistencies.

`rename_func` is a **TODO** chunk of [`watcher_tree_files/src/git_info_lastfile.sh`](https://github.com/juanMarinero/watcher_tree_files/blob/main/src/git_info_lastfile.sh).

Example. It will not show `video_new_name.mp4` as modified/created.
Because
- This new file is not tracked by Git [unless you set as `mv` destiny an already tracked file in Git].
Git itself does not track or remember the creation time of untracked files or the first time it saw an untracked file.
- The `mv` command doesn't change the file's content or metadata timestamps - it just changes the directory entry pointing to the file.

```sh
cd assets/cover/ \
  && mv pexels-pressmaster-3209239-960x540-25fps.mp4 video_new_name.mp4 \
  && cd -
watcher_tree_files --cmd git_info_lastfile --debug
```

Try it yourself!


### What's next?

- The [source code](https://github.com/juanMarinero/watcher_tree_files) has several **TODO**s chunks to be completed. PR are very welcome.
- `vimdiff_newest_trees` is very limited. Ideally a GUI could be created to compare every pair of trees.
As well as display the record file associated to that same epoch time event.


{{< rawhtml >}}
  <br>
  <br>
  <a id="back-to-blogs-index" href="/blogs_index"><i class="fa fa-chevron-left" aria-hidden="true"></i> Blogs</a> 
  <br>
  <a id="back-to-main-page" href="/"><i class="fa fa-chevron-left" aria-hidden="true"></i>J. Marinero - Data Scientist & AI Engineer</a>
  <br>
{{< /rawhtml >}}
