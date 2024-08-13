document.addEventListener("DOMContentLoaded", () => {
  const colorBoxes = document.querySelectorAll(".color-box");
  const hslPicker = document.getElementById("hsl-picker");
  const closePicker = document.getElementById("close-picker");
  const hueInput = document.getElementById("hue");
  const saturationInput = document.getElementById("saturation");
  const lightnessInput = document.getElementById("lightness");
  const hueValue = document.getElementById("hue-value");
  const saturationValue = document.getElementById("saturation-value");
  const lightnessValue = document.getElementById("lightness-value");

  let activeColorBox = null;

  function updateColor() {
    if (!activeColorBox) return;

    const hue = hueInput.value;
    const saturation = saturationInput.value;
    const lightness = lightnessInput.value;
    const newColor = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
    activeColorBox.style.backgroundColor = newColor;
    activeColorBox.dataset.hue = hue;
    hueValue.textContent = hue;
    saturationValue.textContent = saturation;
    lightnessValue.textContent = lightness;
  }

  function openPicker(colorBox, event) {
    activeColorBox = colorBox;
    const computedStyle = window.getComputedStyle(colorBox);
    const bgcolor = computedStyle.backgroundColor;

    // Convert RGB to HSL
    let [r, g, b] = bgcolor.match(/\d+/g).map(Number);
    r /= 255;
    g /= 255;
    b /= 255;
    const max = Math.max(r, g, b),
      min = Math.min(r, g, b);
    let h,
      s,
      l = (max + min) / 2;

    if (max === min) {
      h = s = 0; // achromatic
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0);
          break;
        case g:
          h = (b - r) / d + 2;
          break;
        case b:
          h = (r - g) / d + 4;
          break;
      }
      h /= 6;
    }

    h = Math.round(h * 360);
    s = Math.round(s * 100);
    l = Math.round(l * 100);

    hueInput.value = h;
    saturationInput.value = s;
    lightnessInput.value = l;

    hueValue.textContent = h;
    saturationValue.textContent = s;
    lightnessValue.textContent = l;

    // Position the picker near the clicked position
    const rect = colorBox.getBoundingClientRect();
    const pickerRect = hslPicker.getBoundingClientRect();

    let left = event.clientX;
    let top = event.clientY;

    // Ensure the picker doesn't go off-screen
    if (left + pickerRect.width > window.innerWidth) {
      left = window.innerWidth - pickerRect.width;
    }
    if (top + pickerRect.height > window.innerHeight) {
      top = window.innerHeight - pickerRect.height;
    }

    hslPicker.style.left = `${left}px`;
    hslPicker.style.top = `${top}px`;

    hslPicker.style.display = "block";
  }

  colorBoxes.forEach((box) => {
    box.addEventListener("click", (event) => openPicker(box, event));
  });

  closePicker.addEventListener("click", () => {
    hslPicker.style.display = "none";
    activeColorBox = null;
  });

  hueInput.addEventListener("input", updateColor);
  saturationInput.addEventListener("input", updateColor);
  lightnessInput.addEventListener("input", updateColor);

  // Close picker when clicking outside
  document.addEventListener("click", (event) => {
    if (!hslPicker.contains(event.target) && !event.target.classList.contains("color-box")) {
      hslPicker.style.display = "none";
      activeColorBox = null;
    }
  });
});
