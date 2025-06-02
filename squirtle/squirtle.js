const happy = document.getElementById('drum');
const unhappy = document.getElementById('lighter');
const mouth = document.querySelector('.squirtle-mouth');
const leftArm = document.querySelector('.squirtle-arm.left');
const rightArm = document.querySelector('.squirtle-arm.right');
const legs = document.querySelectorAll('.squirtle-leg');

function trackEyeMovement(eye) {
    const dot = eye.querySelector('.squirtle-eye-black');
    let rect = eye.getBoundingClientRect();
    let rectDot = dot.getBoundingClientRect();

    let mouseX = 0, mouseY = 0;
    let dotX = 0, dotY = 0;
  
    document.addEventListener('mousemove', (e) => {
      let moveTop = rect.top - rectDot.top;
      let moveRight = rect.right - rectDot.right;
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
  
      mouseX = Math.max(-moveRight * 0.5, Math.min(mouseX, moveRight*2));
      mouseY = Math.max(moveTop, Math.min(mouseY, -moveTop));
    });
  
    function animate() {
      dotX += (mouseX - dotX) * 0.2;
      dotY += (mouseY - dotY) * 0.2;
  
      dot.style.transform = `translate(${dotX}px, ${dotY}px)`;
      requestAnimationFrame(animate);
    }
  
    animate();
}

function getDistance(elem, mouseX, mouseY) {
  const rect = elem.getBoundingClientRect();
  const elemX = rect.left + rect.width / 2;
  const elemY = rect.top + rect.height / 2;
  const dx = mouseX - elemX;
  const dy = mouseY - elemY;
  return Math.sqrt(dx * dx + dy * dy);
}

function addDrum(ele) {
    ele.classList.add('drum');

    setTimeout(() => {
        ele.classList.remove('drum');
    }, 150);
}

document.querySelectorAll('.squirtle-eye').forEach((eye) => {
    trackEyeMovement(eye);
});

window.onresize= function () {
    document.querySelectorAll('.squirtle-eye').forEach((eye) => {
        trackEyeMovement(eye);
    });
}

document.addEventListener('mousemove', (e) => {
  const mouseX = e.clientX;
  const mouseY = e.clientY;

  const distHappy = getDistance(happy, mouseX, mouseY);
  const distUnhappy = getDistance(unhappy, mouseX, mouseY);

  // Normalize
  const maxDist = Math.max(distHappy, distUnhappy, 1);
  const happyRatio = 1 - distHappy / maxDist;
  const unhappyRatio = 1 - distUnhappy / maxDist;

  const topRadius = 50 - happyRatio * 50;
  const bottomRadius = 50 - unhappyRatio * 50;

  mouth.style.borderRadius = `${topRadius}cqi ${topRadius}cqi ${bottomRadius}cqi ${bottomRadius}cqi`;
});

let keysEnabled = false;

const soundMap = {
a: new Audio('sound/drum-a.mp3'),
s: new Audio('sound/drum-s.mp3'),
d: new Audio('sound/drum-d.mp3')
};

function schedule(delay, actions) {
    setTimeout(() => {
        actions();
    }, delay);
}

happy.addEventListener('click', () => {
    if (!keysEnabled) {
        keysEnabled = true;
    }

    schedule(500, () => {
        drumbeat(); 
    });

    schedule(2900, () => {
        drumbeat(); 
    });
});

const beatSteps = [
    { time: 0, keys: ['a', 's'], drums: [leftArm, rightArm] },
    { time: 300, keys: ['s'], drums: [rightArm] },
    { time: 600, keys: ['d', 's'], drums: [...legs, rightArm] },
    { time: 900, keys: ['a', 's'], drums: [leftArm, rightArm] },
    { time: 1200, keys: ['s'], drums: [rightArm] },
    { time: 1500, keys: ['a', 's'], drums: [leftArm, rightArm] },
    { time: 1800, keys: ['d', 's'], drums: [...legs, rightArm] },
    { time: 2100, keys: ['s'], drums: [rightArm] },
];

function drumbeat() {
    beatSteps.forEach(({ time, keys, drums }) => {
        setTimeout(() => {
            drums.forEach(addDrum);
            keys.forEach(key => soundMap[key].play());
        }, time);
    });
}

document.addEventListener('keydown', (e) => {
    if (!keysEnabled) return;

    const key = e.key.toLowerCase();
    if (soundMap[key]) {
        soundMap[key].currentTime = 0; 
        switch (key) {
            case 'a':
                addDrum(leftArm);
                break;
            case 's':
                addDrum(rightArm);
                break;
            case 'd':
                legs.forEach((leg) => {
                    addDrum(leg);
                });
                break;
        }
        soundMap[key].play();
    }
});
  