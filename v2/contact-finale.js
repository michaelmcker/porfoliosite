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

  function releaseSlot(index, count, width, height) {
    const columns = Math.min(5, count);
    const row = Math.floor(index / columns);
    const column = index % columns;
    const span = width * .64;
    return {
      x: width * .18 + (columns === 1 ? span / 2 : (column / (columns - 1)) * span),
      y: height * .13 + row * Math.min(92, height * .1),
      angle: ((index % 2 ? 1 : -1) * (2 + (index % 3) * 2)) * Math.PI / 180,
    };
  }

  function spiralPose(index, count, progress, width, height) {
    const itemProgress = smooth(clamp((progress * 1.22) - index * .025));
    const centreX = width * .5;
    const centreY = height * .44;
    const maxRadius = Math.hypot(width, height) * .62;
    const spiralProgress = clamp(itemProgress / .82);
    const theta = index * .78 + (1 - spiralProgress) * Math.PI * 3.6;
    const radius = maxRadius * (1 - spiralProgress * .78);
    const spiralX = centreX + Math.cos(theta) * radius;
    const spiralY = centreY + Math.sin(theta) * radius * .7;
    const slot = releaseSlot(index, count, width, height);
    const slotBlend = smooth((itemProgress - .76) / .24);
    return {
      x: lerp(spiralX, slot.x, slotBlend),
      y: lerp(spiralY, slot.y, slotBlend),
      angle: lerp(theta + Math.PI / 2, slot.angle, slotBlend),
      scale: lerp(.58, 1, itemProgress),
      opacity: clamp(itemProgress * 1.8),
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
    items.forEach((item, index) => {
      const pose = spiralPose(index, items.length, progress, width, height);
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
    const spiralProgress = clamp(progress / .58);
    story.style.setProperty("--finale-progress", spiralProgress.toFixed(4));
    applySpiral(spiralProgress);
    if (progress >= .58) releaseToPhysics();
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
    markSettled();
  }

  async function releaseToPhysics() {
    if (released) return;
    released = true;
    applySpiral(1);
    setState("physics");
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
  });

  function releaseDrag() {
    if (!dragged) return;
    Matter.Body.setStatic(dragged, false);
    Matter.Body.setVelocity(dragged, { x: dragPoint.vx, y: dragPoint.vy });
    dragged = undefined;
    stage.classList.remove("is-dragging");
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
    setState("static");
  } else {
    story.classList.add("has-finale-js");
    setState("spiral");
    if ("IntersectionObserver" in window) {
      const runtimeObserver = new IntersectionObserver((entries, observer) => {
        if (!entries[0]?.isIntersecting) return;
        loadMatterRuntime().catch(() => {});
        observer.disconnect();
      }, { rootMargin: "100% 0px", threshold: 0 });
      runtimeObserver.observe(story);
    }
    applySpiral(0);
    updateFromScroll();
  }
})();
