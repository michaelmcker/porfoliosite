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
  let entranceFrame;
  let entranceStart = 0;
  let entranceStarted = false;
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

  const entranceDuration = 1800;
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
    const phaseGap = width < 640 ? .042 : width < 1100 ? .048 : .055;
    const itemProgress = clamp(progress * 1.12 - index * phaseGap);
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

  function startEntrance() {
    if (entranceStarted || reducedMotion.matches) return;
    entranceStarted = true;
    story.dataset.entranceStarts = String(Number(story.dataset.entranceStarts || 0) + 1);
    setState("entrance");
    entranceStart = performance.now();
    entranceFrame = requestAnimationFrame(stepEntrance);
  }

  function stepEntrance(timestamp) {
    const progress = clamp((timestamp - entranceStart) / entranceDuration);
    story.dataset.entranceProgress = progress.toFixed(4);
    applyOrbit(progress);
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
    stage.classList.add("is-draggable");
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
    if (released) rebuildBoundaries();
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
    story.dataset.entranceProgress = "0.0000";
    story.dataset.entranceStarts = "0";
    setState("idle");
    if ("IntersectionObserver" in window) {
      const runtimeObserver = new IntersectionObserver((entries, observer) => {
        if (!entries[0]?.isIntersecting) return;
        loadMatterRuntime().catch(() => {});
        observer.disconnect();
      }, { rootMargin: "100% 0px", threshold: 0 });
      runtimeObserver.observe(story);
    }
    applyOrbit(0);
    if ("IntersectionObserver" in window) {
      const entranceObserver = new IntersectionObserver((entries, observer) => {
        if (!entries[0]?.isIntersecting) return;
        observer.disconnect();
        startEntrance();
      }, { threshold: .4 });
      entranceObserver.observe(stage);
    } else {
      startEntrance();
    }
  }
})();
