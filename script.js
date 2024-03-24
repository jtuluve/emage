const emojiMap = {
  "#FFB02E": "😀",
  "#FFCE7C": "🫥",
  "#9B9B9B": "🌫",
  "#F8312F": "😡",
  "#8C42B3": "😈",
  "#FFFFFF": "💀",
  "#B35F47": "💩",
  "#CA0B4A": "👹",
  "#86D72F": "👽",
  "#635994": "👾",
  "#CDC4D6": "🤖",
  "#8C5543": "🙈",
  "#E39D89": "🙉",
  "#F92F60": "💋",
  "#E1D8EC": "💌",
  "#FFB2FF": "💗",
  "#8D65C5": "💟",
  "#26C9FC": "🩹",
  "#FF6723": "🧡",
  "#FCD53F": "💛",
  "#00D26A": "💚",
  "#0074BA": "💙",
  "#6D4534": "🤎",
  "#1C1C1C": "🖤",
  "#F4F4F4": "🤍",
  "#F9C23C": "💫",
  "#E6E6E6": "💨",
  "#321B41": "🕳",
  "#533566": "💣",
  "#00A6ED": "💤",
  "#FFC83D": "🤚",
  "#803BFF": "🙏",
  "#FF6DC6": "🧠",
  "#F70A8D": "🫀",
  "#F99EA3": "🫁",
  "#F1A11E": "👩",
  "#44911B": "🌾",
  "#433B6B": "🍳",
  "#B4ACBC": "🔧",
  "#D3D3D3": "🏭",
  "#BEBEBE": "🔬",
  "#FBB8AB": "🎨",
  "#FFF478": "👷",
  "#0092E7": "🤴",
  "#633589": "👸",
  "#8B62BF": "🤰",
  "#007ACF": "🦸",
  "#6B438B": "🦹",
  "#75E0FC": "🧚",
  "#7D4533": "🧝",
  "#37C9CD": "🧟",
  "#96C34A": "🧌",
  "#5092FF": "🦼",
  "#FF822D": "⛷",
  "#B4F6FC": "🏂",
  "#0084CE": "🏊",
  "#636363": "👭",
  "#F3C07B": "🐶",
  "#F3AD61": "🐕",
  "#A56953": "🐎",
  "#EFD5FF": "🦄",
  "#FF8687": "🐷",
  "#008463": "🐢",
  "#FF8257": "🐙",
  "#212121": "🐞",
  "#998EA4": "🕸",
  "#AEDDFF": "🪰",
  "#00F397": "🦠",
  "#FF9F2E": "📳",
  "#C790F1": "🟪",
  "#83CBFF": "👓",
  "#B859D3": "🧤",
  "#FFDEA7": "🧥",
  "#46A4FB": "👗",
  "#6AFCAC": "🩳",
  "#26EAFC": "🧢",
  "#402A32": "🎵",
  "#F3EEF8": "🪕",
  "#FFE5D9": "🥁",
  "#E19747": "🪘",
  "#BCA4EB": "💷",
  "#C3EF3C": "🖍",
  "#D3883E": "🪃",
  "#1345B7": "🛋",
  "#3F5FFF": "🪒",
  "#E0AEF8": "🫧",
  "#E5336D": "🏓",
  "#608842": "🏕",
  "#F37366": "🏜",
  "#FF944C": "🏝",
  "#14A085": "🗽",
  "#5A93CB": "🌁",
  "#FF5E59": "🌄",
  "#9F70B8": "🌆",
  "#A7A8B7": "🛝",
  "#50E2FF": "🛤",
  "#5235A6": "⌚",
  "#8C42B2": "🍇",
  "#BFCC82": "🍈",
  "#FEEFC2": "🧄",
  "#9D5044": "🫘",
  "#B97028": "🍯",
  "#000000": "🏴",
};
let img = null;
const fileInput = document.getElementById("file-input");
const fileLabel = document.getElementById("file-input-label");

