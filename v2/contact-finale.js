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
  let scrollFrame;
  let engine;
  let bodies = [];
  let animationFrame;
  let lastTimestamp = 0;
  let releaseTimestamp = 0;
  let quietFrames = 0;
  let dragged;
  let dragPoint;
  let matterPromise;
  let finaleVisible = true;
  let copyTimer;

  const releaseThreshold = .68;
  const orbitPoints = [
    [-.14, .12],
    [.08, .08],
    [.04, .62],
    [.5, .72],
    [.92, .58],
    [.9, .1],
    [.45, .06],
  ];

  function setState(next) {
    state = next;
    story.dataset.finaleState = next;
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

  function evaluateOrbitSegment(previous, start, end, next, amount, width, height) {
    const progress = clamp(amount);
    const squared = progress * progress;
    const cubed = squared * progress;
    const interpolate = (axis) => .5 * (
      (2 * start[axis])
      + (-previous[axis] + end[axis]) * progress
      + (2 * previous[axis] - 5 * start[axis] + 4 * end[axis] - next[axis]) * squared
      + (-previous[axis] + 3 * start[axis] - 3 * end[axis] + next[axis]) * cubed
    );
    return {
      x: interpolate(0) * width,
      y: interpolate(1) * height,
    };
  }

  function roundedOrbitPose(index, count, progress, width, height) {
    const itemProgress = clamp(progress * 1.08 - index * .018);
    const segmentProgress = itemProgress * (orbitPoints.length - 1);
    const segment = Math.min(orbitPoints.length - 2, Math.floor(segmentProgress));
    const amount = segmentProgress - segment;
    const previous = orbitPoints[Math.max(0, segment - 1)];
    const start = orbitPoints[segment];
    const end = orbitPoints[segment + 1];
    const next = orbitPoints[Math.min(orbitPoints.length - 1, segment + 2)];
    const point = evaluateOrbitSegment(previous, start, end, next, amount, width, height);
    const tangentPoint = evaluateOrbitSegment(
      previous,
      start,
      end,
      next,
      Math.min(1, amount + .018),
      width,
      height,
    );
    const tangent = Math.atan2(tangentPoint.y - point.y, tangentPoint.x - point.x);
    return {
      x: point.x,
      y: point.y,
      angle: tangent * .16 + (index % 2 ? .035 : -.035),
      scale: lerp(.68, 1, smooth(clamp(itemProgress * 1.9))),
      opacity: clamp(itemProgress * 2.4),
    };
  }

  function itemWidth(item, stageWidth) {
    const scale = stageWidth < 640 ? .68 : stageWidth < 1100 ? .82 : 1;
    return Number(item.dataset.bodyWidth || 210) * scale;
  }

  function applyOrbit(progress) {
    const width = stage.clientWidth;
    const height = stage.clientHeight;
    const items = visibleItems();
    items.forEach((item, index) => {
      const pose = roundedOrbitPose(index, items.length, progress, width, height);
      item.style.setProperty("--body-width", `${itemWidth(item, width)}px`);
      item.style.opacity = pose.opacity.toFixed(3);
      item.style.transform = `translate3d(${pose.x - item.offsetWidth / 2}px, ${pose.y - item.offsetHeight / 2}px, 0) rotate(${pose.angle}rad) scale(${pose.scale})`;
      item.dataset.poseX = String(pose.x);
      item.dataset.poseY = String(pose.y);
      item.dataset.poseAngle = String(pose.angle);
    });
  }

  function updateFromScroll() {
    scrollFrame = undefined;
    if (released || reducedMotion.matches) return;
    const bounds = story.getBoundingClientRect();
    const travel = Math.max(1, story.offsetHeight - window.innerHeight);
    const progress = clamp(-bounds.top / travel);
    const orbitProgress = clamp(progress / releaseThreshold);
    story.dataset.orbitProgress = orbitProgress.toFixed(4);
    story.style.setProperty("--finale-progress", orbitProgress.toFixed(4));
    applyOrbit(orbitProgress);
    if (progress >= releaseThreshold) releaseToPhysics();
  }

  function requestScrollUpdate() {
    if (!scrollFrame) scrollFrame = requestAnimationFrame(updateFromScroll);
  }

  function createBoundaries(width, height) {
    const { Bodies } = Matter;
    const thickness = 160;
    return [
      Bodies.rectangle(width / 2, height + thickness / 2 - 10, width + thickness * 2, thickness, { isStatic: true, label: "floor" }),
      Bodies.rectangle(-thickness / 2 + 10, height / 2, thickness, height * 2, { isStatic: true, label: "wall-left" }),
      Bodies.rectangle(width + thickness / 2 - 10, height / 2, thickness, height * 2, { isStatic: true, label: "wall-right" }),
    ];
  }

  function rebuildBoundaries() {
    if (!engine) return;
    const boundaryLabels = new Set(["floor", "wall-left", "wall-right"]);
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
    applyOrbit(1);
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

  async function releaseToPhysics() {
    if (released) return;
    released = true;
    applyOrbit(1);
    setState("physics");
    scheduleCopyReveal();
    try {
      await loadMatterRuntime();
    } catch {
      showStaticFallback();
      return;
    }

    engine = Matter.Engine.create({ enableSleeping: true });
    engine.gravity.y = 1;
    engine.gravity.scale = .00115;
    bodies = visibleItems().map((item) => {
      const width = item.offsetWidth;
      const height = item.offsetHeight;
      const body = Matter.Bodies.rectangle(
        Number(item.dataset.poseX),
        Number(item.dataset.poseY),
        width,
        height,
        {
          label: item.dataset.contactObject,
          restitution: .24,
          friction: .62,
          frictionAir: .018,
          sleepThreshold: 45,
          chamfer: { radius: Math.min(14, width * .06) },
        },
      );
      Matter.Body.setAngle(body, Number(item.dataset.poseAngle));
      body.plugin.domElement = item;
      return body;
    });
    story.dataset.releaseDelta = Math.max(...bodies.map((body) => {
      const item = body.plugin.domElement;
      return Math.hypot(
        body.position.x - Number(item.dataset.poseX),
        body.position.y - Number(item.dataset.poseY),
      );
    })).toFixed(3);
    Matter.Composite.add(engine.world, [
      ...createBoundaries(stage.clientWidth, stage.clientHeight),
      ...bodies,
    ]);
    releaseTimestamp = performance.now();
    animationFrame = requestAnimationFrame(stepPhysics);
  }

  function stepPhysics(timestamp) {
    animationFrame = undefined;
    const delta = lastTimestamp ? Math.min(32, timestamp - lastTimestamp) : 16.667;
    lastTimestamp = timestamp;
    Matter.Engine.update(engine, delta);
    bodies.forEach((body) => {
      const item = body.plugin.domElement;
      item.style.opacity = "1";
      item.style.transform = `translate3d(${body.position.x - item.offsetWidth / 2}px, ${body.position.y - item.offsetHeight / 2}px, 0) rotate(${body.angle}rad)`;
    });
    updateCopyContrast();
    if (state !== "settled") {
      const quiet = bodies.every((body) => body.isSleeping
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
    if (state !== "settled" || !engine || event.target.closest("a, button")) return;
    const point = stagePoint(event);
    const body = Matter.Query.point(bodies, point).at(-1);
    if (!body) return;
    dragged = body;
    dragPoint = { ...point, time: performance.now(), vx: 0, vy: 0 };
    Matter.Body.setStatic(body, true);
    stage.classList.add("is-dragging");
    stage.setPointerCapture(event.pointerId);
    event.preventDefault();
  });

  stage.addEventListener("pointermove", (event) => {
    if (!dragged) return;
    const point = stagePoint(event);
    const now = performance.now();
    const elapsed = Math.max(16, now - dragPoint.time);
    dragPoint.vx = (point.x - dragPoint.x) / elapsed * 16.667;
    dragPoint.vy = (point.y - dragPoint.y) / elapsed * 16.667;
    dragPoint.x = point.x;
    dragPoint.y = point.y;
    dragPoint.time = now;
    Matter.Body.setPosition(dragged, point);
    updateCopyContrast();
  });

  function releaseDrag() {
    if (!dragged) return;
    Matter.Body.setVelocity(dragged, { x: 0, y: 0 });
    Matter.Body.setAngularVelocity(dragged, 0);
    Matter.Body.setStatic(dragged, true);
    dragged.plugin.pinned = true;
    dragged = undefined;
    stage.classList.remove("is-dragging");
    updateCopyContrast();
  }

  stage.addEventListener("pointerup", releaseDrag);
  stage.addEventListener("pointercancel", releaseDrag);
  window.addEventListener("scroll", requestScrollUpdate, { passive: true });
  window.addEventListener("resize", () => {
    if (!released) requestScrollUpdate();
    else rebuildBoundaries();
  }, { passive: true });

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
    setState("orbit");
    if ("IntersectionObserver" in window) {
      const runtimeObserver = new IntersectionObserver((entries, observer) => {
        if (!entries[0]?.isIntersecting) return;
        loadMatterRuntime().catch(() => {});
        observer.disconnect();
      }, { rootMargin: "100% 0px", threshold: 0 });
      runtimeObserver.observe(story);
    }
    applyOrbit(0);
    updateFromScroll();
  }
})();
