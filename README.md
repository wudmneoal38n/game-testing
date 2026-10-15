# Rainbow Meadow

A gentle multiplication game for children, with Luna the unicorn and Pip the fluffy pup. Practise single digit multiplication (1–9), choose a times table, pick Luna or Pip, and tap one of three answer hoops to make your friend jump through it. After each correct jump, the next question appears automatically. Use groups-of-dots hints and collect ten stars. Incorrect answers can be retried without a penalty or timer.

Serve the folder locally:

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

## 3D controls

Choose Luna or Pip. Use **Left / Right arrows** to move between answer gates and **Up arrow (↑)** to jump (Space / Enter also work). Touch users can use the arrow and Jump buttons, or tap an answer directly. Correct jumps advance automatically.

The 3D meadow fills the browser viewport, with floating question and touch controls. Animals have soft shadows, detailed coats and animated legs.

The meadow and animals use local Three.js 0.180.0 (MIT; license in `vendor/THREE-LICENSE.txt`). No build or CDN is required. A WebGL-capable browser shows the 3D models; browsers without WebGL retain the illustrated jumping game. Serve over HTTP rather than opening the HTML file directly, because the 3D code uses JavaScript modules.
