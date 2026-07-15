const scene = document.getElementById("scene");
const lens = document.getElementById("lens");
const lensContent = document.getElementById("lens-content");
const scaleInput = document.getElementById("scale");
const radiusInput = document.getElementById("radius");
const displacementMapNode = document.getElementById("displacement-map-node");
const filter = document.getElementById("aave-glass-filter");
const displacementNodes = {
  red: document.getElementById("disp-r"),
  green: document.getElementById("disp-g"),
  blue: document.getElementById("disp-b"),
};

const state = {
  dragging: false,
  pointerOffsetX: 0,
  pointerOffsetY: 0,
  lensX: 164,
  lensY: 116,
  lensW: 188,
  lensH: 238,
  radius: 30,
};

function syncLensPosition() {
  scene.style.setProperty("--lens-x", `${state.lensX}px`);
  scene.style.setProperty("--lens-y", `${state.lensY}px`);
  lensContent.style.transform = `translate(${-state.lensX}px, ${-state.lensY}px)`;
}

function buildLensMap(width, height, radius) {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext("2d");
  const image = ctx.createImageData(width, height);
  const data = image.data;

  const cx = width / 2;
  const cy = height / 2;
  const halfW = width / 2;
  const halfH = height / 2;
  const maxInsetX = Math.max(halfW - radius, 1);
  const maxInsetY = Math.max(halfH - radius, 1);

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const i = (y * width + x) * 4;
      const nx = (x - cx) / halfW;
      const ny = (y - cy) / halfH;
      const absX = Math.abs(x - cx);
      const absY = Math.abs(y - cy);

      const cornerDx = Math.max(absX - maxInsetX, 0);
      const cornerDy = Math.max(absY - maxInsetY, 0);
      const cornerDistance = Math.hypot(cornerDx, cornerDy);
      const insideRoundedRect = cornerDistance <= radius;

      if (!insideRoundedRect) {
        data[i] = 128;
        data[i + 1] = 128;
        data[i + 2] = 0;
        data[i + 3] = 255;
        continue;
      }

      const radial = Math.max(0, 1 - Math.sqrt(nx * nx + ny * ny));
      const gain = radial * radial;
      const dx = nx * gain;
      const dy = ny * gain;

      data[i] = Math.round(128 + dx * 74);
      data[i + 1] = Math.round(128 + dy * 74);
      data[i + 2] = 0;
      data[i + 3] = 255;
    }
  }

  ctx.putImageData(image, 0, 0);
  return canvas.toDataURL("image/png");
}

function updateMap() {
  displacementMapNode.setAttribute("href", buildLensMap(state.lensW, state.lensH, state.radius));
  document.documentElement.style.setProperty("--lens-radius", `${state.radius}px`);
}

function setScale() {
  const scale = Number(scaleInput.value);
  displacementNodes.red.setAttribute("scale", String(scale + 3));
  displacementNodes.green.setAttribute("scale", String(scale));
  displacementNodes.blue.setAttribute("scale", String(Math.max(scale - 3, 1)));
}

function cloneSceneIntoLens() {
  const clone = scene.cloneNode(true);
  clone.querySelector(".lens")?.remove();
  clone.removeAttribute("id");
  lensContent.replaceChildren(...clone.childNodes);
}

function clampLens() {
  const maxX = scene.clientWidth - state.lensW;
  const maxY = scene.clientHeight - state.lensH;
  state.lensX = Math.max(0, Math.min(maxX, state.lensX));
  state.lensY = Math.max(0, Math.min(maxY, state.lensY));
}

lens.addEventListener("pointerdown", (event) => {
  state.dragging = true;
  const rect = lens.getBoundingClientRect();
  state.pointerOffsetX = event.clientX - rect.left;
  state.pointerOffsetY = event.clientY - rect.top;
  lens.setPointerCapture(event.pointerId);
});

lens.addEventListener("pointermove", (event) => {
  if (!state.dragging) return;
  const rect = scene.getBoundingClientRect();
  state.lensX = event.clientX - rect.left - state.pointerOffsetX;
  state.lensY = event.clientY - rect.top - state.pointerOffsetY;
  clampLens();
  syncLensPosition();
});

lens.addEventListener("pointerup", () => {
  state.dragging = false;
});

lens.addEventListener("pointercancel", () => {
  state.dragging = false;
});

scaleInput.addEventListener("input", setScale);
radiusInput.addEventListener("input", () => {
  state.radius = Number(radiusInput.value);
  updateMap();
});

cloneSceneIntoLens();
syncLensPosition();
updateMap();
setScale();