let op = document.getElementById("output");
let width = 0;
let height = 0;
async function generatePalette(image) {
  op.innerText = "Generating...";
  const reader = new FileReader();
  reader.readAsDataURL(image);
  reader.onload = function (event) {
    console.log("loaded render");
    const imageUrl = event.target.result;
    img = new Image();
    img.src = imageUrl;
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      canvas.width = width = img.width;
      canvas.height = height = img.height;

      ctx.drawImage(img, 0, 0, img.width, img.height);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      // document.body.appendChild(canvas);
      // Convert the image data to RGB values so its much simpler
      let rgbArray = buildRgb(imageData.data);
      let hex = rgbArray.map(rgbToHex);
      while (hex.length > 2500) {
        hex = half(half(hex, true), false);
      }
      let newHex = hex.map(
        (e) => emojiMap[closestColor(e, Object.keys(emojiMap))]
      );
      let latestHex = [];
      newHex.forEach((e, i) => {
        if (i % width === 0) {
          latestHex.push("\n");
        }
        latestHex.push(e);
      });
      op.innerText = latestHex.join("‌");
      // const spans = op.querySelectorAll('span');
      // spans.forEach(span => {
      //   span.style.fontSize = 15 + 'px';
      // })
      window.scrollTo(0, document.body.scrollHeight);
    };
  };
  
  return;
}

Array.prototype.removeByValue = function removeByValue(value) {
  return this.filter((item) => item !== value);
};

function sortByFreq(arr) {
  var freq = {};
  arr.forEach(function (item) {
    freq[item] = (freq[item] || 0) + 1;
  });
  return Object.keys(freq).sort(function (a, b) {
    return freq[b] - freq[a];
  });
}

function calculateColorDifference(color1, color2) {
  function r(c) {
    return parseInt(c.slice(1, 3), 16);
  }
  function g(c) {
    return parseInt(c.slice(3, 5), 16);
  }
  function b(c) {
    return parseInt(c.slice(5, 7), 16);
  }
  var rDifference = Math.pow(r(color2) - r(color1), 2);
  var gDifference = Math.pow(g(color2) - g(color1), 2);
  var bDifference = Math.pow(b(color2) - b(color1), 2);
  return Math.floor((rDifference + gDifference + bDifference) / 3);
}

function closestColor(c, colors) {
  colors.sort((a, b) => {
    return calculateColorDifference(c, a) - calculateColorDifference(c, b);
  });
  return colors[0];
}

/**
 * Using relative luminance we order the brightness of the colors
 * the fixed values and further explanation about this topic
 * can be found here -> https://en.wikipedia.org/wiki/Luma_(video)
 */
function orderByLuminance(rgbValues) {
  function calculateLuminance(p) {
    return 0.2126 * p.r + 0.7152 * p.g + 0.0722 * p.b;
  }
  return rgbValues.sort(function (p1, p2) {
    return calculateLuminance(p2) - calculateLuminance(p1);
  });
}

//  Convert each pixel value ( number ) to hexadecimal ( string ) with base 16
function rgbToHex(pixel) {
  function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
  }
  return (
    "#" +
    componentToHex(pixel.r) +
    componentToHex(pixel.g) +
    componentToHex(pixel.b)
  ).toUpperCase();
}

function buildPalette(colorsList) {
  var orderedByColor = orderByLuminance(colorsList);
  var colors = orderedByColor
    .map(function (col, i, arr) {
      var hexColor = rgbToHex(col);
      if (i > 0) {
        var difference = calculateColorDifference(arr[i], arr[i - 1]);
        // if the distance is less than 120 we ommit that color
        if (difference < 120) {
          return;
        }
      }
      return hexColor;
    })
    .filter(Boolean);
  return colors;
}

