# Rainbow Meadow

A gentle multiplication game for children, with Luna the unicorn and Pip the fluffy pup. Practise single digit multiplication (1–9), choose a times table, see groups-of-dots hints, and collect ten stars. Incorrect answers can be retried without a penalty or timer.

Open `index.html` in a browser, or serve the folder:

```sh
cd /workspace/game-testing
python3 -m http.server 8000
```

No build step, account, backend, or package installation is needed. Progress lasts for the current session. All fonts, styling, and game logic are local. No external requests are needed.

## Run from GitHub

The game lives on the `main` branch. To host it with GitHub Pages:

1. Open the repository's **Settings → Pages**.
2. Under **Build and deployment**, choose **Deploy from a branch**.
3. Select **main** and **/ (root)**, then save.
4. Wait for the Pages deployment to complete and open the site link shown there.

GitHub Pages serves `index.html` directly; no build command is required.
