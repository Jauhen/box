import React from 'react';
import './App.css';

function roundToPrecision(x, precision) {
  var y = +x + (precision === undefined ? 0.5 : precision / 2);
  return y - (y % (precision === undefined ? 1 : +precision));
}

class Box extends React.Component {
  render() {
    return box(
      this.props.width,
      this.props.length,
      this.props.height,
      this.props.thickness,
      this.props.sections,
      this.props.startx,
      this.props.starty
    );
  }
}

function buildRectangle(startX, startY, width, length) {
  if (width >= 0 && length >= 0) {
    return {
      NE: { x: startX, y: startY, toString: () => `${startX},${startY}` },
      SE: {
        x: startX,
        y: startY + length,
        toString: () => `${startX},${startY + length}`,
      },
      NW: {
        x: startX + width,
        y: startY,
        toString: () => `${startX + width},${startY}`,
      },
      SW: {
        x: startX + width,
        y: startY + length,
        toString: () => `${startX + width},${startY + length}`,
      },
    };
  }

  if (width < 0 && length >= 0) {
    return {
      NW: { x: startX, y: startY, toString: () => `${startX},${startY}` },
      SW: {
        x: startX,
        y: startY + length,
        toString: () => `${startX},${startY + length}`,
      },
      NE: {
        x: startX + width,
        y: startY,
        toString: () => `${startX + width},${startY}`,
      },
      SE: {
        x: startX + width,
        y: startY + length,
        toString: () => `${startX + width},${startY + length}`,
      },
    };
  }

  if (width >= 0 && length < 0) {
    return {
      SE: { x: startX, y: startY, toString: () => `${startX},${startY}` },
      NE: {
        x: startX,
        y: startY + length,
        toString: () => `${startX},${startY + length}`,
      },
      SW: {
        x: startX + width,
        y: startY,
        toString: () => `${startX + width},${startY}`,
      },
      NW: {
        x: startX + width,
        y: startY + length,
        toString: () => `${startX + width},${startY + length}`,
      },
    };
  }

  if (width < 0 && length < 0) {
    return {
      SW: { x: startX, y: startY, toString: () => `${startX},${startY}` },
      NW: {
        x: startX,
        y: startY + length,
        toString: () => `${startX},${startY + length}`,
      },
      SE: {
        x: startX + width,
        y: startY,
        toString: () => `${startX + width},${startY}`,
      },
      NE: {
        x: startX + width,
        y: startY + length,
        toString: () => `${startX + width},${startY + length}`,
      },
    };
  }
}