function buildRgb(imageData) {
  var rgbValues = [];
  // note that we are loopin every 4!
  // for every Red, Green, Blue and Alpha
  // let w = Math.min(img.width, 128);
  // let h = Math.min(img.height, Math.floor(128*img.width/img.height));
  // for(let i = 0;i<imageData.length;i+=img.width*4){
  //   for(let j = i*img.width; j < i*img.width+img.width;j+=Math.floor(w/img.width)*4){
  //     let rgb = {
  //     r: imageData[i],
  //     g: imageData[i + 1],
  //     b: imageData[i + 2],
  //   };
  //   rgbValues.push(rgb);
  //   }
  // }
  for (var i = 0; i < imageData.length; i += 4) {
    var rgb = {
      r: imageData[i],
      g: imageData[i + 1],
      b: imageData[i + 2],
    };
    rgbValues.push(rgb);
  }
  return rgbValues;
}

function findBiggestColorRange(rgbValues) {
  /**
   * Min is initialized to the maximum value posible
   * from there we procced to find the minimum value for that color channel
   *
   * Max is initialized to the minimum value posible
   * from there we procced to fin the maximum value for that color channel
   */
  var rMin = Number.MAX_VALUE;
  var gMin = Number.MAX_VALUE;
  var bMin = Number.MAX_VALUE;
  var rMax = Number.MIN_VALUE;
  var gMax = Number.MIN_VALUE;
  var bMax = Number.MIN_VALUE;
  rgbValues.forEach(function (pixel) {
    rMin = Math.min(rMin, pixel.r);
    gMin = Math.min(gMin, pixel.g);
    bMin = Math.min(bMin, pixel.b);
    rMax = Math.max(rMax, pixel.r);
    gMax = Math.max(gMax, pixel.g);
    bMax = Math.max(bMax, pixel.b);
  });
  var rRange = rMax - rMin;
  var gRange = gMax - gMin;
  var bRange = bMax - bMin;
  // determine which color has the biggest difference
  var biggestRange = Math.max(rRange, gRange, bRange);
  if (biggestRange === rRange) {
    return "r";
  } else if (biggestRange === gRange) {
    return "g";
  } else {
    return "b";
  }
}

/**
 * Median cut implementation
 * can be found here -> https://en.wikipedia.org/wiki/Median_cut
 */
function quantization(rgbValues, depth, maxDepth) {
  // Base case
  if (depth === maxDepth || rgbValues.length === 0) {
    var color = rgbValues.reduce(
      function (prev, curr) {
        prev.r += curr.r;
        prev.g += curr.g;
        prev.b += curr.b;
        return prev;
      },
      {
        r: 0,
        g: 0,
        b: 0,
      }
    );
    color.r = Math.round(color.r / rgbValues.length);
    color.g = Math.round(color.g / rgbValues.length);
    color.b = Math.round(color.b / rgbValues.length);
    return [color];
  }
  /**
   *  Recursively do the following:
   *  1. Find the pixel channel (red,green or blue) with biggest difference/range
   *  2. Order by this channel
   *  3. Divide in half the rgb colors list
   *  4. Repeat process again, until desired depth or base case
   */
  var componentToSortBy = findBiggestColorRange(rgbValues);
  rgbValues.sort(function (p1, p2) {
    return p1[componentToSortBy] - p2[componentToSortBy];
  });
  var mid = rgbValues.length / 2;
  return [].concat(
    quantization(rgbValues.slice(0, mid), depth + 1, maxDepth),
    quantization(rgbValues.slice(mid + 1), depth + 1, maxDepth)
  );
}

function half(arr, col) {
  let newarr = [];
  if (col) {
    for (let i = 0; i < height; i++)
      for (let j = 0; j < width; j++)
        if (j % 2) newarr.push(arr[i * width + j]);
    width = Math.floor(width / 2);
  } else {
    for (let i = 0; i < height; i++) {
      if (i % 2) newarr.push(arr.slice(i * width, i * width + width));
    }
  }

  return newarr.flat().filter((e) => e);
}

fileInput.addEventListener("change", function (event) {
  const file = event.target.files[0];
  if (file) {
    console.log("image selected");
    generatePalette(file);
  } else console.log("No image");
});

fileInput.ondragover = (e) => {
  fileLabel.style.background = "#055688";
};
fileInput.ondrop = (e) => {
  fileLabel.style.background = "#B2C3FF";
};
fileInput.ondragleave = (e) => {
  fileLabel.style.background = "#B2C3FF";
};
