/* The MIT License (MIT)
 *
 * Copyright (c) 2022-present David G. Simmons
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

declare type EyeColor = string | InnerOuterEyeColor;
declare type InnerOuterEyeColor = {
  inner: string;
  outer: string;
};
declare type CornerRadii =
  | number
  | [number, number, number, number]
  | InnerOuterRadii;
declare type InnerOuterRadii = {
  inner: number | [number, number, number, number];
  outer: number | [number, number, number, number];
};

export function drawPositioningPattern(
  ctx: CanvasRenderingContext2D,
  cellSize: number,
  offset: number,
  row: number,
  col: number,
  color: EyeColor,
  radii: CornerRadii = [0, 0, 0, 0]
) {
  const lineWidth = Math.ceil(cellSize);

  let radiiOuter;
  let radiiInner;
  if (typeof radii !== 'number' && !Array.isArray(radii)) {
    radiiOuter = radii.outer || 0;
    radiiInner = radii.inner || 0;
  } else {
    radiiOuter = radii as CornerRadii;
    radiiInner = radiiOuter;
  }

  let colorOuter;
  let colorInner;
  if (typeof color !== 'string') {
    colorOuter = color.outer;
    colorInner = color.inner;
  } else {
    colorOuter = color;
    colorInner = color;
  }

  let y = row * cellSize + offset;
  let x = col * cellSize + offset;
  let size = cellSize * 7;

  // Outer box
  drawRoundedSquare(
    lineWidth,
    x,
    y,
    size,
    colorOuter,
    radiiOuter as number,
    false,
    ctx
  );

  // Inner box
  size = cellSize * 3;
  y += cellSize * 2;
  x += cellSize * 2;
  drawRoundedSquare(
    lineWidth,
    x,
    y,
    size,
    colorInner,
    radiiInner as number,
    true,
    ctx
  );
}

function drawRoundedSquare(
  lineWidth: number,
  x: number,
  y: number,
  size: number,
  color: string,
  radii: number | number[],
  fill: boolean,
  ctx: CanvasRenderingContext2D
) {
  ctx.lineWidth = lineWidth;
  ctx.fillStyle = color;
  ctx.strokeStyle = color;

  // Adjust coordinates so that the outside of the stroke is aligned to the edges
  y += lineWidth / 2;
  x += lineWidth / 2;
  size -= lineWidth;

  if (!Array.isArray(radii)) {
    radii = [radii, radii, radii, radii];
  }

  // Radius should not be greater than half the size or less than zero
  radii = radii.map((r) => {
    r = Math.min(r, size / 2);
    return r < 0 ? 0 : r;
  });

  const rTopLeft = radii[0] || 0;
  const rTopRight = radii[1] || 0;
  const rBottomRight = radii[2] || 0;
  const rBottomLeft = radii[3] || 0;

  ctx.beginPath();

  ctx.moveTo(x + rTopLeft, y);

  ctx.lineTo(x + size - rTopRight, y);
  if (rTopRight) ctx.quadraticCurveTo(x + size, y, x + size, y + rTopRight);

  ctx.lineTo(x + size, y + size - rBottomRight);
  if (rBottomRight)
    ctx.quadraticCurveTo(x + size, y + size, x + size - rBottomRight, y + size);

  ctx.lineTo(x + rBottomLeft, y + size);
  if (rBottomLeft) ctx.quadraticCurveTo(x, y + size, x, y + size - rBottomLeft);

  ctx.lineTo(x, y + rTopLeft);
  if (rTopLeft) ctx.quadraticCurveTo(x, y, x + rTopLeft, y);

  ctx.closePath();

  ctx.stroke();
  if (fill) {
    ctx.fill();
  }
}