function box(width, length, height, thickness, sections, startX, startY) {
  const bottom = buildRectangle(startX, startY, width, length);

  const sideE = buildRectangle(startX, startY+thickness, -height, length-2*thickness);
  const sideS = buildRectangle(startX, startY + length, width, height);
  const sideW = buildRectangle(startX + width, startY+thickness, height, length-2*thickness);
  const sideN = buildRectangle(startX, startY, width, -height);

  const insideE = buildRectangle(
    startX - height - 4*thickness,
    startY + 5*thickness,
    -height + 2*thickness,  // TODO: flap length
    length - 10 * thickness
  );
  const insideS = buildRectangle(
    startX + 4*thickness,
    startY + length + height + 4*thickness,
    width - 8 * thickness,
    height - 2*thickness  // TODO: flap length
  );
  const insideW = buildRectangle(
    startX + width + height + 4*thickness,
    startY + 4*thickness,
    height - 2*thickness, // TODO: flap length
    length - 10 * thickness
  );
  const insideN = buildRectangle(
    startX + 4*thickness,
    startY - height - 4* thickness,
    width - 8 * thickness,
    -height + 2* thickness  // TODO: flap length
  );

  const flapEN = buildRectangle(
    startX,
    startY+thickness,
    -height,
    -width / 2
  );
  const flapES = buildRectangle(
    startX,
    startY + length - thickness,
    -height,
    width / 2
  );
  const flapWS = buildRectangle(
    startX + width,
    startY + length - thickness,
    height,
    width / 2
  );
  const flapWN = buildRectangle(
    startX + width,
    startY+thickness,
    height,
    -width / 2
  );

  const leftSlots = [];
  const rightSlots = [];
  let fromTop = sections[0];
  for (let i = 1; i < sections.length; i++) {
    leftSlots.push(
      buildRectangle(
        insideE.NW.x,
        sideE.NE.y + fromTop - 2*thickness,
        -height + 2* thickness,
        thickness * 2
      )
    );
    rightSlots.push(
      buildRectangle(
        insideW.NE.x,
        sideW.NE.y + fromTop - 2* thickness,
        height - 2*thickness,
        thickness * 2
      )
    );
    fromTop += sections[i];
  }

  const leftSlotsPath = leftSlots
    .map((slot) => `${slot.NE} ${slot.NW} ${slot.SW} ${slot.SE}`)
    .join(' ');
  const rightSlotsPath = rightSlots
    .reverse()
    .map((slot) => `${slot.SW} ${slot.SE} ${slot.NE} ${slot.NW}`)
    .join(' ');

  const cutPath = `M ${bottom.NE}
    ${flapEN.SW} ${flapEN.NW} ${flapEN.NE} ${flapEN.SE}
    ${sideE.NE} ${insideE.NW} ${insideE.NE}
    ${leftSlotsPath}
    ${insideE.SE} ${insideE.SW} ${sideE.SE}
    ${flapES.NE} ${flapES.SE} ${flapES.SW} ${flapES.NW}
    ${bottom.SE}
    ${sideS.SE} ${insideS.NE} ${insideS.SE} ${insideS.SW} ${insideS.NW}  ${sideS.SW}
    ${bottom.SW}
    ${flapWS.NE} ${flapWS.SE} ${flapWS.SW} ${flapWS.NW}
    ${sideW.SW} ${insideW.SE} ${insideW.SW}
    ${rightSlotsPath}
    ${insideW.NW} ${insideW.NE} ${sideW.NW}
    ${flapWN.SW} ${flapWN.NW} ${flapWN.NE} ${flapWN.SE} 
    ${bottom.NW}
    ${sideN.NW} ${insideN.SW} ${insideN.NW} ${insideN.NE} ${insideN.SE} ${sideN.NE}
    ${bottom.NE}`;

  const scoreMain = `M ${bottom.NE} ${bottom.SE} ${bottom.SW} ${bottom.NW} ${bottom.NE}`;
  const scoreLeftFlap = `M ${sideE.NE} ${sideE.SE} M ${insideE.NW} ${insideE.SW}`;
  const scoreRightFlap = `M ${sideW.NW} ${sideW.SW} M ${insideW.NE} ${insideW.SE}`;
  const scoreTopFlap = `M ${sideN.NE} ${sideN.NW} M ${insideN.SE} ${insideN.SW}`;
  const scoreBottomFlap = `M ${sideS.SE} ${sideS.SW} M ${insideS.NE} ${insideS.NW}`;

  const scoreFlaps = `M ${flapEN.SE} ${flapEN.SW}
      M ${flapES.NE} ${flapES.NW}
      M ${flapWN.SE} ${flapWN.SW}
      M ${flapWS.NE} ${flapWS.NW}`;

  const half = thickness / 2;

  const sectionBottoms = [];
  const sectionBorders = [
    buildRectangle(startX + half, startY, width - thickness, -height + half),
  ];
  const insetFlapsLeft = [
    buildRectangle(
      startX + half,
      startY - half,
      -sections[0] / 2 + half,
      -height + 2 * half
    ),
  ];
  const insetFlapsRight = [
    buildRectangle(
      startX + width - half,
      startY - half,
      sections[0] / 2 - half,
      -height + 2 * half
    ),
  ];
  let fromTopInsert = 2* thickness;
  for (let i = 0; i < sections.length; i++) {
    sectionBottoms.push(
      buildRectangle(
        startX + thickness,
        startY + fromTopInsert,
        width - 2*thickness,
        sections[i] - 2* thickness
      )
    );
    insetFlapsLeft.push(
      buildRectangle(
        startX + half,
        startY + fromTopInsert + half,
        -height + 2 * half,
        sections[i] - 3 * half
      )
    );
    insetFlapsRight.push(
      buildRectangle(
        startX + width - half,
        startY + fromTopInsert + half,
        height - 2 * half,
        sections[i] - 3 * half
      )
    );
    sectionBorders.push(
      buildRectangle(
        startX + half,
        startY + fromTopInsert + sections[i] - half,
        width - thickness,
        height - half
      )
    );
    insetFlapsLeft.push(
      buildRectangle(
        startX + half,
        startY + fromTopInsert + sections[i],
        -sections[i] / 2 + half,
        height - 3 * half
      )
    );
    insetFlapsRight.push(
      buildRectangle(
        startX + width - half,
        startY + fromTopInsert + sections[i],
        sections[i] / 2 - half,
        height - 3 * half
      )
    );
    if (i < sections.length - 1) {
      sectionBorders.push(
        buildRectangle(
          startX + half,
          startY + fromTopInsert + sections[i] + height - half,
          width - thickness,
          height - half
        )
      );
      insetFlapsLeft.push(
        buildRectangle(
          startX + half,
          startY + fromTopInsert + sections[i] + height,
          -sections[i + 1] / 2 + half,
          height - 3 * half
        )
      );
      insetFlapsRight.push(
        buildRectangle(
          startX + width - half,
          startY + fromTopInsert + sections[i] + height,
          sections[i + 1] / 2 - half,
          height - 3 * half
        )
      );
    }
    fromTopInsert += sections[i] + 2 * height - 2 * half;
  }

  const insertCut = [
    'M',
    insetFlapsLeft
      .map((border) => `${border.NW} ${border.NE} ${border.SE} ${border.SW}`)
      .join(' '),
    insetFlapsRight
      .reverse()
      .map((border) => `${border.SE} ${border.SW} ${border.NW} ${border.NE}`)
      .join(' '),
    insetFlapsLeft[0].NW,
  ].join(' ');

  const insertScore = [
    `M ${insetFlapsLeft[0].NW} ${insetFlapsLeft[insetFlapsLeft.length - 1].SW}`,
    `M ${insetFlapsRight[0].SE} ${
      insetFlapsRight[insetFlapsRight.length - 1].NE
    }`,
    `${sectionBorders
      .flatMap((border) => [
        `M ${border.NE} ${border.NW}`,
        `M ${border.SE} ${border.SW}`,
      ])
      .slice(1, -1)
      .join(' ')} `,
  ].join(' ');

  const totalTopWidth = roundToPrecision(insideW.SW.x * 100 - insideE.SE.x * 100) / 100;
  const totalBottomWidth = roundToPrecision(
    Math.max(...insetFlapsRight.map((flap) => flap.SW.x)) * 100 -
    Math.min(...insetFlapsLeft.map((flap) => flap.SE.x))* 100) /100;

 console.log(totalBottomWidth, Math.max(...insetFlapsRight.map((flap) => flap.SW.x)), Math.min(...insetFlapsLeft.map((flap) => flap.SE.x)));

  return (
    <div className='boxesContainers'>
      <div className='svgContainer' id='top_svg' data-width={totalTopWidth}>
        <svg
          xmlns='http://www.w3.org/2000/svg'
          version='1.1'
          viewBox='0 0 215 279'
          preserveAspectRatio='xMinYMin meet'>
          <title>Box without sections</title>
          <g
            className='cut'
            stroke='rgb(220,20,60)'
            fill='none'
            strokeWidth='.2'>
            <path className='cut' id='outside' d={cutPath} />
          </g>
          <g
            className='fold'
            stroke='rgb(0, 191, 255)'
            fill='none'
            strokeWidth='0.2'
            strokeDasharray='1,1'>
            <path
              className='fold'
              id='MAIN'
              d={`${scoreMain}
            ${scoreLeftFlap}
            ${scoreTopFlap}
            ${scoreRightFlap}
            ${scoreBottomFlap}
            ${scoreFlaps}`}
            />
          </g>
        </svg>
      </div>
      <div
        className='svgContainer'
        id='bottom_svg'
        data-width={totalBottomWidth}>
        <svg
          xmlns='http://www.w3.org/2000/svg'
          viewBox='0 0 215 279'
          preserveAspectRatio='xMinYMin meet'>
          <title>Sections</title>
          <g
            className='cut'
            stroke='rgb(220,20,60)'
            fill='none'
            strokeWidth='0.2'>
            <path className='cut' id='outside' d={insertCut} />
          </g>
          <g
            className='fold'
            stroke='rgb(0, 191, 255)'
            fill='none'
            strokeWidth='0.2'
            strokeDasharray='1,1'>
            <path className='fold' id='INSERT' d={insertScore} />
          </g>
        </svg>
      </div>
    </div>
  );
}

export default Box;
