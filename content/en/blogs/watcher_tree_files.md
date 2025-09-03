---
title: "Watcher Tree Files"
description: "TODO"
keywords: ["TODO"]
draft: true
---

## Purpose

For example to see all files in a Hugo site

This way one can:
- notice how the tree structure evolves (which files are new)
- ideally the newest files (created in last minutes) have a dark green color
- fear request: See from last commit the first line edited in each text file
- feat request: to have left-right arrow to move to previous/next file structures (eqch file structure with time of creation) in time, e.g. to ser that a file was added/removed 
- feat request: like above but to compare current file structure with the previous, like a git diff

This would be ideal for recording tutorials. So one can see what is last file added/removed, 1 line of each commit on eqch file, compare how the file tree evolved


## Last file modified/added/...

Find last file modified/added/removed/....
- What's its status: modified, commited, ignored, untracked,...
- If tracked and had a commit then show "git log" oneline of the last commit that this file participed


## Install

### Pre-requisites

TODO


### Program

Install my [event file watcher](https://github.com/juanMarinero/watcher_tree_files).

TODO: inotify-tools


### Test

```sh
cd ~/Downloads
git clone https://github.com/zjedi/hugo-scroll
cd hugo-scroll/exampleSite
```


#### Stack tracked events


##### File birth

We are going create a new Git-ignored file (`.lock`), but any file would work.

Inspect with [`watcher_tree_files/src/find_recent_events.sh`](https://github.com/juanMarinero/watcher_tree_files/blob/main/src/find_recent_events.sh)
in debug mode:

```sh
touch new_file_gitignored.lock
```


```sh
watcher_tree_files --cmd find_recent_events --debug
```

```
...
```

The [`watcher_tree_files/src/find_recent_events.sh`](https://github.com/juanMarinero/watcher_tree_files/blob/main/src/find_recent_events.sh)
depend on the *last file* found in previous logic.
Now we just show the last commit involved (if any).

```sh
watcher_tree_files --cmd git_info_lastfile
```

```
...
```

##### File modification

Append a new line to `hugo.toml`.

```sh
echo "# new line" >> hugo.toml
```

Run the last function in debug mode to see the debugs of all functions:

```sh
watcher_tree_files --cmd git_info_lastfile --debug
```

```
...
```


#### Git tracked events



##### Remove and commit a Git tracked file

In our Git repo, remove a tracked file.

```sh
git rm assets/images/chef-hat.png
git commit -m "remove chef-hat.png"
```


```sh
watcher_tree_files --cmd git_info_lastfile --debug
```

```
...
```


#### inotify-tools tracked events

##### Rename a file

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
git_info_lastfile
```


##### Remove a file

TODO





### Show tree


```sh
colorls -A --tree=99 --gs --group-directories-first .
```


```
 └──    D?    assets/ 
 │  └────    D?    cover/ 
 │  │  └────     ?    video_new_name.mp4  
 │  └────     D    images/ 
 │  │  ├────     ✓    apple-touch-icon.png  
 │  │  ├────     ✓    asset-happy-ethnic-woman-sitting-at-table-with-laptop-3769021.de.jpg  
 │  │  ├────     ✓    asset-happy-ethnic-woman-sitting-at-table-with-laptop-3769021.jpg  
 │  │  ├────     ✓    cover-image.jpg  
 │  │  └────     ✓    favicon.png  
 │  └────     ✓    favicon.ico  
 └──     ✓    content/ 
 │  └────     [...]
 └──     ✓    layouts/ 
 │  └────     [...]
 └──     ✓    static/ 
 │  └────      [...]
 ├──     M    hugo.toml
 └──      ?  git-info-lastfile.sh
 └──          new_file_gitignored.lock  
```

git log --oneline -1
```
54f7b85 (HEAD -> master, origin/master, origin/HEAD) chore(deps-dev): bump prettier from 2.8.7 to 3.5.3
```

git status --short
```
 D assets/cover/pexels-pressmaster-3209239-960x540-25fps.mp4
 D assets/images/chef-hat.png
 M hugo.toml
?? assets/cover/video_new_name.mp4
```

git check-ignore -v $(git ls-files --others --ignored --exclude-standard)
```
.gitignore:5:*.lock	new_file_gitignored.lock
```




{{< rawhtml >}}
  <br>
  <br>
  <a id="back-to-blogs-index" href="/blogs_index"><i class="fa fa-chevron-left" aria-hidden="true"></i> Blogs</a> 
  <br>
  <a id="back-to-main-page" href="/"><i class="fa fa-chevron-left" aria-hidden="true"></i>J. Marinero - Data Scientist & AI Engineer</a>
  <br>
{{< /rawhtml >}}
