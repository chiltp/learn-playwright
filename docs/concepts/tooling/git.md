# Git & GitHub

## Local commit vs push to GitHub

- `git commit` = save a snapshot on **your machine only**
- `git push` = send your commits to **GitHub (remote server)**
- You can make many local commits before pushing — they all get sent at once

## The Git workflow

```
Write code → git add (stage) → git commit (local snapshot) → git push (send to GitHub)
```

| Command | What it does |
|---|---|
| `git status` | See what changed |
| `git add <files>` | Stage files for commit |
| `git commit -m "message"` | Save snapshot locally |
| `git push origin main` | Send to GitHub |
| `git pull origin main` | Get latest from GitHub |
| `git diff` | See unstaged changes |
| `git checkout -b feature/name` | Create a new branch |

## Branching

Branches are like a test kitchen — experiment with a new recipe without touching the main menu. Create a Pull Request to merge back into `main` after review.
