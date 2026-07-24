(() => {
  const story = document.querySelector("[data-contact-story]");
  const stage = document.querySelector("[data-contact-stage]");
  const field = document.querySelector("[data-contact-field]");
  if (!story || !stage || !field) return;

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const clamp = (value, min = 0, max = 1) => Math.max(min, Math.min(max, value));
  const lerp = (start, end, amount) => start + (end - start) * amount;
  const smooth = (value) => {
    const progress = clamp(value);
    return progress * progress * (3 - 2 * progress);
  };
  const visibleItems = () => [...field.querySelectorAll("[data-contact-object]")]
    .filter((item) => getComputedStyle(item).display !== "none");

  let state = "static";
  let released = false;
  const releasedItems = new Set();
  let entranceFrame;
  let entranceStart = 0;
  let entranceStarted = false;
  let entranceCancelled = false;
  let engine;
  let bodies = [];
  let animationFrame;
  let lastTimestamp = 0;
  let releaseTimestamp = 0;
  let quietFrames = 0;
  let dragged;
  let dragConstraint;
  let matterPromise;
  let finaleVisible = true;
  let copyTimer;
  let viewportLock;
  let contactImagesReady;

  const entranceDuration = 4800;
  const spiralTurns = 2;
  const centreScale = .7;
  const spiralStartAngle = -Math.PI * .75;
  const releaseThreshold = .985;

  function setState(next) {
    state = next;
    story.dataset.finaleState = next;
  }

  function lockViewport() {
    if (viewportLock) return;
    const root = document.documentElement;
    const body = document.body;
    const rootScrollBehavior = root.style.scrollBehavior;
    const stageTop = stage.getBoundingClientRect().top + window.scrollY;
    root.style.scrollBehavior = "auto";
    window.scrollTo(0, stageTop);
    const scrollY = window.scrollY;
    const scrollbarGap = Math.max(0, window.innerWidth - root.clientWidth);
    viewportLock = {
      scrollY,
      rootOverflow: root.style.overflow,
      rootScrollBehavior,
      bodyPosition: body.style.position,
      bodyTop: body.style.top,
      bodyLeft: body.style.left,
      bodyRight: body.style.right,
      bodyWidth: body.style.width,
      bodyPaddingRight: body.style.paddingRight,
    };
    root.style.overflow = "hidden";
    body.style.position = "fixed";
    body.style.top = `${-scrollY}px`;
    body.style.left = "0";
    body.style.right = "0";
    body.style.width = "100%";
    if (scrollbarGap) {
      body.style.paddingRight = `${parseFloat(getComputedStyle(body).paddingRight) + scrollbarGap}px`;
    }
    root.style.scrollBehavior = rootScrollBehavior;
    story.dataset.viewportLocked = "true";
  }

  function unlockViewport() {
    if (!viewportLock) return;
    const root = document.documentElement;
    const body = document.body;
    const saved = viewportLock;
    viewportLock = undefined;
    root.style.scrollBehavior = "auto";
    root.style.overflow = saved.rootOverflow;
    body.style.position = saved.bodyPosition;
    body.style.top = saved.bodyTop;
    body.style.left = saved.bodyLeft;
    body.style.right = saved.bodyRight;
    body.style.width = saved.bodyWidth;
    body.style.paddingRight = saved.bodyPaddingRight;
    window.scrollTo(0, saved.scrollY);
    root.style.scrollBehavior = saved.rootScrollBehavior;
    story.dataset.viewportLocked = "false";
  }

  function loadMatterRuntime() {
    if (window.Matter) return Promise.resolve(window.Matter);
    if (matterPromise) return matterPromise;
    matterPromise = new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = "vendor/matter.min.js";
      script.onload = () => window.Matter
        ? resolve(window.Matter)
        : reject(new Error("Matter did not initialize"));
      script.onerror = () => reject(new Error("Matter failed to load"));
      document.head.append(script);
    });
    return matterPromise;
  }

  function buildArcLengthLookup() {
    const samples = 240;
    const lookup = [{ n: 0, length: 0 }];
    let total = 0;
    let previous = { x: 1, y: 0 };
    for (let index = 1; index <= samples; index += 1) {
      const n = index / samples;
      const angle = n * spiralTurns * Math.PI * 2;
      const radius = 1 - n;
      const point = {
        x: radius * Math.cos(angle),
        y: radius * Math.sin(angle),
      };
      total += Math.hypot(point.x - previous.x, point.y - previous.y);
      lookup.push({ n, length: total });
      previous = point;
    }
    lookup.forEach((entry) => { entry.length /= total; });
    return lookup;
  }

  const spiralArcLengths = buildArcLengthLookup();

  function arcLengthToParameter(progress) {
    const target = clamp(progress);
    let low = 0;
    let high = spiralArcLengths.length - 1;
    while (low < high - 1) {
      const middle = Math.floor((low + high) / 2);
      if (spiralArcLengths[middle].length < target) low = middle;
      else high = middle;
    }
    const start = spiralArcLengths[low];
    const end = spiralArcLengths[high];
    const span = Math.max(.000001, end.length - start.length);
    return lerp(start.n, end.n, (target - start.length) / span);
  }

  function spiralPose(index, count, progress, width, height) {
    const phaseGap = width < 640 ? .035 : .045;
    const stream = clamp(progress * (1 + phaseGap * (count - 1)) - index * phaseGap);
    const n = arcLengthToParameter(stream);
    const centreX = width * .5;
    const centreY = height * .46;
    const maxRadius = Math.hypot(width, height) * .58;
    const angle = spiralStartAngle + n * spiralTurns * Math.PI * 2;
    const radiusX = width < 640 ? width * .46 * (1 - n) : maxRadius * (1 - n);
    const radiusY = width < 640 ? height * .42 * (1 - n) : maxRadius * (1 - n);
    const convergence = smooth((stream - .94) / .06);
    const releaseSpan = Math.min(width * (width < 640 ? .56 : .36), width < 640 ? 220 : 520);
    const releaseOrder = count > 1 ? ((index * 5) % count) / (count - 1) - .5 : 0;
    const releaseX = releaseOrder * releaseSpan * convergence;
    const releaseY = (-height * .045 + ((index * 2) % 3 - 1) * Math.min(18, height * .02)) * convergence;
    const x = centreX + Math.cos(angle) * radiusX + releaseX;
    const y = centreY + Math.sin(angle) * radiusY + releaseY;
    const nextN = Math.min(1, n + .001);
    const nextAngle = spiralStartAngle + nextN * spiralTurns * Math.PI * 2;
    const nextRadiusX = width < 640 ? width * .46 * (1 - nextN) : maxRadius * (1 - nextN);
    const nextRadiusY = width < 640 ? height * .42 * (1 - nextN) : maxRadius * (1 - nextN);
    const nextX = centreX + Math.cos(nextAngle) * nextRadiusX;
    const nextY = centreY + Math.sin(nextAngle) * nextRadiusY;
    return {
      x,
      y,
      angle: Math.atan2(nextY - y, nextX - x),
      scale: lerp(1, centreScale, n),
      opacity: clamp(stream * 8),
      progress: n,
      stream,
    };
  }

  function itemWidth(item, stageWidth) {
    const scale = stageWidth < 640 ? .68 : stageWidth < 1100 ? .82 : 1;
    return Number(item.dataset.bodyWidth || 210) * scale;
  }

  function applySpiral(progress) {
    const width = stage.clientWidth;
    const height = stage.clientHeight;
    const items = visibleItems();
    const poses = [];
    items.forEach((item, index) => {
      const pose = spiralPose(index, items.length, progress, width, height);
      poses.push({ item, index, pose });
      if (releasedItems.has(item)) return;
      item.style.setProperty("--body-width", `${itemWidth(item, width)}px`);
      item.style.opacity = pose.opacity.toFixed(3);
      item.style.transform = `translate3d(${pose.x - item.offsetWidth / 2}px, ${pose.y - item.offsetHeight / 2}px, 0) rotate(${pose.angle}rad) scale(${pose.scale})`;
      item.dataset.poseX = String(pose.x);
      item.dataset.poseY = String(pose.y);
      item.dataset.poseAngle = String(pose.angle);
      item.dataset.poseScale = String(pose.scale);
      item.dataset.poseProgress = String(pose.progress);
    });
    return poses;
  }

  async function waitForContactImages() {
    const images = visibleItems().flatMap((item) => [...item.querySelectorAll("img")]);
    const decodeImage = (image) => {
      image.loading = "eager";
      if (image.complete && image.naturalWidth > 0) {
        return typeof image.decode === "function" ? image.decode().catch(() => undefined) : Promise.resolve();
      }
      return new Promise((resolve) => {
        const finish = () => {
          image.removeEventListener("load", finish);
          image.removeEventListener("error", finish);
          resolve();
        };
        image.addEventListener("load", finish, { once: true });
        image.addEventListener("error", finish, { once: true });
      }).then(() => (typeof image.decode === "function" ? image.decode().catch(() => undefined) : undefined));
    };
    await Promise.race([
      Promise.allSettled(images.map(decodeImage)),
      new Promise((resolve) => setTimeout(resolve, 3000)),
    ]);
  }

  function prepareContactImages() {
    if (!contactImagesReady) contactImagesReady = waitForContactImages();
    return contactImagesReady;
  }

  async function startEntrance() {
    if (entranceStarted || reducedMotion.matches) return;
    entranceStarted = true;
    setState("preparing");
    lockViewport();
    story.dataset.entranceStarts = String(Number(story.dataset.entranceStarts || 0) + 1);
    await prepareContactImages();
    if (entranceCancelled) return;
    setState("entrance");
    try {
      await preparePhysics();
    } catch {
      unlockViewport();
      showStaticFallback();
      return;
    }
    if (entranceCancelled) return;
    entranceStart = performance.now();
    entranceFrame = requestAnimationFrame(stepEntrance);
  }

  function stepEntrance(timestamp) {
    const progress = clamp((timestamp - entranceStart) / entranceDuration);
    story.dataset.entranceProgress = progress.toFixed(4);
    const poses = applySpiral(progress);
    poses.forEach(({ item, index, pose }) => {
      if (!releasedItems.has(item) && pose.stream >= releaseThreshold) {
        releaseItemToPhysics(item, index);
      }
    });
    if (progress < 1) {
      entranceFrame = requestAnimationFrame(stepEntrance);
      return;
    }
    entranceFrame = undefined;
    releaseToPhysics();
  }

  function createBoundaries(width, height) {
    const { Bodies } = Matter;
    const thickness = 160;
    return [
      Bodies.rectangle(width / 2, height + thickness / 2 - 10, width + thickness * 2, thickness, { isStatic: true, label: "floor" }),
      Bodies.rectangle(width / 2, -thickness / 2 + 10, width + thickness * 2, thickness, { isStatic: true, label: "ceiling" }),
      Bodies.rectangle(-thickness / 2 + 10, height / 2, thickness, height * 2, { isStatic: true, label: "wall-left" }),
      Bodies.rectangle(width + thickness / 2 - 10, height / 2, thickness, height * 2, { isStatic: true, label: "wall-right" }),
    ];
  }

  function rebuildBoundaries() {
    if (!engine) return;
    const boundaryLabels = new Set(["floor", "ceiling", "wall-left", "wall-right"]);
    const boundaries = Matter.Composite.allBodies(engine.world)
      .filter((body) => boundaryLabels.has(body.label));
    Matter.Composite.remove(engine.world, boundaries);
    Matter.Composite.add(engine.world, createBoundaries(stage.clientWidth, stage.clientHeight));
  }

  function markSettled() {
    if (state === "settled") return;
    setState("settled");
    if (engine) stage.classList.add("is-draggable");
  }

  function revealCopy() {
    story.dataset.copyState = "visible";
  }

  function scheduleCopyReveal() {
    window.clearTimeout(copyTimer);
    copyTimer = window.setTimeout(revealCopy, 420);
  }

  function updateCopyContrast() {
    const resolution = stage.querySelector("[data-contact-resolution]");
    const headingNode = stage.querySelector("[data-contact-morph-after]");
    if (!resolution || !headingNode) return;
    const heading = headingNode.getBoundingClientRect();
    const headingArea = Math.max(1, heading.width * heading.height);
    const overlap = visibleItems().reduce((total, item) => {
      const rect = item.getBoundingClientRect();
      const overlapWidth = Math.max(0, Math.min(rect.right, heading.right) - Math.max(rect.left, heading.left));
      const overlapHeight = Math.max(0, Math.min(rect.bottom, heading.bottom) - Math.max(rect.top, heading.top));
      return total + overlapWidth * overlapHeight;
    }, 0);
    resolution.classList.toggle("is-contrast-light", overlap / headingArea >= .08);
  }

  function showStaticFallback() {
    released = true;
    applySpiral(1);
    const items = visibleItems();
    items.forEach((item, index) => {
      const width = stage.clientWidth;
      const height = stage.clientHeight;
      const columns = Math.min(4, items.length);
      const column = index % columns;
      const row = Math.floor(index / columns);
      const x = width * (.16 + column * (.68 / Math.max(1, columns - 1)));
      const y = height * (.7 + row * .09);
      const angle = (index % 2 ? 4 : -4) * Math.PI / 180;
      item.style.opacity = "1";
      item.style.transform = `translate3d(${x - item.offsetWidth / 2}px, ${y - item.offsetHeight / 2}px, 0) rotate(${angle}rad)`;
    });
    revealCopy();
    updateCopyContrast();
    markSettled();
  }

  async function preparePhysics() {
    if (engine) return;
    await loadMatterRuntime();
    engine = Matter.Engine.create({ enableSleeping: true });
    engine.gravity.y = 1;
    engine.gravity.scale = .0017;
    Matter.Composite.add(engine.world, createBoundaries(stage.clientWidth, stage.clientHeight));
    stage.classList.add("is-draggable");
    releaseTimestamp = performance.now();
    if (!animationFrame) animationFrame = requestAnimationFrame(stepPhysics);
  }

  function releaseItemToPhysics(item, index) {
    if (!engine || releasedItems.has(item)) return;
    const renderScale = Number(item.dataset.poseScale || 1);
    const width = item.offsetWidth * renderScale;
    const height = item.offsetHeight * renderScale;
    const body = Matter.Bodies.rectangle(
      Number(item.dataset.poseX),
      Number(item.dataset.poseY),
      width,
      height,
      {
        label: item.dataset.contactObject,
        restitution: .2,
        friction: .66,
        frictionAir: .014,
        sleepThreshold: 42,
        chamfer: { radius: Math.min(14, width * .06) },
      },
    );
    Matter.Body.setAngle(body, Number(item.dataset.poseAngle));
    Matter.Body.setVelocity(body, {
      x: ((index % 5) - 2) * .55,
      y: 1.7 + (index % 3) * .38,
    });
    Matter.Body.setAngularVelocity(body, ((index % 3) - 1) * .012);
    body.plugin.domElement = item;
    body.plugin.renderScale = renderScale;
    releasedItems.add(item);
    bodies.push(body);
    Matter.Composite.add(engine.world, body);
    story.dataset.releasedObjects = String(releasedItems.size);
    if (releasedItems.size === 1) {
      setState("releasing");
      window.clearTimeout(copyTimer);
      copyTimer = window.setTimeout(revealCopy, 240);
    }
  }

  function releaseToPhysics() {
    if (released) return;
    const items = visibleItems();
    applySpiral(1);
    items.forEach((item, index) => releaseItemToPhysics(item, index));
    released = true;
    story.dataset.releaseDelta = "0.000";
    releaseTimestamp = performance.now();
    unlockViewport();
    setState("physics");
    if (story.dataset.copyState !== "visible") scheduleCopyReveal();
  }

  function stepPhysics(timestamp) {
    animationFrame = undefined;
    const delta = lastTimestamp ? Math.min(32, timestamp - lastTimestamp) : 16.667;
    lastTimestamp = timestamp;
    Matter.Engine.update(engine, delta);
    bodies.forEach((body) => {
      const item = body.plugin.domElement;
      item.style.opacity = "1";
      item.style.transform = `translate3d(${body.position.x - item.offsetWidth / 2}px, ${body.position.y - item.offsetHeight / 2}px, 0) rotate(${body.angle}rad) scale(${body.plugin.renderScale})`;
    });
    updateCopyContrast();
    if (released && state !== "settled") {
      const quiet = bodies.length > 0 && bodies.every((body) => body.isSleeping
        || (body.speed < .35 && body.angularSpeed < .018));
      quietFrames = quiet ? quietFrames + 1 : 0;
      if (quietFrames >= 45 || timestamp - releaseTimestamp > 6500) markSettled();
    }
    if (finaleVisible) animationFrame = requestAnimationFrame(stepPhysics);
  }

  function stagePoint(event) {
    const bounds = stage.getBoundingClientRect();
    return { x: event.clientX - bounds.left, y: event.clientY - bounds.top };
  }

  stage.addEventListener("pointerdown", (event) => {
    if (!engine || event.target.closest("a, button")) return;
    const point = stagePoint(event);
    const body = Matter.Query.point(bodies, point).at(-1);
    if (!body) return;
    dragged = body;
    const pointA = Matter.Vector.rotate(
      Matter.Vector.sub(point, body.position),
      -body.angle,
    );
    dragConstraint = Matter.Constraint.create({
      bodyA: body,
      pointA,
      pointB: point,
      stiffness: .92,
      damping: .12,
      angularStiffness: 0,
      render: { visible: false },
    });
    Matter.Composite.add(engine.world, dragConstraint);
    Matter.Sleeping.set(body, false);
    stage.classList.add("is-dragging");
    stage.setPointerCapture(event.pointerId);
    event.preventDefault();
  });

  stage.addEventListener("pointermove", (event) => {
    if (!dragged || !dragConstraint) return;
    const point = stagePoint(event);
    dragConstraint.pointB.x = point.x;
    dragConstraint.pointB.y = point.y;
    Matter.Sleeping.set(dragged, false);
    updateCopyContrast();
  });

  function releaseDrag() {
    if (!dragConstraint) return;
    Matter.Composite.remove(engine.world, dragConstraint);
    dragConstraint = undefined;
    dragged = undefined;
    stage.classList.remove("is-dragging");
    updateCopyContrast();
  }

  stage.addEventListener("pointerup", releaseDrag);
  stage.addEventListener("pointercancel", releaseDrag);
  window.addEventListener("resize", () => {
    if (engine) rebuildBoundaries();
  }, { passive: true });
  window.addEventListener("keydown", (event) => {
    if (event.key !== "Escape" || !viewportLock) return;
    entranceCancelled = true;
    if (entranceFrame) cancelAnimationFrame(entranceFrame);
    entranceFrame = undefined;
    unlockViewport();
    showStaticFallback();
  });
  window.addEventListener("pagehide", unlockViewport, { once: true });

  const visibilityObserver = "IntersectionObserver" in window
    ? new IntersectionObserver((entries) => {
      finaleVisible = Boolean(entries[0]?.isIntersecting);
      if (finaleVisible && engine && !animationFrame) {
        lastTimestamp = 0;
        animationFrame = requestAnimationFrame(stepPhysics);
      }
    }, { rootMargin: "50% 0px", threshold: 0 })
    : null;
  visibilityObserver?.observe(story);

  if (reducedMotion.matches) {
    revealCopy();
    setState("static");
  } else {
    story.classList.add("has-finale-js");
    story.dataset.copyState = "hidden";
    story.dataset.entranceProgress = "0.0000";
    story.dataset.entranceStarts = "0";
    story.dataset.viewportLocked = "false";
    setState("idle");
    if ("IntersectionObserver" in window) {
      const runtimeObserver = new IntersectionObserver((entries, observer) => {
        if (!entries[0]?.isIntersecting) return;
        loadMatterRuntime().catch(() => {});
        prepareContactImages();
        observer.disconnect();
      }, { rootMargin: "120% 0px", threshold: 0 });
      runtimeObserver.observe(story);
    }
    applySpiral(0);
    if ("IntersectionObserver" in window) {
      const entranceObserver = new IntersectionObserver((entries, observer) => {
        if (!entries[0]?.isIntersecting) return;
        observer.disconnect();
        startEntrance();
      }, { threshold: .12 });
      entranceObserver.observe(stage);
    } else {
      startEntrance();
    }
  }
})();
